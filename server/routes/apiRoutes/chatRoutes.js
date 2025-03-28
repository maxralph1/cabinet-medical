import express from 'express'; 
const chatRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getChats, 
        createChat, 
        getChat, 
        updateChat, 
        deleteChat, 
        restoreChat, 
        destroyChat
} from '../../controllers/chatController.js'; 


chatRouter.use(authenticated); 

chatRouter.route('/')
                .get(getChats)
                .post(createChat); 

chatRouter.route('/:id')
                .get(getChat)
                .put(updateChat)
                .patch(deleteChat)
                .delete(destroyChat); 

chatRouter.patch('/:id/restore', restoreChat); 


export default chatRouter; 