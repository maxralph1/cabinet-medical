import asyncHandler from 'express-async-handler'; 
import Chat from '../models/Chat.js'; 
import ChatUser from '../models/ChatUser.js'; 
import ChatMessage from '../models/ChatMessage.js'; 
import Notification from '../models/Notification.js'; 


/**
 * Get Chats
 */ 
const getChats = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    // const chats = await Chat.find({ deleted_at: null })
    const chats = await ChatUser.find({ user: req?.user_id, deleted_at: null })
                                .sort('-created_at')
                                .skip(skip)
                                .limit(limit)
                                .populate({
                                    path: 'chat',
                                })
                                .lean(); 
    if (!chats?.length) return res.status(404).json({ message: "No chats found!" }); 

    const total = await ChatUser.countDocuments({ user: req?.user_id, deleted_at: null }); 

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
 * Create Chat
 */ 
const createChat = asyncHandler(async (req, res) => {
    const { message, other_user_id, chat_id } = req?.body; 

    const chatUserAlreadyExists = await ChatUser.findOne({ user: other_user, chat: chat?._id });

    let chat; 

    if (!chat_id) {
        chat = new Chat({
            user: req?.user_id, 
            topic, 
            description
        });
    }; 

    

    let chatUser;
    if (!chatUserAlreadyExists) {
        chatUser = await ChatUser.create({
            user: req?.user_id, 
            chat: chat?._id
        });
    } else {
        chatUser = chatUserAlreadyExists;
    }; 

    let chatMessage = await ChatMessage.create({
        chat: chat?._id, 
        user: req?.user_id, 
        content: message
    }); 

    const notification = await Notification.create({
        user: chatUser?._id, 
        chat_message: chatMessage._id,
        read: false,
        type: 'chat-message', 
    });

    chat.save()
        .then(() => {
            res.status(201).json({ success: `Chat ${chat?._id} created` });
        })
        .catch(error => {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        });
}); 

/**
 * Get Chat
 */ 
const getChat = asyncHandler(async (req, res) => {
    const chat = await Chat.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!chat) return res.status(404).json({ message: "Chat not found!" }); 

    res.json({ data: chat }); 
}); 

/**
 * Update Chat
 */ 
const updateChat = asyncHandler(async (req, res) => {
    const chat = await Chat.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!chat) return res.status(404).json({ message: "Chat not found!" }); 

    chat.topic = req?.body?.topic || chat?.topic; 
    chat.description = req?.body?.description || chat?.description; 

    chat.save()
        .then(() => {
            res.json({ success: `Chat ${chat?._id} updated` });
        })
        .catch(error => {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }); 
}); 

/**
 * Soft-delete Chat
 */
const deleteChat = asyncHandler(async (req, res) => {
    const chat = await Chat.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!chat) return res.status(404).json({ message: "Chat not found!" }); 

    if (chat.deleted_at == '' || chat.deleted_at == null) {
        chat.deleted_at = new Date().toISOString();
        chat.deleted_by = req?.user_id;
    }

    chat.save()
                .then(() => {
                    res.json({ success: `Chat ${chat?._id} deleted` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Restore soft-deleted Chat
 */
const restoreChat = asyncHandler(async (req, res) => {
    const chat = await Chat.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!chat) return res.status(404).json({ message: "Chat not found!" }); 

    chat.deleted_at = null;
    chat.deleted_by = null;

    chat.save()
                .then(() => {
                    res.json({ success: `Chat ${chat?._id} restored` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Permanent-delete an Chat
 */
const destroyChat = asyncHandler(async (req, res) => {
    const chat = await Chat.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!chat) return res.status(404).json({ message: "Chat not found!" }); 

    chat.deleteOne()
                .then(() => {
                    res.json({ success: `Chat ${chat?._id} deleted permanently` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 


export { getChats, 
        createChat, 
        getChat, 
        updateChat, 
        deleteChat, 
        restoreChat, 
        destroyChat };