import Chat from '../models/chat.model.js';

export const initializeChat = async (req, res) => {
  try {
    const { bookId, sellerId, buyerId } = req.body;

    if (!bookId || !sellerId || !buyerId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const chat = await Chat.initializeChat(bookId, sellerId, buyerId);
    const messages = await Chat.getMessages(chat.id);

    res.status(200).json({
      chatId: chat.id,
      messages
    });
  } catch (error) {
    console.error('Error initializing chat:', error);
    res.status(500).json({ message: 'Error initializing chat' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Chat.getMessages(chatId);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, senderType } = req.body;

    if (!content || !senderType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const message = await Chat.addMessage(chatId, content, senderType);
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const { userId, userType } = req.params;
    const chats = await Chat.getChatsByUserId(userId, userType);
    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(500).json({ message: 'Error fetching user chats' });
  }
}; 