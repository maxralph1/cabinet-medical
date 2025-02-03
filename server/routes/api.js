import express from 'express'; 

const router = express.Router();
import authRouter from './apiRoutes/authRoutes.js'; 
import appointmentRouter from './apiRoutes/appointmentRoutes.js'; 
import blogRouter from './apiRoutes/blogRoutes.js'; 
import chatMessageRouter from './apiRoutes/chatMessageRoutes.js'; 
import chatRouter from './apiRoutes/chatRoutes.js'; 
import diagnosisRouter from './apiRoutes/diagnosisRoutes.js'; 
import diagnosisSegmentRouter from './apiRoutes/diagnosisSegmentRoutes.js'; 
import diagnosisTypeRouter from './apiRoutes/diagnosisTypeRoutes.js'; 
import inventoryRouter from './apiRoutes/inventoryRoutes.js'; 
import medicalBillRouter from './apiRoutes/medicalBillRoutes.js'; 
// import notificationRouter from './apiRoutes/notificationRoutes.js'; 
import patientChartRouter from './apiRoutes/patientChartRoutes.js'; 
import patientRouter from './apiRoutes/patientRoutes.js'; 
import professionalRouter from './apiRoutes/professionalRoutes.js'; 
import regimenAdministrationRouter from './apiRoutes/regimenAdministrationRoutes.js'; 
import regimenRouter from './apiRoutes/regimenRoutes.js'; 
import userRouter from './apiRoutes/userRoutes.js'; 


router.use('/auth', authRouter); 
router.use('/appointments', appointmentRouter); 
router.use('/blog', blogRouter); 
router.use('/chat-messages', chatMessageRouter); 
router.use('/chats', chatRouter); 
router.use('/diagnoses', diagnosisRouter); 
router.use('/diagnosis-segments', diagnosisSegmentRouter); 
router.use('/diagnosis-types', diagnosisTypeRouter); 
router.use('/inventory', inventoryRouter); 
router.use('/medical-bills', medicalBillRouter); 
// router.use('/notifications', notificationRouter); 
router.use('/patient-charts', patientChartRouter); 
router.use('/patients', patientRouter); 
router.use('/professionals', professionalRouter); 
router.use('/regimen-administrations', regimenAdministrationRouter); 
router.use('/regimens', regimenRouter); 
router.use('/users', userRouter); 


export default router;