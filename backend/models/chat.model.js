import db from '../db.js';

class Chat {
  static async initializeChat(bookId, sellerId, buyerId) {
    try {
      // Check if chat already exists
      const [existingChat] = await db.query(
        'SELECT * FROM chats WHERE book_id = ? AND seller_id = ? AND buyer_id = ?',
        [bookId, sellerId, buyerId]
      );

      if (existingChat.length > 0) {
        return existingChat[0];
      }

      // Create new chat
      const [result] = await db.query(
        'INSERT INTO chats (book_id, seller_id, buyer_id) VALUES (?, ?, ?)',
        [bookId, sellerId, buyerId]
      );

      return { id: result.insertId, book_id: bookId, seller_id: sellerId, buyer_id: buyerId };
    } catch (error) {
      throw error;
    }
  }

  static async getMessages(chatId) {
    try {
      const [messages] = await db.query(
        'SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC',
        [chatId]
      );
      return messages;
    } catch (error) {
      throw error;
    }
  }

  static async addMessage(chatId, content, senderType) {
    try {
      const [result] = await db.query(
        'INSERT INTO messages (chat_id, content, sender_type) VALUES (?, ?, ?)',
        [chatId, content, senderType]
      );
      return { id: result.insertId, chat_id: chatId, content, sender_type: senderType };
    } catch (error) {
      throw error;
    }
  }

  static async getChatsByUserId(userId, userType) {
    try {
      const column = userType === 'seller' ? 'seller_id' : 'buyer_id';
      const [chats] = await db.query(
        `SELECT c.*, b.bookName, b.price, 
         CASE 
           WHEN ? = 'seller' THEN u.username 
           ELSE s.username 
         END as other_user_name
         FROM chats c
         JOIN books b ON c.book_id = b.id
         JOIN users u ON c.buyer_id = u.id
         JOIN users s ON c.seller_id = s.id
         WHERE c.${column} = ?`,
        [userType, userId]
      );
      return chats;
    } catch (error) {
      throw error;
    }
  }
}

export default Chat; 