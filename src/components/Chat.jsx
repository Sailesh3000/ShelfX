import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const Chat = ({ bookId, sellerId, buyerId, userType }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [chatId, setChatId] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize or fetch chat
    const initializeChat = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/chat/initialize`,
          {
            bookId,
            sellerId,
            buyerId
          },
          {
            withCredentials: true
          }
        );
        setChatId(response.data.chatId);
        setMessages(response.data.messages || []);
        setError(null);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setError('Failed to initialize chat. Please try again.');
      }
    };

    if (bookId && sellerId && buyerId) {
      initializeChat();
    }
  }, [bookId, sellerId, buyerId]);

  useEffect(() => {
    if (!chatId) return;

    // Set up polling for new messages
    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/chat/${chatId}/messages`,
          {
            withCredentials: true
          }
        );
        setMessages(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Failed to fetch messages. Please refresh the page.');
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [chatId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    try {
      await axios.post(
        `${API_BASE_URL}/api/chat/${chatId}/messages`,
        {
          content: newMessage,
          senderType: userType
        },
        {
          withCredentials: true
        }
      );
      setNewMessage('');
      setError(null);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="flex flex-col h-[400px] bg-white rounded-lg shadow-lg p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[400px] bg-[#222831] rounded-lg shadow-lg">
      <div className="p-4 border-b border-[#393E46]">
        <h3 className="text-lg font-semibold text-[#FFD369]">Chat about this book</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender_type === userType ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender_type === userType
                  ? 'bg-[#FFD369] text-[#222831]'
                  : 'bg-[#393E46] text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-[#393E46]">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 bg-[#393E46] text-white border border-[#4a4f57] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD369] placeholder-gray-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#FFD369] text-[#222831] rounded-lg hover:bg-[#e6bd5f] focus:outline-none focus:ring-2 focus:ring-[#FFD369] font-medium"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 