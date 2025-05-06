import { Server } from 'socket.io';
import Chat from './models/chat.model.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Store active users and their socket IDs
  const activeUsers = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Store user information when they connect
    const { userId, userType } = socket.handshake.query;
    activeUsers.set(userId, socket.id);

    // Handle joining a chat room
    socket.on('joinChat', async (chatRoomId) => {
      socket.join(chatRoomId);
      console.log(`User ${userId} joined chat ${chatRoomId}`);
      
      // Mark messages as read when user joins the chat
      try {
        await Chat.markMessagesAsRead(chatRoomId, userId);
        // Notify other users that messages have been read
        socket.to(chatRoomId).emit('messagesRead', { chatRoomId, userId });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle sending messages
    socket.on('sendMessage', async (messageData) => {
      try {
        // Save message to database
        const message = await Chat.addMessage(
          messageData.chatRoomId,
          messageData.content,
          messageData.senderId
        );

        // Broadcast message to all users in the chat room
        io.to(messageData.chatRoomId).emit('newMessage', {
          ...message,
          created_at: messageData.timestamp
        });

        // Notify other user about new message if they're not in the chat
        const otherUserId = messageData.senderId === messageData.buyerId 
          ? messageData.sellerId 
          : messageData.buyerId;
        
        const otherUserSocketId = activeUsers.get(otherUserId);
        if (otherUserSocketId) {
          io.to(otherUserSocketId).emit('newMessageNotification', {
            chatRoomId: messageData.chatRoomId,
            message: message
          });
        }
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    // Handle marking messages as read
    socket.on('markAsRead', async ({ chatRoomId }) => {
      try {
        await Chat.markMessagesAsRead(chatRoomId, userId);
        socket.to(chatRoomId).emit('messagesRead', { chatRoomId, userId });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Remove user from active users
      for (const [userId, socketId] of activeUsers.entries()) {
        if (socketId === socket.id) {
          activeUsers.delete(userId);
          break;
        }
      }
    });
  });

  return io;
}; 