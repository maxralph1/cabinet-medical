import asyncHandler from 'express-async-handler'; 
import jwt from 'jsonwebtoken'; 
import User from '../../models/User.js'; 


const signOutUser = asyncHandler(async (req, res) => {
    const cookies = req.cookies; 
    // console.log("cookies:", cookies); 

    console.log('decoded', jwt.verify(req?.cookies?.jwt, process.env.JWT_SECRET));
    console.log('Logged out')

    if (!cookies?.jwt) return res.sendStatus(204);

    try {
        const decoded = jwt.verify(req?.cookies?.jwt, process.env.JWT_SECRET); 

        let user = await User.findById(decoded.user_id).exec();

        if (user) {
            user.online = false;
            user.last_time_active = new Date().toISOString();
        }

        await user.save();
    } catch (error) {
        console.error(error); 
        res.status(401);
        throw new Error('Not authorized, token failed');
    }; 

    res.clearCookie('jwt', {
        httpOnly: true, 
        sameSite: 'None', 
        secure: false
    }); 

    res.json({ success: 'Logged out successfully' });



    // const cookies = req?.cookies; 
    // // console.log('cookies', cookies);
    // // console.log('cookies-jwt', cookies?.jwt);

    // if (!cookies?.jwt) return res.sendStatus(204);

    // let user = await User.findById(req?.user_id).exec(); 

    // if (!user) res.status(401);

    // user.online = false;
    // user.last_time_active = new Date().toISOString(); 

    // await user.save();

    // res.clearCookie('jwt', {
    //     httpOnly: true, 
    //     sameSite: 'None', 
    //     secure: true
    // }); 

    // res.json({ success: 'Logged out successfully' }); 
});


export default signOutUser; 