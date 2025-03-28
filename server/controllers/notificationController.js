import asyncHandler from 'express-async-handler'; 
import Notification from '../models/Notification.js';


/**
 * Get Notifications
 */
const getNotifications = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    const notifications = await Notification.find({ deleted_at: null })
                                                        .sort({ created_at: -1 })
                                                        .skip(skip)
                                                        .limit(limit)
                                                        .lean(); 

    const total = await Notification.countDocuments({ deleted_at: null }); 
    
    if (!notifications?.length) return res.status(404).json({ message: "No notifications found!" }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: notifications 
            });
}); 

/**
 * Get Notification
 */
const getNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!notification) return res.status(404).json({ message: "Notification not found!" }); 

    res.json({ data: notification });
}); 

/**
 * Soft-delete Notification
 */
const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!notification) return res.status(404).json({ message: "Notification not found!" }); 

    if (notification.deleted_at == '' || notification.deleted_at == null) {
        notification.deleted_at = new Date().toISOString();
        notification.deleted_by = req?.user_id;
    }

    notification.save()
                    .then(() => {
                        res.json({ success: `Notification ${notification?._id} deleted` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Restore soft-deleted Notification
 */
const restoreNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!notification) return res.status(404).json({ message: "Notification not found!" }); 

    notification.deleted_at = null;
    notification.deleted_by = null;

    notification.save()
                    .then(() => {
                        res.json({ success: `Notification ${notification?._id} restored` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Permanent-delete Notification
 */
const destroyNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!notification) return res.status(404).json({ message: "Notification not found!" }); 

    notification.deleteOne()
                    .then(() => {
                        res.json({ success: `Notification ${notification?._id} deleted permanently` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    });
}); 


export { getNotifications, 
        getNotification, 
        deleteNotification, 
        restoreNotification, 
        destroyNotification }; 