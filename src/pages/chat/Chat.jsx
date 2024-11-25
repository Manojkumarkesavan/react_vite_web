// Chat.jsx
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import axios from "axios";
import UserService from "../../Service/UserService.jsx";
import debounce from "lodash.debounce";
import BeginChatSvg from "../../assets/images/svg/begin_chat.svg";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const Chat = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notificationSound, setNotificationSound] = useState(true);
  const [callStatus, setCallStatus] = useState("idle");
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const [activeChat, setActiveChat] = useState(null);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [chatList, setChatList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  axios.defaults.baseURL = "http://localhost:8088";

  /* Onload UseEffect to Fetch Conversations */
  useEffect(() => {
    const fetchConversations = async () => {
      const token = localStorage.getItem("access_token");
      const userId = JSON.parse(localStorage.getItem("response_data")).users.id;

      try {
        const response = await UserService.getConversation(userId, token);

        // Map conversations to chatList format
        const conversations = await Promise.all(
          response.data.map(async (conv) => {
            const otherUserId = conv.user1 === userId ? conv.user2 : conv.user1;
            // Fetch the other user's details
            const userResponse = await UserService.getUserById(
              otherUserId,
              token,
            );
            const otherUser = userResponse.data;

            const lastMessage =
              conv.messages && conv.messages.length
                ? conv.messages[conv.messages.length - 1]
                : null;

            return {
              id: conv.id,
              name: `${otherUser.firstName} ${otherUser.lastName}`,
              lastMessage: lastMessage ? lastMessage.content : "",
              time: lastMessage
                ? new Date(lastMessage.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "",
              online: otherUser.online || false, // Update as per your logic
              otherUserId,
            };
          }),
        );

        setChatList(conversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  /* UseEffect to Fetch Messages When Active Chat Changes */
  useEffect(() => {
    const fetchMessages = async () => {
      if (activeChat) {
        const token = localStorage.getItem("access_token");
        try {
          const response = await UserService.fetchMessages(activeChat, token);
          setMessages(response.data || []);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      } else {
        setMessages([]);
      }
    };

    fetchMessages();
  }, [activeChat]);

  /* Scroll to Bottom When Messages Change */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  /* Handle Input Change */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  /* Handle Sending a Message */
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const token = localStorage.getItem("access_token");
    const senderId = JSON.parse(localStorage.getItem("response_data")).users.id;
    const receiverId = chatList.find(
      (chat) => chat.id === activeChat,
    )?.otherUserId;

    const newMessage = {
      content: inputValue,
      sender: senderId,
      receiver: receiverId,
      timestamp: new Date().toISOString(),
      conversation: { id: activeChat },
      status: "sending",
    };

    setInputValue("");
    const tempId = "temp-" + new Date().getTime();
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...newMessage, id: tempId, status: "sending" },
    ]);

    // Update chatList with the latest message
    setChatList((prevChatList) =>
      prevChatList.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              lastMessage: newMessage.content,
              time: new Date(newMessage.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : chat,
      ),
    );

    try {
      const response = await UserService.sendMessage(newMessage, token);
      // Update the message ID and status
      updateMessageStatus(messages.length - 1, "sent", response.data.id);
    } catch (error) {
      console.error("Error sending message:", error);
      //updateMessageStatus(messages.length - 1, "failed");
      updateMessageStatus(tempId, "failed");
    }
  };

  /* Update Message Status */
  const updateMessageStatus = (index, status, messageId = null) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      if (updatedMessages[index]) {
        updatedMessages[index].status = status;
        if (messageId) {
          updatedMessages[index].id = messageId;
        }
      }
      return updatedMessages;
    });
  };

  // h-[calc(88vh-2rem)]

  /* WebRTC Functions (unchanged) */
  const signalingServerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  /* WebRTC Functions */
  useEffect(() => {
    signalingServerRef.current = new WebSocket("ws://localhost:3000");

    signalingServerRef.current.onmessage = async (message) => {
      const data = JSON.parse(message.data);

      if (data.answer) {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(data.answer),
        );
      } else if (data.offer) {
        console.log("offer :" + data.offer);
        if (!peerConnectionRef.current) createPeerConnection();

        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(data.offer),
        );
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        signalingServerRef.current.send(JSON.stringify({ answer }));
      } else if (data.iceCandidate) {
        try {
          await peerConnectionRef.current.addIceCandidate(data.iceCandidate);
        } catch (e) {
          console.error("Error adding received ice candidate", e);
        }
      }
    };

    return () => signalingServerRef.current.close();
  }, []);

  const createPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        signalingServerRef.current.send(
          JSON.stringify({ iceCandidate: event.candidate }),
        );
      }
    };

    peerConnectionRef.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };
  };

  const handleStartCall = async () => {
    setIsCalling(true);
    createPeerConnection();

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStream
      .getTracks()
      .forEach((track) =>
        peerConnectionRef.current.addTrack(track, localStream),
      );
    localVideoRef.current.srcObject = localStream;

    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);

    signalingServerRef.current.send(JSON.stringify({ offer }));
  };

  const handleVideoCall = () => {
    // Placeholder for video call logic
    console.log("Initiating video call...");
    setIsCalling(true);
    // Implement actual call logic here
  };

  const handleEndCall = () => {
    setIsCalling(false);
    peerConnectionRef.current.close();
    peerConnectionRef.current = null;
    localVideoRef.current.srcObject
      .getTracks()
      .forEach((track) => track.stop());
    remoteVideoRef.current.srcObject = null;
  };

  /* search users */

  const fetchUsers = useCallback(async (query) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await UserService.search({ query }, token);
      setResults(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  const debouncedFetchUsers = useMemo(
    () =>
      debounce((query) => {
        fetchUsers(query);
      }, 300),
    [fetchUsers],
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedFetchUsers(searchTerm);
    } else {
      setResults([]);
    }
    // Cleanup function to cancel debounce on unmount
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [searchTerm, debouncedFetchUsers]);

  /* Start Chat with a User */
  const startChatWithUser = async (user) => {
    const token = localStorage.getItem("access_token");
    const currentUserId = JSON.parse(localStorage.getItem("response_data"))
      .users.id;
    try {
      const response = await UserService.startConversation(
        currentUserId,
        user.id,
        token,
      );

      const conversation = response.data;
      // Add the conversation to the chat list if it's a new one
      if (!chatList.find((chat) => chat.id === conversation.id)) {
        setChatList((prevChatList) => [
          {
            id: conversation.id,
            name: `${user.firstName} ${user.lastName}`,
            lastMessage: "",
            time: "",
            online: user.online || false, // Assuming you have this info
            otherUserId: user.id,
          },
          ...prevChatList,
        ]);
      }

      // Set the active chat
      setActiveChat(conversation.id);

      // Clear search
      setSearchTerm("");
      setResults([]);
    } catch (error) {
      console.error("Error starting chat with user:", error);
    }
  };

  const stompClient = useRef(null);
  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS("http://localhost:8088/ws", null, {
        transports: ["websocket", "xhr-streaming", "xhr-polling"],
      });
      stompClient.current = Stomp.over(sock);
      stompClient.current.connect({}, () => {
        console.log("Connected to WebSocket");
        if (activeChat) {
          stompClient.current.subscribe(
            `/topic/messages/${activeChat}`,
            (message) => {
              const newMessage = JSON.parse(message.body);
              setMessages((prevMessages) => [...prevMessages, newMessage]);
            },
          );
        }
      });
    };

    connectWebSocket();

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, [activeChat]);

  return (
    <div style={{ height: "35.7rem" }} className="rounded-lg -ml-2.5">
      <div className="bg-white dark:bg-gray-900 flex h-full rounded-lg">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
          <header className="p-2 bg-white dark:bg-gray-800 flex items-center justify-between shadow">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Chat
              </h2>
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  className="w-full p-1 border border-gray-300 rounded mb-1"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <ul className="absolute left-0 right-0 bg-white shadow rounded z-10 max-h-60 overflow-y-auto">
                    {results
                      .filter((user) =>
                        `${user.firstName} ${user.lastName}`
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                      )
                      .map((user) => (
                        <li
                          key={user.id}
                          className="p-1 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer"
                          onClick={() => startChatWithUser(user)}
                        >
                          <span className="font-semibold text-sm">
                            {user.firstName} {user.lastName}
                          </span>{" "}
                          <span className="text-gray-500 text-sm">
                            ({user.email})
                          </span>
                        </li>
                      ))}
                    {results.length === 0 && (
                      <li className="p-1 text-gray-500">No users found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto">
            {chatList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <img
                  src={BeginChatSvg} // Use the imported SVG
                  alt="No chats"
                  className="w-32 h-32 mb-4"
                />
                <p className="text-gray-500">
                  You have no conversations yet. Start a new chat!
                </p>
              </div>
            ) : (
              chatList.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                    activeChat === chat.id
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                    {chat.name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                      {chat.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">{chat.time}</p>
                </div>
              ))
            )}
          </div>
        </aside>
        {/* Main Chat Section */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="p-4 bg-white dark:bg-gray-800 flex items-center justify-between shadow">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {chatList.find((chat) => chat.id === activeChat)?.name ||
                  "Welcome!"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeChat
                  ? chatList.find((chat) => chat.id === activeChat)?.online
                    ? "Online"
                    : ""
                  : "You are ready to start chatting"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Conditionally render call buttons only when a chat is active */}
              {activeChat && (
                <>
                  <button
                    className="text-gray-500 dark:text-gray-300 hover:text-blue-500 transition"
                    onClick={handleStartCall}
                  >
                    📞
                  </button>
                  <button
                    className="text-gray-500 dark:text-gray-300 hover:text-blue-500 transition"
                    onClick={handleVideoCall}
                  >
                    📹
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ⋮
                {showDropdown && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-gray-700 shadow-lg rounded-md w-40 z-20">
                    <ul className="text-sm text-gray-700 dark:text-gray-200">
                      <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                        Settings
                      </li>
                    </ul>
                  </div>
                )}
              </button>
            </div>
          </header>
          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center"
          >
            {!activeChat ? (
              <div className="text-center flex flex-col items-center justify-center">
                <img
                  src={BeginChatSvg} // Replace with your image path
                  alt="Start conversation"
                  className="w-64 h-64 mb-4 items-center "
                />
                <p className="text-gray-500 text-lg">
                  You are ready to start a conversation. Select a chat or search
                  for someone to talk to!
                </p>
              </div>
            ) : messages.length === 0 ? (
              <p className="text-gray-500 text-center">No messages yet.</p>
            ) : (
              <div className="w-full">
                <div className="space-y-3 flex flex-col">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg max-w-xs shadow-md ${
                        msg.sender ===
                        JSON.parse(localStorage.getItem("response_data")).users
                          .id
                          ? "bg-blue-500 text-white self-end"
                          : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 self-start"
                      }`}
                    >
                      {msg.content}
                      {msg.sender ===
                        JSON.parse(localStorage.getItem("response_data")).users
                          .id && (
                        <div className="text-xs mt-1">
                          {msg.status === "sending" && <span>Sending...</span>}
                          {msg.status === "sent" && <span>Sent</span>}
                          {msg.status === "failed" && (
                            <span className="text-red-500">Failed to send</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      The other user is typing...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          {activeChat && (
            <div className="p-4 bg-white dark:bg-gray-800 flex items-center gap-3 shadow-lg relative">
              <button
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="text-2xl text-gray-700 dark:text-gray-300 hover:text-gray-500"
              >
                😊
              </button>
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-16 left-4 z-20 bg-white dark:bg-gray-700 p-2 rounded-md shadow-lg"
                >
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji) => {
                      setInputValue((prev) => prev + emoji.native);
                      setShowEmojiPicker(false);
                    }}
                    theme={
                      localStorage.getItem("darkMode") === "true"
                        ? "dark"
                        : "light"
                    }
                  />
                </div>
              )}
              <input
                type="text"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                placeholder="Type your message..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          )}
          {/* Call Status Feedback */}
          {isCalling && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg">
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                  In Call...
                </p>
                <div>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    style={{ width: "200px", height: "150px" }}
                  />
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    style={{ width: "200px", height: "150px" }}
                  />
                </div>
                <button
                  onClick={handleEndCall}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  End Call
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Chat;
