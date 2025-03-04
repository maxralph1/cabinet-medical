import express from 'express'; 
const medicalBillRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getMedicalBills, 
        createMedicalBill, 
        getMedicalBill, 
        updateMedicalBill, 
        deleteMedicalBill, 
        restoreMedicalBill, 
        destroyMedicalBill
} from '../../controllers/medicalBillController.js'; 
import { createMedicalBillPayment, 
        captureMedicalBillPayment, 
        authorizeMedicalBillPayment, 
        captureAuthorisedMedicalBillPayment
} from '../../controllers/medicalBillPaymentController.js'; 


medicalBillRouter.use(authenticated); 

/** Additional Routes */
/** Payment */ 
medicalBillRouter.post('/payment', createMedicalBillPayment); 
medicalBillRouter.post('/payment/:orderID/capture', captureMedicalBillPayment); 
medicalBillRouter.post('/payment/:orderID/authorize', authorizeMedicalBillPayment); 
medicalBillRouter.post('/payment/:authorizationId/captureAuthorize', captureAuthorisedMedicalBillPayment); 

medicalBillRouter.route('/')
                .get(getMedicalBills,)
                .post(createMedicalBill); 

medicalBillRouter.route('/:id')
                .get(getMedicalBill)
                .put(updateMedicalBill)
                .patch(deleteMedicalBill)
                .delete(destroyMedicalBill); 

medicalBillRouter.patch('/:id/restore', restoreMedicalBill); 


export default medicalBillRouter; 