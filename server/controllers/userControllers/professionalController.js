import asyncHandler from 'express-async-handler'; 
import cloudinaryImageUpload from '../../config/imageUpload/cloudinary.js'; 
import User from '../../models/User.js'; 
import Appointment from '../../models/Appointment.js'; 


/**
 * Get Professionals
 */
const getProfessionals = asyncHandler(async (req, res) => { 
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const roleQuery = req?.query?.role; 
    const skip = (current_page - 1) * limit; 

    console.log(current_page, limit, roleQuery); 

    let users, usersCount;

    if ((roleQuery != 'all')) {
        users = await User.find({ role: roleQuery, 
                                deleted_at: null })
                        .select(['-password', '-password_reset_token', '-updated_at'])
                        .sort('-created_at')
                        .skip(skip)
                        .limit(limit)
                        .lean();   
        if (!users?.length) return res.status(404).json({ message: "No users found!" }); 

        usersCount = await User.find({ role: roleQuery, deleted_at: null }).countDocuments(); 

    } else if ((roleQuery == 'all' || !roleQuery)) {
        const query = { role: { $not: /patient/i } };

        users = await User.find({ deleted_at: null, role: 'general_practitioner' || 'gynaecologist' || 'nurse' || 'laboratory_scientist' })
                        .select(['-password', '-password_reset_token', '-updated_at'])
                        .sort('-created_at')
                        .skip(skip)
                        .limit(limit)
                        .lean(); 
        if (!users?.length) return res.status(404).json({ message: "No users found!" }); 

        usersCount = await User.find({ deleted_at: null, role: 'general_practitioner' || 'gynaecologist' || 'nurse' || 'laboratory_scientist' }).countDocuments(); 
    } 

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


export { getProfessionals }; 