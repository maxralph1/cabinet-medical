import express from 'express'; 
const diagnosisTypeRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getDiagnosisTypes, 
        createDiagnosisType, 
        getDiagnosisType, 
        updateDiagnosisType, 
        deleteDiagnosisType, 
        restoreDiagnosisType, 
        destroyDiagnosisType
} from '../../controllers/diagnosisTypeController.js'; 


diagnosisTypeRouter.use(authenticated); 

diagnosisTypeRouter.route('/')
                .get(getDiagnosisTypes,)
                .post(createDiagnosisType); 

diagnosisTypeRouter.route('/:id')
                .get(getDiagnosisType)
                .put(updateDiagnosisType)
                .patch(deleteDiagnosisType)
                .delete(destroyDiagnosisType); 

diagnosisTypeRouter.patch('/:id/restore', restoreDiagnosisType); 


export default diagnosisTypeRouter; 