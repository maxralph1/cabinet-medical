import express from 'express'; 
const notificationRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getNotifications, 
        getNotification, 
        deleteNotification, 
        restoreNotification, 
        destroyNotification
} from '../../controllers/notificationController.js'; 


notificationRouter.use(authenticated); 

notificationRouter.get('/', getNotifications); 

notificationRouter.route('/:id')
                .get(getNotification)
                .patch(deleteNotification)
                .delete(destroyNotification); 

notificationRouter.patch('/:id/restore', restoreNotification); 


export default notificationRouter; 