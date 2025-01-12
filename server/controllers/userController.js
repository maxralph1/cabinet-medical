import asyncHandler from 'express-async-handler'; 
import cloudinaryImageUpload from '../config/imageUpload/cloudinary.js'; 
import User from '../models/User.js'; 
import Appointment from '../models/Appointment.js';


/**
 * Get Users
 */
const getUsers = asyncHandler(async (req, res) => { 
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
        users = await User.find({ deleted_at: null })
                        .select(['-password', '-password_reset_token', '-updated_at'])
                        .sort('-created_at')
                        .skip(skip)
                        .limit(limit)
                        .lean(); 
        if (!users?.length) return res.status(404).json({ message: "No users found!" }); 

        usersCount = await User.find({ deleted_at: null }).countDocuments(); 
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

/**
 * Create User
 */
const createUser = asyncHandler(async (req, res) => {
    const { username, 
            first_name, 
            last_name, 
            email, 
            phone, 
            password, 
            account_type } = req?.body; 

    const duplicateUsername = await User.findOne({ username: username }).lean(); 
    const duplicateEmail = await User.findOne({ email: email }).lean(); 

    if (duplicateUsername) {
        return res.status(409).json({ message: `Username ${duplicateUsername.username} already exists` });
    } else if (duplicateEmail) {
        return res.status(409).json({ message: `User email ${duplicateEmail.email} already exists` });
    }; 

    const emailVerifyToken = jwt.sign(
        { "username": username }, 
        process.env.EMAIL_VERIFY_TOKEN_SECRET, 
        { expiresIn: 20 * 60 }
    ); 

    let accountType;

    if (!account_type) {
        accountType = "patient";
    } else if (account_type && account_type == "patient") {
        accountType = "patient";
    } else if (account_type && account_type == "doctor") {
        accountType = "doctor";
    }; 

    const user = new User({
        user: req?.user_id, 
        username, 
        first_name, 
        last_name,  
        email, 
        phone, 
        password, 
        role: accountType,
        email_verify_token: emailVerifyToken, 
        email_verified: new Date().toISOString()
    }); 

    user.save()
        .then(() => {
            res.status(201).json({ success: `User ${user._id} added`, data: user });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        }); 

    (async function () {
        const mailSubject = "New Account Registration";

        const mailBody = registerEmailConfirmMailTemplate(user)
        await sendMail(process.env.EMAIL_ADDRESS, user.email, mailSubject, mailBody);
    })();
}); 

/**
 * GET A USER
 */
const getUser = asyncHandler(async (req, res) => { 
    const { username } = req?.params; 

	const user = await User.findOne({ username: username })
                            .select(['-password', '-password_reset_token', '-updated_at', '-deleted_at'])
                            .lean(); 

	if (!user) return res.status(404).json({ message: `No user matches user @${username}!` }); 

    console.log(user);

    /** User Details: */
    const userAppointments = await Appointment.countDocuments({ user: user?._id, deleted_at: null }); 
    const userBlogPosts = await BlogPost.countDocuments({ user: user?._id, deleted_at: null }); 
    const userDiagnoses = await Diagnosis.countDocuments({ user: user?._id, deleted_at: null }); 
    const userMedicalBills = await MedicalBill.countDocuments({ user: user?._id, deleted_at: null }); 
    const userNotifications = await Notification.countDocuments({ user: user?._id, deleted_at: null }); 
    const userRegimens = await Regimen.countDocuments({ user: user?._id, deleted_at: null }); 

    user.appointments_count = userAppointments; 
    user.blog_posts_count = userBlogPosts; 
    user.diagnoses_count = userDiagnoses;
    user.medical_bills_count = userMedicalBills; 
    user.notifications_count = userNotifications; 
    user.regimens_count = userRegimens; 

    res.json({ data: user });
}); 

/**
 * Update User
 */
const updateUser = asyncHandler(async (req, res) => {
    const { first_name, 
            last_name, 
            email, 
            phone, 
            password, 
            account_type } = req?.body; 

    const { username } = req?.params; 

    const user = await User.findOne({ username: username }).exec();
    if (!user) return res.status(404).json({ message: "User not found!" }); 

    let accountType;

    if (!account_type) {
        accountType = "patient";
    } else if (account_type && account_type == "patient") {
        accountType = "patient";
    } else if (account_type && account_type == "doctor") {
        accountType = "doctor"; 
    }; 

    /** Image Upload */
    let userImageUpload = {};
    if (!req?.files?.user_image) {
        userImageUpload.public_id = ''
        userImageUpload.secure_url = ''
    } else if (req?.files?.user_image) {
        userImageUpload = await cloudinaryImageUpload(req?.files?.user_image?.tempFilePath, "cabinet_medical_user_images"); 
        if (!userImageUpload) return res.status(400).json({ message: "Image upload failed" }); 

        user.user_image_path.public_id = userImageUpload.public_id
        user.user_image_path.url = userImageUpload.secure_url
    }
    /** End of Image upload */

    if (first_name) user.first_name = first_name; 
    if (last_name) user.last_name = last_name; 
    if (email) user.email = email; 
    if (phone) user.phone = phone; 
    if (password) user.password = password; 
    if (account_type) user.role = accountType; 

    user.save()
        .then(() => { 
			res.status(200).json({ success: `User record updated.`, data: user });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * Soft-delete User
 */
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const user = await User.findOne({ _id: id }).exec();

    if (!user) return res.status(404).json({ message: `No user matches the user ${id}!` }); 

    if (user.deleted_at == '') {
        user.deleted_at = new Date().toISOString();
        user.deleted_by = req?.user_id;
    }

    user.save()
        .then(() => { 
			res.status(200).json({ success: `User record deleted.`, data: user });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * Restore soft-deleted User
 */
const restoreUser = asyncHandler(async (req, res) => {
    const { id } = req?.params; 
    const user = await User.findOne({ _id: id }).exec();

    if (!user) return res.status(404).json({ message: `No user matches the user ${id}!` }); 

    if (user.deleted_at != '') {
        user.deleted_at = '';
        user.deleted_by = '';
    };

    user.save()
        .then(() => { 
			res.status(200).json({ success: `Deleted user record restored.`, data: user });
        })
        .catch((error) => {
            if (error) return res.status(400).json({ message: "An error occured!", details: `${error}` }); 
        });
}); 

/**
 * Permanent-delete User
 */
const destroyUser = asyncHandler(async (req, res) => {
    const { id } = req?.params;
	const user = await User.findOne({ _id: id }).exec();

	if (!user) return res.status(404).json({ message: `No user matches the user ${id}!` }); 

	await user.deleteOne(); 

	res.status(200).json({ success: `User ${user?._id} has been permanently deleted.`, data: `${user}` });
}); 




/********************* */
/** ADDITIONAL METHODS */
/********************* */

/**
 * GET User Appointments
 */
const getUserAppointments = asyncHandler(async (req, res) => {
    const { username } = req?.params; 
    const appointmentStatus = req?.query?.status; 
    const limit = parseInt(req?.query?.limit) || 10; 
    const current_page = parseInt(req?.query?.page) || 1;
    // console.log(appointmentStatus, limit, current_page);
    const skip = (current_page - 1) * limit; 

    /** Firstly, find user */ 
    const userFound = await User.findOne({ username: username }).lean();

    let appointments, appointmentsCount; 
    let appointmentsList = []; 

    if (appointmentStatus == 'all') {
        appointments = await Appointment.find({ $or: [{ professional: userFound?._id }, { patient: userFound?._id }], deleted_at: null })
                                        .sort('-created_at')
                                        .skip(skip)
                                        .limit(limit)
                                        .populate({
                                            path: 'user', 
                                            select: 'first_name last_name username' 
                                        })
                                        .populate({
                                            path: 'patient', 
                                            select: 'first_name last_name username' 
                                        })
                                        .populate({
                                            path: 'professional', 
                                            select: 'first_name last_name username' 
                                        })
                                        .lean(); 
        if (!appointments?.length) return res.status(404).json({ message: "No appointments found!" }); 

        appointmentsCount = await Appointment.countDocuments({ $or: [{ professional: userFound?._id }, { patient: userFound?._id }], deleted_at: null });

    } else {
        appointments = await Appointment.find({ $or: [{ professional: userFound?._id }, { patient: userFound?._id }], deleted_at: null, status: appointmentStatus }) 
                                        .sort('-created_at')
                                        .skip(skip)
                                        .limit(limit)
                                        .populate({
                                            path: 'user', 
                                            select: 'first_name last_name username' 
                                        })
                                        .populate({
                                            path: 'patient', 
                                            select: 'first_name last_name username' 
                                        })
                                        .populate({
                                            path: 'professional', 
                                            select: 'first_name last_name username' 
                                        })
                                        .lean(); 
        if (!appointments?.length) return res.status(404).json({ message: "No appointments found!" }); 

        appointmentsCount = await Appointment.countDocuments({ $or: [{ professional: userFound?._id }, { patient: userFound?._id }], deleted_at: null, status: appointmentStatus });
    }

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(appointmentsCount / limit), 
                    total_results: appointmentsCount
                }, 
                data: appointmentsList 
            }); 
}); 

/**
 * Get User Blog Posts
 */
const getUserBlogPosts = asyncHandler(async (req, res) => {

}); 

/**
 * Get User Diagnoses
 */ 
const getUserDiagnoses = asyncHandler(async (req, res) => {

}); 

/**
 * Get User Medical Bills
 */
const getUserMedicalBills = asyncHandler(async (req, res) => {

}); 

/**
 * Get User Regimens
 */ 
const getUserRegimens = asyncHandler(async (req, res) => {

});


export { getUsers, 
		createUser, 
		getUser, 
		updateUser, 
		deleteUser, 
        restoreUser, 
        destroyUser, 
    
        getUserAppointments, 
        getUserBlogPosts, 
        getUserDiagnoses, 
        getUserMedicalBills, 
        getUserRegimens }; 