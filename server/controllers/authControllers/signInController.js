import asyncHandler from 'express-async-handler'; 
import jwt from 'jsonwebtoken'; 
import User from '../../models/User.js'; 


const signInUser = asyncHandler(async (req, res) => {
    const { email_username,  
		    password } = req?.body;

    const userFound = await User.findOne({ $or: [{ username: email_username }, { email: email_username }] }).exec(); 

    if (!userFound) return res.status(401).json({ message: "Unauthorized" }); 

    const match = await userFound?.matchPassword(password);

    if (!match) return res.status(401).json({ message: "Unauthorized" }); 

    if (!userFound?.active) return res.status(401).json({ message: "Unauthorized" });

    if (!userFound?.email_verified) return res.status(401).json({ message: "You must verify your email before you can sign into your account" });

    if (userFound) {
        userFound.online = true;
        userFound.sign_in_count = userFound?.sign_in_count+1;
        userFound.last_time_active = ''; 
        userFound.last_login_time = new Date().toISOString();
    }; 

    const access = jwt.sign(
        {
            "user": {
                "user_id": userFound._id, 
                "username": userFound.username, 
                "first_name": userFound.first_name, 
                "other_names": userFound.other_names, 
                "last_name": userFound.last_name, 
                "user_image": userFound.user_image_path.url, 
                "email": userFound.email, 
                "phone": userFound.phone, 
                "address": userFound.address, 
                "role": userFound.role, 
                "verified": userFound.verified, 
                "email_verified": userFound.email_verified, 
                "last_login_time": userFound.last_login_time,
            }
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: 12 * 60 * 60 }
        // { expiresIn: 1 * 60 }
    );

    const refresh = jwt.sign(
        { "user_id": userFound._id }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: 12 * 60 * 60 }
        // { expiresIn: 1 * 60 }
    );

    userFound.save()
        .then(function () {
            res.cookie('jwt', refresh, {
                httpOnly: true, 
                secure: true, 
                sameSite: 'Lax', 
                maxAge: 24 * 60 * 60 * 1000      // 2 hours
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