import express from 'express'; 
const professionalRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getProfessionals } from '../../controllers/userControllers/professionalController.js'; 


professionalRouter.get('/', authenticated, getProfessionals); 


export default professionalRouter; 