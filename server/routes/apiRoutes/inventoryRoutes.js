import express from 'express'; 
const inventoryRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getInventories, 
        createInventory, 
        getInventory, 
        updateInventory, 
        deleteInventory, 
        restoreInventory, 
        destroyInventory
} from '../../controllers/inventoryController.js'; 


inventoryRouter.use(authenticated); 

inventoryRouter.route('/')
                .get(getInventories,)
                .post(createInventory); 

inventoryRouter.route('/:id')
                .get(getInventory)
                .put(updateInventory)
                .patch(deleteInventory)
                .delete(destroyInventory); 

inventoryRouter.patch('/:id/restore', restoreInventory); 


export default inventoryRouter; 