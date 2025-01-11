import asyncHandler from 'express-async-handler'; 
import jwt from 'jsonwebtoken'; 
import User from '../../models/User.js'; 
import registerEmailConfirmMailTemplate from '../../mails/templates/registerEmailConfirmMail.js'; 


const signUpUser = asyncHandler(async (req, res) => {
    const { username, 
            first_name, 
            last_name, 
<<<<<<< HEAD
=======
            enterprise_name, 
>>>>>>> 2167b0382c47c97bb177e6f3f0eb7b59d6b73cae
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
<<<<<<< HEAD
        accountType = "patient";
    } else if (account_type && account_type == "patient") {
        accountType = "patient";
    } else if (account_type && account_type == "doctor") {
        accountType = "doctor";
=======
        accountType = "individual";
    } else if (account_type && account_type == "individual") {
        accountType = "individual";
    } else if (account_type && account_type == "enterprise") {
        accountType = "enterprise";
>>>>>>> 2167b0382c47c97bb177e6f3f0eb7b59d6b73cae
    }; 

    const user = new User({
        username,
        first_name, 
<<<<<<< HEAD
        last_name, 
=======
        last_name,
        enterprise_name,
>>>>>>> 2167b0382c47c97bb177e6f3f0eb7b59d6b73cae
        email,
        phone,
        password,
        role: accountType,
        email_verify_token: emailVerifyToken
    }); 

    user.save()
        .then(function () {
            res.status(201).json({ success: `User ${user?.username} created` });
        })
        .catch(function (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        });

    (async function () {

        registerEmailConfirmMailTemplate(user);
        
    })();
}); 


export default signUpUser; 