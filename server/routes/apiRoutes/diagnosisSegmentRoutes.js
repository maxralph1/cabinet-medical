import express from 'express'; 
const diagnosisSegmentRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getDiagnosisSegments, 
        createDiagnosisSegment, 
        getDiagnosisSegment, 
        updateDiagnosisSegment, 
        deleteDiagnosisSegment, 
        restoreDiagnosisSegment, 
        destroyDiagnosisSegment
} from '../../controllers/diagnosisSegmentController.js'; 


diagnosisSegmentRouter.use(authenticated); 

diagnosisSegmentRouter.route('/')
                .get(getDiagnosisSegments,)
                .post(createDiagnosisSegment); 

diagnosisSegmentRouter.route('/:id')
                .get(getDiagnosisSegment)
                .put(updateDiagnosisSegment)
                .patch(deleteDiagnosisSegment)
                .delete(destroyDiagnosisSegment); 

diagnosisSegmentRouter.patch('/:id/restore', restoreDiagnosisSegment); 


export default diagnosisSegmentRouter; 