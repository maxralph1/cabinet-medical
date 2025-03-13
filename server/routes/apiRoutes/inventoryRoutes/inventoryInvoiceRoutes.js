import express from 'express'; 
const inventoryInvoiceRouter = express.Router();
import authenticated from '../../../middleware/authenticated.js'; 
import roles from '../../../config/allowedRoles.js'; 
import checkRoles from '../../../middleware/checkRoles.js'; 
import { getInventoryInvoices, 
        createInventoryInvoice, 
        getInventoryInvoice, 
        updateInventoryInvoice, 
        deleteInventoryInvoice, 
        restoreInventoryInvoice, 
        destroyInventoryInvoice
} from '../../../controllers/inventory/inventoryInvoiceController.js'; 
import { createInvoicePayment, 
        captureInvoicePayment, 
        authorizeInvoicePayment, 
        captureAuthorisedInvoicePayment
} from '../../../controllers/inventory/inventoryInvoicePaymentController.js'; 


inventoryInvoiceRouter.use(authenticated); 

/** Additional Routes */
/** Payment */ 
inventoryInvoiceRouter.post('/payment', createInvoicePayment); 
inventoryInvoiceRouter.post('/payment/:orderID/capture', captureInvoicePayment); 
inventoryInvoiceRouter.post('/payment/:orderID/authorize', authorizeInvoicePayment); 
inventoryInvoiceRouter.post('/payment/:authorizationId/captureAuthorize', captureAuthorisedInvoicePayment); 

inventoryInvoiceRouter.route('/')
                        .get(getInventoryInvoices)
                        .post(createInventoryInvoice); 

inventoryInvoiceRouter.route('/:id')
                        .get(getInventoryInvoice)
                        .put(updateInventoryInvoice)
                        .patch(deleteInventoryInvoice)
                        .delete(destroyInventoryInvoice); 

inventoryInvoiceRouter.patch('/:id/restore', restoreInventoryInvoice); 


export default inventoryInvoiceRouter; 