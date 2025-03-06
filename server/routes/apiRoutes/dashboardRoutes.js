import express from 'express'; 
const dashboardRouter = express.Router(); 
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getRevenue, 
        getAppointments, 
        getRegimens, 
        getUserCount, 
        getWidgets, 
        getWidgetValues, 
        addWidget, 
        removeWidget } from '../../controllers/otherControllers/dashboardController.js'; 


dashboardRouter.use(authenticated); 

dashboardRouter.get('/revenue', getRevenue); 
dashboardRouter.get('/appointments', getAppointments); 
dashboardRouter.get('/regimens', getRegimens); 
// dashboardRouter.get('/user-count', checkRoles(roles.admin, roles.superAdmin), getUserCount); 
dashboardRouter.get('/user-count', getUserCount); 
// dashboardRouter.get('/widgets', checkRoles(roles.patient), getWidgets); 
dashboardRouter.post('/widgets/add', addWidget); 
dashboardRouter.get('/widgets/values', getWidgetValues); 
dashboardRouter.put('/widgets/remove', removeWidget); 
dashboardRouter.get('/widgets', getWidgets); 


export default dashboardRouter; 