import asyncHandler from 'express-async-handler'; 
import mongoose from 'mongoose';
import Chat from '../models/Chat.js'; 
import ChatUser from '../models/ChatUser.js'; 
import ChatMessage from '../models/ChatMessage.js'; 
import Notification from '../models/Notification.js'; 


/**
 * Get Chats
 */ 
const getChats = asyncHandler(async (req, res) => {
    const chatUsers = await ChatUser.find({ user: req?.user_id, deleted_at: null })
                                    .sort('-created_at')
                                    .populate({
                                        path: 'chat', 
                                    })
                                    .lean(); 
    if (!chatUsers?.length) return res.status(404).json({ message: "No chats found!" }); 

    const total = await ChatUser.countDocuments({ user: req?.user_id, deleted_at: null }); 

    let chatsList = [];

    const chats = await Promise.all(chatUsers.map(async (chatUser) => {
        let foundChat = await Chat.findOne({ _id: chatUser?.chat?._id, deleted_at: null })
                                    .populate({
                                        path: 'user', 
                                    })
                                    .lean();

        let foundChatUsers = await ChatUser.find({ chat: foundChat?._id })
                                            .populate({
                                                path: 'user', 
                                            })
                                            .lean();

        let foundLastChatMessage = await ChatMessage.findOne({ chat: foundChat?._id })
                                                .sort({ created_at: -1 })
                                                .lean();

        foundChat['chat_users'] = foundChatUsers;
        foundChat['last_message'] = foundLastChatMessage;
        
        chatsList.push(foundChat);
    }));

    res.json({ data: chatsList }); 
}); 

/**
 * Create Chat
 */ 
const createChat = asyncHandler(async (req, res) => {
    const { user_id } = req?.body;

    const hostChats = await ChatUser.find({ user: req?.user_id });
    const guestChats = await ChatUser.find({ user: user_id });

    let sharedChat, newChat, newHostChat, newGuestChat;
    // Check if both host and guest have chats
    if ((hostChats.length > 0) && (guestChats.length > 0)) {
        // Find the shared chat by comparing the `chat` field
        sharedChat = hostChats.find((hostChat) =>
            guestChats.some((guestChat) => guestChat.chat.toString() === hostChat.chat.toString())
        );

        if (sharedChat) {
            // If a shared chat is found, query the `UserChat` collection to find that chat
            const usersChat = await Chat.findOne({ _id: sharedChat.chat });

            if (usersChat) {
                console.log('Found matching chat:', usersChat);
                // Return or process the `usersChat` as needed
                usersChat.active = true;

                usersChat.save()
                        .then(() => {
                            res.status(201).json({ success: `Chat ${usersChat?._id} reactivated` });
                        })
                        .catch(error => {
                            return res.status(400).json({ message: "An error occured", details: `${error}` });
                        });
            } else {
                console.log('No matching chat found in UsersChat');
                return res.status(500).json({ message: "An error occured" });
            }
        } else {
            console.log('No shared chat found between host and guest');

            newChat = await Chat.create({
                user: req?.user_id, 
                type: 'one-on-one'
            }); 

            newHostChat = await ChatUser.create({
                user: req?.user_id, 
                chat: newChat?._id
            });

            newGuestChat = await ChatUser.create({
                user: user_id, 
                chat: newChat?._id
            });

            newChat.save()
                    .then(() => {
                        res.status(201).json({ success: `Chat ${newChat?._id} created` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    });
        }
    } else {
        console.log('One or both users have no chats');

        newChat = await Chat.create({
            user: req?.user_id, 
            type: 'one-on-one'
        }); 

        newHostChat = await ChatUser.create({
            user: req?.user_id, 
            chat: newChat?._id
        });

        newGuestChat = await ChatUser.create({
            user: user_id, 
            chat: newChat?._id
        });

        newChat.save()
                .then(() => {
                    res.status(201).json({ success: `Chat ${newChat?._id} created` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
    }


    // const { message, other_user_id, chat_id } = req?.body; 

    // const chatUserAlreadyExists = await ChatUser.findOne({ user: other_user, chat: chat?._id });

    // let chat; 

    // if (!chat_id) {
    //     chat = new Chat({
    //         user: req?.user_id, 
    //         topic, 
    //         description
    //     });
    // }; 

    // let chatUser;
    // if (!chatUserAlreadyExists) {
    //     chatUser = await ChatUser.create({
    //         user: req?.user_id, 
    //         chat: chat?._id
    //     });
    // } else {
    //     chatUser = chatUserAlreadyExists;
    // }; 

    // let chatMessage = await ChatMessage.create({
    //     chat: chat?._id, 
    //     user: req?.user_id, 
    //     content: message
    // }); 

    // const notification = await Notification.create({
    //     user: chatUser?._id, 
    //     chat_message: chatMessage._id,
    //     read: false,
    //     type: 'chat-message', 
    // });

    // chat.save()
    //     .then(() => {
    //         res.status(201).json({ success: `Chat ${chat?._id} created` });
    //     })
    //     .catch(error => {
    //         return res.status(400).json({ message: "An error occured", details: `${error}` });
    //     });
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