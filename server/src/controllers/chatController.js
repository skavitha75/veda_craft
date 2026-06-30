import { createChatReply } from '../services/chatService.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { message, messages } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return sendError(res, 400, 'Message is required');
    }

    if (message.length > 1000) {
      return sendError(res, 400, 'Message must be 1000 characters or less');
    }

    const result = await createChatReply({ message, messages });
    return sendSuccess(res, result, 'Chat reply generated');
  } catch (error) {
    return next(error);
  }
};
