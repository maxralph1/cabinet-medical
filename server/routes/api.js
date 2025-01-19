import express from 'express'; 

const router = express.Router();
import authRouter from './apiRoutes/authRoutes.js'; 
import appointmentRouter from './apiRoutes/appointmentRoutes.js'; 
import blogPostRouter from './apiRoutes/blogPostRoutes.js'; 
import chatMessageRouter from './apiRoutes/chatMessageRoutes.js'; 
import chatRouter from './apiRoutes/chatRoutes.js'; 
import diagnosisRouter from './apiRoutes/diagnosisRoutes.js'; 
import diagnosisSegmentRouter from './apiRoutes/diagnosisSegmentRoutes.js'; 
import inventoryRouter from './apiRoutes/inventoryRoutes.js'; 
import medicalBillRouter from './apiRoutes/medicalBillRoutes.js'; 
// import notificationRouter from './apiRoutes/notificationRoutes.js'; 
import patientChartRouter from './apiRoutes/patientChartRoutes.js'; 
import regimenAdministrationRouter from './apiRoutes/regimenAdministrationRoutes.js'; 
import regimenRouter from './apiRoutes/regimenRoutes.js'; 
import userRouter from './apiRoutes/userRoutes.js'; 


router.use('/auth', authRouter); 
router.use('/appointments', appointmentRouter); 
router.use('/blog-posts', blogPostRouter); 
router.use('/chat-messages', chatMessageRouter); 
router.use('/chats', chatRouter); 
router.use('/diagnoses', diagnosisRouter); 
router.use('/diagnosis-segments', diagnosisSegmentRouter); 
router.use('/inventory', inventoryRouter); 
router.use('/medical-bills', medicalBillRouter); 
// router.use('/notifications', notificationRouter); 
router.use('/patient-charts', patientChartRouter); 
router.use('/regimen-administrations', regimenAdministrationRouter); 
router.use('/regimens', regimenRouter); 
router.use('/users', userRouter); 


export default router;