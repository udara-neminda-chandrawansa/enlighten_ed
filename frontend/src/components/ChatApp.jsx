import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";
import { Send } from "lucide-react";
import GetUserByID from "./GetUserByID";

const socket = io("https://enlighten-ed.onrender.com", {
  path: "/socket.io", // Explicitly set the socket.io path
  // path: '/',
  transports: ["websocket"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

function ChatApp({ receiver }) {
  const userID = JSON.parse(Cookies.get("auth"))["user_id"];
  const username = JSON.parse(Cookies.get("auth"))["username"];
  const recieverObj = GetUserByID({ userID: receiver });
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(()=>{
    console.log(recieverObj);
  }, [recieverObj])

  useEffect(() => {
    socket.on("send message", (data) => {
      if (
        data.sender === userID ||
        data.receiver === userID ||
        receiver === "0"
      ) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off("send message");
    };
  }, []);

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message && userID) {
      const messageData = {
        sender: userID,
        senderName: username,
        receiver: receiver,
        content: message,
        type: "message",
        timestamp: new Date().toISOString(),
      };

      socket.emit("send message", messageData);
      console.log(userID);
      setMessage("");
    }
  };
  return (
    <div className="flex flex-col w-full">
      <div
        id="message-container"
        className="flex-grow h-[68dvh] lg:h-[65dvh] overflow-y-scroll scroll-smooth no-scrollbar"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.sender === userID ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-header">
              {msg.senderName}
              <time className="ml-2 text-xs opacity-50">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </time>
            </div>
            <div className="chat-bubble">{msg.content}</div>
            <div className="opacity-50 chat-footer">Sent</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-3 pt-3">
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full input input-bordered"
          required
        />
        <button
          type="submit"
          className="p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          <Send />
        </button>
      </form>
    </div>
  );
}

export default ChatApp;
