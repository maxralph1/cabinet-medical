import express from 'express'; 
const inventoryCategoryRouter = express.Router();
import authenticated from '../../../middleware/authenticated.js'; 
import roles from '../../../config/allowedRoles.js'; 
import checkRoles from '../../../middleware/checkRoles.js'; 
import { getInventoryCategories, 
        createInventoryCategory, 
        getInventoryCategory, 
        updateInventoryCategory, 
        deleteInventoryCategory, 
        restoreInventoryCategory, 
        destroyInventoryCategory
} from '../../../controllers/inventory/inventoryCategoryController.js'; 


inventoryCategoryRouter.use(authenticated); 

inventoryCategoryRouter.route('/')
                .get(getInventoryCategories,)
                .post(createInventoryCategory); 

inventoryCategoryRouter.route('/:id')
                .get(getInventoryCategory)
                .put(updateInventoryCategory)
                .patch(deleteInventoryCategory)
                .delete(destroyInventoryCategory); 

inventoryCategoryRouter.patch('/:id/restore', restoreInventoryCategory); 


export default inventoryCategoryRouter; 