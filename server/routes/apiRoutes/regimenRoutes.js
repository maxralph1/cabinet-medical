import express from 'express'; 
const regimenRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getRegimens, 
        createRegimen, 
        getRegimen, 
        updateRegimen, 
        deleteRegimen, 
        restoreRegimen, 
        destroyRegimen
} from '../../controllers/regimenController.js'; 


regimenRouter.use(authenticated); 

regimenRouter.route('/')
                .get(getRegimens,)
                .post(createRegimen); 

regimenRouter.route('/:id')
                .get(getRegimen)
                .put(updateRegimen)
                .patch(deleteRegimen)
                .delete(destroyRegimen); 

regimenRouter.patch('/:id/restore', restoreRegimen); 


export default regimenRouter; 