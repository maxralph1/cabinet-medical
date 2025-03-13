import express from 'express'; 
const inventoryProductRouter = express.Router();
import authenticated from '../../../middleware/authenticated.js'; 
import roles from '../../../config/allowedRoles.js'; 
import checkRoles from '../../../middleware/checkRoles.js'; 
import { getInventoryProducts, 
        createInventoryProduct, 
        getInventoryProduct, 
        updateInventoryProduct, 
        deleteInventoryProduct, 
        restoreInventoryProduct, 
        destroyInventoryProduct
} from '../../../controllers/inventory/inventoryProductController.js'; 


inventoryProductRouter.use(authenticated); 

inventoryProductRouter.route('/')
                .get(getInventoryProducts)
                .post(createInventoryProduct); 

inventoryProductRouter.route('/:id')
                .get(getInventoryProduct)
                .put(updateInventoryProduct)
                .patch(deleteInventoryProduct)
                .delete(destroyInventoryProduct); 

inventoryProductRouter.patch('/:id/restore', restoreInventoryProduct); 


export default inventoryProductRouter; 