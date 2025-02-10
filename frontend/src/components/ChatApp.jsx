import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://enlighten-ed.onrender.com", {
  path: "/socket.io", // Explicitly set the socket.io path
  // path: '/',
  transports: ["websocket"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

function ChatApp() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("send name", (username) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "name", content: username },
      ]);
    });

    socket.on("send message", (chat) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "message", content: chat },
      ]);
    });

    return () => {
      socket.off("send name");
      socket.off("send message");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message && username) {
      socket.emit("send name", username);
      socket.emit("send message", message);
      setMessage("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="mb-5 text-3xl font-bold text-center text-green-500">
        GeeksforGeeks
      </h1>
      <h2 className="mb-5 text-xl text-center">Chat App using Socket.io</h2>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border border-gray-400 rounded-md"
          required
        />
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 border border-gray-400 rounded-md"
          required
        />
        <button
          type="submit"
          className="p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </form>

      <div className="pt-4 mt-5 border-t">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${
              msg.type === "name"
                ? "bg-gray-200 text-center text-black"
                : "text-left"
            } p-2 mb-2 rounded`}
          >
            {msg.type === "name" ? `${msg.content}:` : msg.content}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatApp;
