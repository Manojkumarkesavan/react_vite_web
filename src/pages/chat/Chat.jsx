// Chat.jsx
import { useState, useRef, useEffect } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import axios from "axios";
import UserService from "../../Service/UserService.jsx";

const debounce = (func, delay) => {
  let debounceTimer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notificationSound, setNotificationSound] = useState(true);
  const [callStatus, setCallStatus] = useState("idle"); // "idle", "in-progress", "ended"
  const [isVideoCall, setIsVideoCall] = useState(false); // true for video call, false for voice call
  const [peerConnection, setPeerConnection] = useState(null); // Store the peer connection
  const [localStream, setLocalStream] = useState(null); // Local media stream (audio/video)
  const [remoteStream, setRemoteStream] = useState(null); // Remote media stream
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const [activeChat, setActiveChat] = useState(0);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const chatList = [
    {
      id: 0,
      name: "John Doe",
      lastMessage: "Bye..!!",
      time: "10:42 PM",
      online: true,
    },
    {
      id: 1,
      name: "Sarah Corner",
      lastMessage: "hey..!!",
      time: "8:52 AM",
      online: false,
    },
    {
      id: 2,
      name: "Santhosh L",
      lastMessage: "Bye..!!",
      time: "3:42 PM",
      online: true,
    },
    {
      id: 3,
      name: "Sharmila Asokan",
      lastMessage: "Bruh..!!",
      time: "12:22 AM",
      online: false,
    },
    {
      id: 4,
      name: "Giri",
      lastMessage: "Ji..card mudichachu next  enna?",
      time: "9:28 AM",
      online: false,
    },
  ];

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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const newMessage = {
      text: inputValue,
      sender: "user",
      avatar: "https://via.placeholder.com/40",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sending",
    };

    const messageIndex = messages.length;
    setMessages([...messages, newMessage]);
    setInputValue("");

    setTimeout(() => updateMessageStatus(messageIndex, "sent"), 500);
    setTimeout(() => updateMessageStatus(messageIndex, "delivered"), 1000);
    setTimeout(() => updateMessageStatus(messageIndex, "read"), 1500);

    setTimeout(() => {
      const botMessage = {
        text: "This is a simulated response.",
        sender: "bot",
        avatar: "https://via.placeholder.com/40",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      if (notificationSound) {
        const audio = new Audio("https://www.soundjay.com/button/beep-07.wav");
        audio.play();
      }
    }, 1000);
  };

  const updateMessageStatus = (index, status) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      if (updatedMessages[index]) {
        updatedMessages[index].status = status;
      }
      return updatedMessages;
    });
  };

  // const handleStartCall = (isVideo) => {
  //   setIsVideoCall(isVideo);
  //   setCallStatus("in-progress");
  //   // Initialize peer connection and local media stream
  //   setupPeerConnection();
  //
  //   // Get local media stream (audio/video)
  //   navigator.mediaDevices
  //     .getUserMedia({ video: isVideo, audio: true })
  //     .then((stream) => {
  //       setLocalStream(stream);
  //       if (isVideo) {
  //         // Display local video (if video call)
  //         const localVideoElement = document.getElementById("localVideo");
  //         localVideoElement.srcObject = stream;
  //       }
  //       // Add local stream to peer connection
  //       peerConnection.addStream(stream);
  //     })
  //     .catch((err) => {
  //       console.error("Error getting user media", err);
  //     });
  // };

  // const setupPeerConnection = () => {
  //   const pc = new RTCPeerConnection({
  //     iceServers: [
  //       { urls: "stun:stun.l.google.com:19302" }, // Use Google's STUN server
  //     ],
  //   });
  //   pc.onicecandidate = (event) => {
  //     if (event.candidate) {
  //       // Send candidate to remote peer (via signaling server)
  //     }
  //   };
  //
  //   pc.onaddstream = (event) => {
  //     // When remote stream is added, display remote video (if video call)
  //     setRemoteStream(event.stream);
  //     if (isVideoCall) {
  //       const remoteVideoElement = document.getElementById("remoteVideo");
  //       remoteVideoElement.srcObject = event.stream;
  //     }
  //   };
  //
  //   setPeerConnection(pc);
  // };

  // const handleEndCall = () => {
  //   setCallStatus("ended");
  //   peerConnection.close();
  //   setLocalStream(null);
  //   setRemoteStream(null);
  //   setPeerConnection(null);
  // };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  // h-[calc(88vh-2rem)]

  const [isCalling, setIsCalling] = useState(false);

  const handleVideoCall = () => {
    // Placeholder for video call logic
    console.log("Initiating video call...");
    setIsCalling(true);
    // Implement actual call logic here
  };

  // Function to end the call
  const endCall = () => {
    console.log("Ending call...");
    setIsCalling(false);
    // Implement actual end call logic here
  };

  const handleVoiceCall = () => {
    // Placeholder for voice call logic
    console.log("Initiating voice call...");
    setIsCalling(true);
    // Implement actual call logic here
  };
  const signalingServerRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
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
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }], //
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
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const fetchUsers = async (query) => {
    const token = localStorage.getItem("access_token");
    try {
      const response = await UserService.search({ query }, token); // Await the promise
      setResults(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const debouncedFetchUsers = debounce(fetchUsers, 300);
  useEffect(() => {
    if (searchTerm) {
      debouncedFetchUsers(searchTerm);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  return (
    <div style={{ height: "35.7rem" }} className="rounded-lg -ml-2.5">
      <div className="bg-white dark:bg-gray-900 flex h-full rounded-lg">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
          <header className="p-4 bg-white dark:bg-gray-800 flex items-center justify-between shadow">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Chat with Bot
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
              <div>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ul className="bg-white shadow rounded">
                  {results.map((user) => (
                    <li key={user.id} className="p-2 border-b last:border-b-0">
                      <span className="font-semibold">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-gray-500">({user.email})</span>
                    </li>
                  ))}
                  {results.length === 0 && searchTerm && (
                    <li className="p-2 text-gray-500">No users found</li>
                  )}
                </ul>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto">
            {chatList.map((chat) => (
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
            ))}
          </div>
        </aside>
        {/* Main Chat Section */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="p-4 bg-white dark:bg-gray-800 flex items-center justify-between shadow">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {chatList[activeChat]?.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {chatList[activeChat]?.online
                  ? "Online"
                  : `Last seen: ${chatList[activeChat]?.time}`}
              </p>
            </div>
            <div className="flex items-center gap-4">
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
            className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900"
          >
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center">No messages yet.</p>
            ) : (
              <div className="space-y-3 flex flex-col">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg max-w-xs shadow-md ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white self-end"
                        : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 self-start"
                    }`}
                  >
                    {msg.text}
                    {msg.sender === "user" && (
                      <div className="text-xs mt-1">
                        {msg.status === "sending" && <span>Sending...</span>}
                        {msg.status === "sent" && <span>Sent</span>}
                        {msg.status === "delivered" && <span>Delivered</span>}
                        {msg.status === "read" && <span>Read</span>}
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
            )}
          </div>

          {/* Input Area */}
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
