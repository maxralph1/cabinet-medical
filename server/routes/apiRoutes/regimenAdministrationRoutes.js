import express from 'express'; 
const regimenAdministrationRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getRegimenAdministrations, 
        createRegimenAdministration, 
        getRegimenAdministration, 
        updateRegimenAdministration, 
        deleteRegimenAdministration, 
        restoreRegimenAdministration, 
        destroyRegimenAdministration
} from '../../controllers/regimenAdministrationController.js'; 


regimenAdministrationRouter.use(authenticated); 

regimenAdministrationRouter.route('/')
                .get(getRegimenAdministrations,)
                .post(createRegimenAdministration); 

regimenAdministrationRouter.route('/:id')
                .get(getRegimenAdministration)
                .put(updateRegimenAdministration)
                .patch(deleteRegimenAdministration)
                .delete(destroyRegimenAdministration); 

regimenAdministrationRouter.patch('/:id/restore', restoreRegimenAdministration); 


export default regimenAdministrationRouter; 