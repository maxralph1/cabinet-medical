import express from 'express'; 
const patientChartRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getPatientCharts, 
        createPatientChart, 
        getPatientChart, 
        updatePatientChart, 
        deletePatientChart, 
        restorePatientChart, 
        destroyPatientChart
} from '../../controllers/patientChartController.js'; 


patientChartRouter.use(authenticated); 

patientChartRouter.route('/')
                .get(getPatientCharts,)
                .post(createPatientChart); 

patientChartRouter.route('/:id')
                .get(getPatientChart)
                .put(updatePatientChart)
                .patch(deletePatientChart)
                .delete(destroyPatientChart); 

patientChartRouter.patch('/:id/restore', restorePatientChart); 


export default patientChartRouter; 