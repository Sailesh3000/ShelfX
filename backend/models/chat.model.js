import db from '../db.config.js';

class Chat {
  static async initializeChat(bookId, sellerId, buyerId) {
    try {
      // Check if chat already exists
      const [existingChat] = await db.query(
        'SELECT * FROM chat_rooms WHERE book_id = ? AND seller_id = ? AND buyer_id = ?',
        [bookId, sellerId, buyerId]
      );

      if (existingChat.length > 0) {
        return existingChat[0];
      }

      // Create new chat room
      const [result] = await db.query(
        'INSERT INTO chat_rooms (book_id, seller_id, buyer_id) VALUES (?, ?, ?)',
        [bookId, sellerId, buyerId]
      );

      return { id: result.insertId, book_id: bookId, seller_id: sellerId, buyer_id: buyerId };
    } catch (error) {
      throw error;
    }
  }

  static async getMessages(chatRoomId) {
    try {
      const [messages] = await db.query(
        `SELECT m.*, 
         CASE 
           WHEN m.sender_id = cr.buyer_id THEN b.username 
           ELSE s.username 
         END as sender_name
         FROM messages m
         JOIN chat_rooms cr ON m.chat_room_id = cr.id
         LEFT JOIN buyers b ON m.sender_id = b.id AND m.sender_id = cr.buyer_id
         LEFT JOIN users s ON m.sender_id = s.id AND m.sender_id = cr.seller_id
         WHERE m.chat_room_id = ? 
         ORDER BY m.created_at ASC`,
        [chatRoomId]
      );
      return messages;
    } catch (error) {
      throw error;
    }
  }

  static async addMessage(chatRoomId, content, senderId) {
    try {
      // First check if sender is a buyer or seller
      const [buyer] = await db.query('SELECT id FROM buyers WHERE id = ?', [senderId]);
      const [seller] = await db.query('SELECT id FROM users WHERE id = ?', [senderId]);

      if (!buyer.length && !seller.length) {
        throw new Error('Invalid sender ID');
      }

      // Get the chat room to determine if sender is buyer or seller
      const [chatRoom] = await db.query(
        'SELECT * FROM chat_rooms WHERE id = ?',
        [chatRoomId]
      );

      if (!chatRoom.length) {
        throw new Error('Chat room not found');
      }

      // Determine if sender is buyer or seller
      const isBuyer = chatRoom[0].buyer_id === senderId;
      const isSeller = chatRoom[0].seller_id === senderId;

      if (!isBuyer && !isSeller) {
        throw new Error('Sender is not part of this chat room');
      }

      // Insert new message
      const [result] = await db.query(
        'INSERT INTO messages (chat_room_id, sender_id, message, is_read) VALUES (?, ?, ?, 0)',
        [chatRoomId, senderId, content]
      );

      // Get the newly created message with sender information
      const [messages] = await db.query(
        `SELECT m.*, 
         CASE 
           WHEN m.sender_id = cr.buyer_id THEN b.username 
           ELSE s.username 
         END as sender_name
         FROM messages m
         JOIN chat_rooms cr ON m.chat_room_id = cr.id
         LEFT JOIN buyers b ON m.sender_id = b.id AND m.sender_id = cr.buyer_id
         LEFT JOIN users s ON m.sender_id = s.id AND m.sender_id = cr.seller_id
         WHERE m.id = ?`,
        [result.insertId]
      );

      return messages[0];
    } catch (error) {
      console.error('Error handling message:', error);
      throw error;
    }
  }

  static async markMessagesAsRead(chatRoomId, userId) {
    try {
      await db.query(
        'UPDATE messages SET is_read = 1 WHERE chat_room_id = ? AND sender_id != ? AND is_read = 0',
        [chatRoomId, userId]
      );
    } catch (error) {
      throw error;
    }
  }

  static async getChatsByUserId(userId, userType) {
    try {
      const column = userType === 'seller' ? 'seller_id' : 'buyer_id';
      const [chats] = await db.query(
        `SELECT cr.*, b.bookName, b.price, 
         CASE 
           WHEN ? = 'seller' THEN bu.username 
           ELSE s.username 
         END as other_user_name,
         (SELECT COUNT(*) FROM messages m WHERE m.chat_room_id = cr.id AND m.sender_id != ? AND m.is_read = 0) as unread_count
         FROM chat_rooms cr
         JOIN books b ON cr.book_id = b.id
         JOIN buyers bu ON cr.buyer_id = bu.id
         JOIN users s ON cr.seller_id = s.id
         WHERE cr.${column} = ?`,
        [userType, userId, userId]
      );
      return chats;
    } catch (error) {
      throw error;
    }
  }
}

export default Chat; 