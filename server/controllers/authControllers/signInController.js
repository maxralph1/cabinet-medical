import asyncHandler from 'express-async-handler'; 
import jwt from 'jsonwebtoken'; 
import User from '../../models/User.js';
import SignInAttempt from '../../models/SignInAttempt.js';


const signInUser = asyncHandler(async (req, res) => {
    const { email_username,  
		    password } = req?.body;

    const userFound = await User.findOne({ $or: [{ username: email_username }, { email: email_username }]}).exec(); 

    if (!userFound) return res.status(401).json({ message: "Unauthorized" }); 

    const match = await userFound?.matchPassword(password);

    if (!match) return res.status(401).json({ message: "Unauthorized" }); 

    if (!userFound?.active) return res.status(401).json({ message: "Unauthorized" });

    if (!userFound?.email_verified) return res.status(401).json({ message: "You must verify your email before you can sign into your account" });

    if (userFound) {
        userFound.online = true;
        userFound.sign_in_count = userFound?.sign_in_count+1;
        userFound.last_time_active = '';
    }; 

    // Record the sign-in attempt
    if (userFound?.role == 'individual' || userFound?.role == 'enterprise') {
        await SignInAttempt.create({
            user: userFound?._id, 
            // ip_address: (req?.connection?.remoteAddress)?.slice(7) || req?.headers['x-forwarded-for']
            ip_address: (req?.connection?.remoteAddress)?.replace(/^::ffff:/, '') || req?.headers['x-forwarded-for']
        }); 
    }
    // End of Record the sign-in attempt

    const access = jwt.sign(
        {
            "user": {
                "user_id": userFound._id, 
                "username": userFound.username, 
                "first_name": userFound.first_name, 
                "other_names": userFound.other_names, 
                "last_name": userFound.last_name, 
                "user_image": userFound.user_image_path.url, 
                "enterprise_name": userFound.enterprise_name, 
                "email": userFound.email, 
                "phone": userFound.phone, 
                "address": userFound.address, 
                "role": userFound.role, 
                "verified": userFound.verified, 
            }
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: 60 * 60 }
        // { expiresIn: 1 * 60 }
    );

    const refresh = jwt.sign(
        { "user_id": userFound._id }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: 60 * 60 }
        // { expiresIn: 1 * 60 }
    );

    userFound.save()
        .then(function () {
            res.cookie('jwt', refresh, {
                httpOnly: true, 
                secure: true, 
                sameSite: 'Lax', 
                maxAge: 5 * 60 * 60 * 1000      // 1 hour
                // maxAge: 1 * 60 * 1000      // 1 minute
            }); 
            // res.cookie('jwt', refresh, { httpOnly: true, secure: true, sameSite: 'Strict' });

            res.json({ access })
        })
        .catch(function (error) {
            return res.status(400).json(error);
        }); 
}); 


export default signInUser; 