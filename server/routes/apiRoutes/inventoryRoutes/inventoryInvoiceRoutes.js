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


inventoryInvoiceRouter.use(authenticated); 

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