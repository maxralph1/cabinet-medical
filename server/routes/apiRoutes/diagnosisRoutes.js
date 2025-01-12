import express from 'express'; 
const diagnosisRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getDiagnoses, 
        createDiagnosis, 
        getDiagnosis, 
        updateDiagnosis, 
        deleteDiagnosis, 
        restoreDiagnosis, 
        destroyDiagnosis
} from '../../controllers/diagnosisController.js'; 


diagnosisRouter.use(authenticated); 

diagnosisRouter.route('/')
                .get(getDiagnoses,)
                .post(createDiagnosis); 

diagnosisRouter.route('/:id')
                .get(getDiagnosis)
                .put(updateDiagnosis)
                .patch(deleteDiagnosis)
                .delete(destroyDiagnosis); 

diagnosisRouter.patch('/:id/restore', restoreDiagnosis); 


export default diagnosisRouter; 