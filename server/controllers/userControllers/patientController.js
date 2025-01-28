import asyncHandler from 'express-async-handler'; 
import cloudinaryImageUpload from '../../config/imageUpload/cloudinary.js'; 
import User from '../../models/User.js'; 
import Appointment from '../../models/Appointment.js'; 


/**
 * Get patients
 */
const getPatients = asyncHandler(async (req, res) => { 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const searchQuery = (req?.query?.search_key)?.toLowerCase();  
    const skip = (current_page - 1) * limit; 

    console.log(current_page, limit, searchQuery); 

    let users, usersCount;

    if (searchQuery) {
        // users = await User.find({ $or: [{ first_name: searchQuery }, { last_name: searchQuery }] })
        users = await User.find({ $and: [
                                {
                                    $or: [{ first_name: searchQuery }, { last_name: searchQuery }]
                                },
                                { deleted_at: null },
                                { role: 'patient' }
                            ] })
                            .select(['-password', '-password_reset_token', '-updated_at'])
                            .sort('-created_at')
                            .skip(skip)
                            .limit(limit)
                            .lean(); 
    } else {
        users = await User.find({ deleted_at: null, role: 'patient' })
                        .select(['-password', '-password_reset_token', '-updated_at'])
                        .sort('-created_at')
                        .skip(skip)
                        .limit(limit)
                        .lean(); 
    }

    if (!users?.length) return res.status(404).json({ message: "No users found!" }); 

    usersCount = await User.find({ deleted_at: null, role: 'patient' }).countDocuments(); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(usersCount / limit), 
                    total_results: usersCount
                }, 
                data: users 
            }); 
}); 


export { getPatients }; 