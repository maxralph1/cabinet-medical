import express from 'express'; 
const inventoryProductUnitRouter = express.Router();
import authenticated from '../../../middleware/authenticated.js'; 
import roles from '../../../config/allowedRoles.js'; 
import checkRoles from '../../../middleware/checkRoles.js'; 
import { getInventoryProductUnits, 
        createInventoryProductUnit, 
        getInventoryProductUnit, 
        updateInventoryProductUnit, 
        deleteInventoryProductUnit, 
        restoreInventoryProductUnit, 
        destroyInventoryProductUnit
} from '../../../controllers/inventory/inventoryProductUnitController.js'; 


inventoryProductUnitRouter.use(authenticated); 

inventoryProductUnitRouter.route('/')
                .get(getInventoryProductUnits,)
                .post(createInventoryProductUnit); 

inventoryProductUnitRouter.route('/:id')
                .get(getInventoryProductUnit)
                .put(updateInventoryProductUnit)
                .patch(deleteInventoryProductUnit)
                .delete(destroyInventoryProductUnit); 

inventoryProductUnitRouter.patch('/:id/restore', restoreInventoryProductUnit); 


export default inventoryProductUnitRouter; 