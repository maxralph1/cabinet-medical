import express from 'express'; 
const contactUsRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getContactUsRecords, 
        createContactUs, 
        getContactUs, 
        updateContactUs, 
        deleteContactUs, 
        restoreContactUs, 
        destroyContactUs, 
} from '../../controllers/contactUsController.js'; 


contactUsRouter.post('/', createContactUs); 

contactUsRouter.use(authenticated); 

contactUsRouter.get('/', getContactUsRecords); 

contactUsRouter.route('/:id')
                .get(getContactUs)
                .put(updateContactUs)
                .patch(deleteContactUs)
                .delete(destroyContactUs); 

contactUsRouter.patch('/:id/restore', restoreContactUs); 


export default contactUsRouter; 