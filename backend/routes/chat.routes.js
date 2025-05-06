import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import * as chatController from '../controllers/chat.controller.js';

const router = express.Router();

// Initialize a new chat or get existing chat
router.post('/initialize', verifyToken, chatController.initializeChat);

// Get messages for a specific chat
router.get('/:chatId/messages', verifyToken, chatController.getMessages);

// Send a new message
router.post('/:chatId/messages', verifyToken, chatController.sendMessage);

// Get all chats for a user (seller or buyer)
router.get('/user/:userId/:userType', verifyToken, chatController.getUserChats);

export default router; 