import express from 'express'; 

const router = express.Router();
import authRouter from './apiRoutes/authRoutes.js'; 
import appointmentRouter from './apiRoutes/appointmentRoutes.js'; 


export default router;