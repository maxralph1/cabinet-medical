import express from 'express'; 
const appointmentRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getAppointments, 
        createAppointment, 
        getAppointment, 
        updateAppointment, 
        deleteAppointment, 
        restoreAppointment, 
        destroyAppointment, 
        getAppointmentsSpecificDate, 
        approveAppointment,     
        declineAppointment, 
        sendReminderAppointment
} from '../../controllers/appointmentController.js'; 


appointmentRouter.use(authenticated); 

appointmentRouter.route('/')
                .get(getAppointments,)
                .post(createAppointment); 

appointmentRouter.get('/specific-date', getAppointmentsSpecificDate); 

appointmentRouter.route('/:id')
                .get(getAppointment)
                .put(updateAppointment)
                .patch(deleteAppointment)
                .delete(destroyAppointment); 

appointmentRouter.patch('/:id/restore', restoreAppointment); 

appointmentRouter.patch('/:id/approve', approveAppointment); 
appointmentRouter.patch('/:id/decline', declineAppointment); 
appointmentRouter.patch('/:id/send-appointment-reminder', declineAppointment); 


export default appointmentRouter; 