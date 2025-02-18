import express from 'express'; 

const inventoryRouter = express.Router();
import inventoryCategoryRouter from './inventoryRoutes/inventoryCategoryRoutes.js'; 
import inventoryProductRouter from './inventoryRoutes/inventoryProductRoutes.js'; 
import inventoryProductUnitRouter from './inventoryRoutes/inventoryProductUnitRoutes.js'; 
import inventoryInvoiceRouter from './inventoryRoutes/inventoryInvoiceRoutes.js'; 

 
inventoryRouter.use('/categories', inventoryCategoryRouter); 
inventoryRouter.use('/products', inventoryProductRouter); 
inventoryRouter.use('/product-units', inventoryProductUnitRouter); 
inventoryRouter.use('/invoices', inventoryInvoiceRouter); 


export default inventoryRouter;