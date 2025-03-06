import express from 'express'; 
const notificationRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getNotifications, 
        createNotification, 
        getNotification, 
        updateNotification, 
        deleteNotification, 
        restoreNotification, 
        destroyNotification
} from '../../controllers/notificationController.js'; 


notificationRouter.use(authenticated); 

notificationRouter.route('/')
                .get(getNotifications,)
                .post(createNotification); 

notificationRouter.route('/:id')
                .get(getNotification)
                .put(updateNotification)
                .patch(deleteNotification)
                .delete(destroyNotification); 

notificationRouter.patch('/:id/restore', restoreNotification); 


export default notificationRouter; 