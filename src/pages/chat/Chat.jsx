// Chat.jsx
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import io from "socket.io-client";
import Notification from "../../components/Notification"; // Adjust the path if needed
import notificationSound from "../../assets/sounds/notification.mp3";
import axios from "axios";
import debounce from "lodash.debounce";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import UserService from "../../Service/UserService";
import BeginChatSvg from "../../assets/images/svg/begin_chat.svg";

const Chat = () => {
  // State Variables
  const [chatList, setChatList] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  // Refs
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatListRef = useRef(chatList);
  const userIdRef = useRef(null);

  // Notification State
  const [notification, setNotification] = useState({
    message: "",
    visible: false,
  });

  const audioRef = useRef(new Audio(notificationSound));

  // Constants
  const SOCKET_SERVER_URL = "http://localhost:3000";
  axios.defaults.baseURL = "http://localhost:8088";

  // Retrieve User Data
  const userData = JSON.parse(localStorage.getItem("response_data"));
  const userId = userData?.users?.id;
  userIdRef.current = userId;

  // Function to Show Notification
  const showNotification = (message) => {
    setNotification({ message, visible: true });
  };

  // Function to Hide Notification
  const hideNotification = () => {
    setNotification({ message: "", visible: false });
  };

  // Update chatListRef Whenever chatList Changes
  useEffect(() => {
    chatListRef.current = chatList;
  }, [chatList]);

  // Fetch Conversations on Mount
  useEffect(() => {
    const fetchConversations = async () => {
      const token = localStorage.getItem("access_token");

      try {
        const response = await UserService.getConversation(userId, token);

        // Fetch Unread Message Counts
        const unreadCountsResponse = await axios.get(
          `/api/users/${userId}/unread-counts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const unreadCounts = unreadCountsResponse.data;

        const conversations = await Promise.all(
          response.data.map(async (conv) => {
            const otherUserId = conv.user1 === userId ? conv.user2 : conv.user1;
            const userResponse = await UserService.getUserById(
              otherUserId,
              token,
            );
            const otherUser = userResponse.data;

            const lastMessage = conv.messages?.length
              ? conv.messages[conv.messages.length - 1]
              : null;

            return {
              id: conv.id,
              name: `${otherUser.firstName} ${otherUser.lastName}`,
              lastMessage: lastMessage?.content || "",
              time: lastMessage
                ? new Date(lastMessage.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "",
              online: otherUser.online || false,
              otherUserId,
              unreadCount: unreadCounts[conv.id.toString()] || 0,
            };
          }),
        );

        setChatList(conversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, [userId]);

  // Fetch Messages When Active Chat Changes
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

  // Scroll to Bottom When Messages Change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize Socket.IO Client
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    // Handle Receiving a Message
    socketRef.current.on("receive-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      if (message.sender !== userIdRef.current) {
        audioRef.current.play();

        // Find the Sender's Name
        const senderName =
          chatListRef.current.find(
            (chat) => chat.otherUserId === message.sender,
          )?.name || "a user";

        // Show the Notification
        showNotification(`New message from ${senderName}`);

        // Update Unread Count for the Conversation
        setChatList((prevChatList) =>
          prevChatList.map((chat) =>
            chat.id === message.conversation.id
              ? { ...chat, unreadCount: (chat.unreadCount || 0) + 1 }
              : chat,
          ),
        );
      }

      // Send Acknowledgment Back to the Server
      socketRef.current.emit("message-delivered", {
        messageId: message.id,
        conversationId: message.conversation.id,
      });
    });

    // Handle Message Sent Acknowledgment
    socketRef.current.on("message-sent", ({ tempId, message }) => {
      // Update the Message in the Messages Array
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.tempId === tempId ? { ...message, status: "SENT" } : msg,
        ),
      );
    });

    // Handle Message Status Updates
    socketRef.current.on("message-status-updated", ({ messageId, status }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          Number(msg.id) === Number(messageId) ? { ...msg, status } : msg,
        ),
      );
    });

    socketRef.current.on("error", (error) => {
      console.error("Error from server:", error.message);
    });

    return () => {
      socketRef.current.off("receive-message");
      socketRef.current.off("message-sent");
      socketRef.current.off("message-status-updated");
      socketRef.current.off("error");
      socketRef.current.disconnect();
    };
  }, []); // Empty dependency array

  // Join Room When Active Chat Changes
  useEffect(() => {
    if (activeChat && socketRef.current) {
      const roomId = String(activeChat);
      socketRef.current.emit("join", { conversationId: roomId });
      console.log(`Joined room ${roomId}`);
    }
  }, [activeChat]);

  // Reset Unread Count When Active Chat Changes
  useEffect(() => {
    if (activeChat) {
      setChatList((prevChatList) =>
        prevChatList.map((chat) =>
          chat.id === activeChat ? { ...chat, unreadCount: 0 } : chat,
        ),
      );
    }
  }, [activeChat]);

  // Handle Input Change
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

  // Handle Sending a Message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const receiverId = chatList.find(
      (chat) => chat.id === activeChat,
    )?.otherUserId;

    if (!receiverId) {
      console.error("Receiver ID not found");
      return;
    }

    const tempId = "temp-" + new Date().getTime();

    const newMessage = {
      tempId,
      content: inputValue,
      sender: userId,
      receiver: receiverId,
      timestamp: new Date().toISOString(),
      conversation: { id: activeChat },
      status: "SENDING",
    };

    setInputValue("");
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      // Emit the Message to the Server
      socketRef.current.emit("send-message", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      // Update the Message Status to 'FAILED'
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.tempId === tempId ? { ...msg, status: "FAILED" } : msg,
        ),
      );
    }
  };

  // Handle Read Receipts
  useEffect(() => {
    if (activeChat && messages.length > 0) {
      const unreadMessages = messages.filter(
        (msg) => msg.sender !== userId && msg.status !== "READ",
      );

      unreadMessages.forEach((msg) => {
        socketRef.current.emit("message-read", {
          messageId: msg.id,
          conversationId: activeChat,
        });
      });
    }
  }, [activeChat, messages]);

  // Fetch Users (Search)
  const fetchUsers = useCallback(async (query) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await UserService.search({ query }, token);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  const debouncedFetchUsers = useMemo(
    () => debounce((query) => fetchUsers(query), 300),
    [fetchUsers],
  );

  useEffect(() => {
    if (searchTerm) {
      debouncedFetchUsers(searchTerm);
    } else {
      setSearchResults([]);
    }
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [searchTerm, debouncedFetchUsers]);

  // Start Chat with a User
  const startChatWithUser = async (user) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await UserService.startConversation(
        userId,
        user.id,
        token,
      );

      const conversation = response.data;
      if (!chatList.find((chat) => chat.id === conversation.id)) {
        setChatList((prevChatList) => [
          {
            id: conversation.id,
            name: `${user.firstName} ${user.lastName}`,
            lastMessage: "",
            time: "",
            online: user.online || false,
            otherUserId: user.id,
            unreadCount: 0,
          },
          ...prevChatList,
        ]);
      }

      setActiveChat(conversation.id);
      setSearchTerm("");
      setSearchResults([]);
    } catch (error) {
      console.error("Error starting chat with user:", error);
    }
  };

  // Handle Emoji Select
  const handleEmojiSelect = (emoji) => {
    setInputValue((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  // Placeholder Functions for Calls
  const handleStartCall = async () => {
    // Implement call logic here
    console.log("Starting voice call...");
    setIsCalling(true);
  };

  const handleVideoCall = () => {
    // Implement video call logic here
    console.log("Starting video call...");
    setIsCalling(true);
  };

  const handleEndCall = () => {
    // Implement end call logic here
    console.log("Ending call...");
    setIsCalling(false);
  };

  // Handle Setting Active Chat
  const handleSetActiveChat = (conversationId) => {
    setActiveChat(conversationId);
  };

  return (
    <div style={{ height: "35.7rem" }} className="rounded-lg -ml-2.5">
      <div className="bg-white dark:bg-gray-900 flex h-full rounded-lg">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
          {/* Header */}
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
                    {searchResults
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
                    {searchResults.length === 0 && (
                      <li className="p-1 text-gray-500">No users found</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </header>
          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {chatList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <img
                  src={BeginChatSvg}
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
                  onClick={() => handleSetActiveChat(chat.id)}
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
                  {/* Unread Count Badge */}
                  {chat.unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
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
              {/* Call Buttons */}
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
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 flex flex-col">
            {!activeChat ? (
              <div className="text-center flex flex-col items-center justify-center">
                <img
                  src={BeginChatSvg}
                  alt="Start conversation"
                  className="w-64 h-64 mb-4"
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
                      key={msg.id || msg.tempId || index}
                      className={`p-3 rounded-lg max-w-xs shadow-md ${
                        msg.sender === userId
                          ? "bg-blue-500 text-white self-end"
                          : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 self-start"
                      }`}
                    >
                      {msg.content}
                      {msg.sender === userId && (
                        <div className="text-xs mt-1">
                          {msg.status === "SENDING" && <span>Sending...</span>}
                          {msg.status === "SENT" && <span>Sent</span>}
                          {msg.status === "DELIVERED" && <span>Delivered</span>}
                          {msg.status === "READ" && <span>Read</span>}
                          {!msg.status && <span>Sent</span>}
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
                    onEmojiSelect={handleEmojiSelect}
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
      {/* Notification */}
      {notification.visible && (
        <Notification
          message={notification.message}
          onClose={hideNotification}
        />
      )}
    </div>
  );
};

export default Chat;
