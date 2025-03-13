import asyncHandler from 'express-async-handler'; 
import ChatMessage from '../models/ChatMessage.js'; 
import ChatUser from '../models/ChatUser.js';


/**
 * Get Chat Messages
 */ 
const getChatMessages = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 
    const chat = req?.query?.chat;

    const chatByUserExists = await ChatUser.findOne({ user: req?.user_id, chat: chat, deleted_at: null }); 

    let chatMessages;
    if (chatByUserExists) {
        chatMessages = await ChatMessage.find({ chat: chat, deleted_at: null });
    }; 

    if (!chatMessages?.length) return res.status(404).json({ message: "No messages found!" }); 

    const total = await ChatMessage.countDocuments({ chat: chat, deleted_at: null }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: chats 
            }); 
}); 

/**
 * Create Chat Message
 */ 
const createChatMessage = asyncHandler(async (req, res) => {
    const { chat } = req?.params; 
    const { content } = req?.body; 

    const chatMessage = new ChatMessage({
        user: req?.user_id, 
        chat,
        content,
    }); 

    chatMessage.save()
                .then(() => {
                    res.status(201).json({ success: `Chat Message ${chatMessage?._id} created` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 

/**
 * Get Chat Message
 */ 
const getChatMessage = asyncHandler(async (req, res) => {
    const chatMessage = await ChatMessage.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!chatMessage) return res.status(404).json({ message: "Chat Message not found" });

    res.json({ data: chatMessage });
}); 

/**
 * Update Chat Message 
 */ 
const updateChatMessage = asyncHandler(async (req, res) => {
    const chatMessage = await ChatMessage.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!chatMessage) return res.status(404).json({ message: "Chat Message not found!" }); 

    chatMessage.content = req?.body?.content || chatMessage?.content;

    chatMessage.save()
                .then(() => {
                    res.json({ success: `Chat Message ${chatMessage?._id} updated` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Soft-delete Chat Message
 */
const deleteChatMessage = asyncHandler(async (req, res) => {
    const chatMessage = await ChatMessage.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!chatMessage) return res.status(404).json({ message: "Chat Message not found!" }); 

    if (chatMessage.deleted_at == '' || chatMessage.deleted_at == null) {
        chatMessage.deleted_at = new Date().toISOString();
        chatMessage.deleted_by = req?.user_id;
    }

    chatMessage.save()
                .then(() => {
                    res.json({ success: `Chat Message ${chatMessage?._id} deleted` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Restore soft-deleted Chat Message
 */
const restoreChatMessage = asyncHandler(async (req, res) => {
    const chatMessage = await ChatMessage.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!chatMessage) return res.status(404).json({ message: "Chat Message not found!" }); 

    chatMessage.deleted_at = null;
    chatMessage.deleted_by = null;

    chatMessage.save()
                .then(() => {
                    res.json({ success: `Chat Message ${chatMessage?._id} restored` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Permanent-delete an Chat Message
 */
const destroyChatMessage = asyncHandler(async (req, res) => {
    const chatMessage = await ChatMessage.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!chatMessage) return res.status(404).json({ message: "Chat Message not found!" }); 

    chatMessage.deleteOne()
                .then(() => {
                    res.json({ success: `Chat Message ${chatMessage?._id} deleted permanently` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 


export { getChatMessages, 
        createChatMessage, 
        getChatMessage, 
        updateChatMessage, 
        deleteChatMessage, 
        restoreChatMessage, 
        destroyChatMessage };