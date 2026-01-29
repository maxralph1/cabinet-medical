import express from 'express'; 
const chatMessageRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getChatMessages, 
        createChatMessage, 
        getChatMessage, 
        updateChatMessage, 
        deleteChatMessage, 
        restoreChatMessage, 
        destroyChatMessage
} from '../../controllers/chatMessageController.js'; 


chatMessageRouter.use(authenticated); 


chatMessageRouter.route('/:chat/messages')
                .get(getChatMessages,)
                .post(createChatMessage); 

chatMessageRouter.route('/:chat/messages/:id')
                .get(getChatMessage)
                .put(updateChatMessage)
                .patch(deleteChatMessage)
                .delete(destroyChatMessage); 

chatMessageRouter.patch('/:chat/messages/:id/restore', restoreChatMessage); 


export default chatMessageRouter; 