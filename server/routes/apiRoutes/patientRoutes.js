import express from 'express'; 
const patientRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getPatients } from '../../controllers/userControllers/patientController.js'; 


patientRouter.get('/', authenticated, getPatients); 


export default patientRouter; 