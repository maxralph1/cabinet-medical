import express from 'express'; 
const appointmentRequestRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getAppointmentRequests, 
        createAppointmentRequest, 
        getAppointmentRequest, 
        updateAppointmentRequest, 
        deleteAppointmentRequest, 
        restoreAppointmentRequest, 
        destroyAppointmentRequest, 
        approveAppointmentRequest, 
        rejectAppointmentRequest,
} from '../../controllers/appointmentRequestController.js'; 


appointmentRequestRouter.post('/', createAppointmentRequest); 

appointmentRequestRouter.use(authenticated); 

appointmentRequestRouter.get('/', getAppointmentRequests); 

appointmentRequestRouter.route('/:id')
                .get(getAppointmentRequest)
                .put(updateAppointmentRequest)
                .patch(deleteAppointmentRequest)
                .delete(destroyAppointmentRequest); 

appointmentRequestRouter.patch('/:id/restore', restoreAppointmentRequest); 

appointmentRequestRouter.patch('/:id/approve', approveAppointmentRequest); 
appointmentRequestRouter.patch('/:id/reject', rejectAppointmentRequest); 


export default appointmentRequestRouter; 