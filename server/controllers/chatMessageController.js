import asyncHandler from 'express-async-handler'; 
import ChatMessage from '../models/ChatMessage.js'; 


/**
 * Get Chat Messages
 */ 
const getChatMessages = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    const chatMessages = await ChatMessage.find({ user: req?.user_id, deleted})
})