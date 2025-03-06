import jwt from 'jsonwebtoken'; 


const authenticated = (req, res, next) => {
    const authHeader = req?.headers?.authorization || req?.headers?.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    // console.log(authHeader);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET, 
        (error, decoded) => {
            if (error) return res.sendStatus(403); 
            req.user_id = decoded?.user?.user_id; 
            req.user_username = decoded?.user?.username; 
            req.user_role = decoded?.user?.role; 
            req.username = decoded?.user?.username; 
            req.role = decoded?.user?.role; 
            next();
        }
    );
};


export default authenticated; 