import React, { useState } from "react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "I'm still learning! Stay tuned for updates.", sender: "bot" }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat Icon Button */}
      <button
        onClick={toggleChat}
        className="bg-[#FFD369] hover:bg-[#ecc363] text-black font-bold p-3 rounded-full shadow-lg focus:outline-none"
      >
        💬
      </button>

      {/* Chatbox */}
      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col">
          {/* Chat Header */}
          <div className="bg-[#393E46] text-white p-3 flex justify-between items-center rounded-t-lg">
            <span className="font-semibold">Chat with Shelby</span>
            <button onClick={toggleChat} className="text-lg">✖</button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-md max-w-[75%] ${
                  msg.sender === "user"
                    ? "bg-[#FFD369] self-end text-black ml-auto"
                    : "bg-gray-300 text-black"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Field */}
          <div className="p-2 border-t flex items-center">
            <input
              type="text"
              className="flex-1 p-2 border rounded-l-md outline-none"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-[#FFD369] hover:bg-[#ecc363] text-black p-2 rounded-r-md"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
