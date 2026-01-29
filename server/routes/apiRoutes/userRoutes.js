import express from 'express'; 
const userRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getUsers, 
        createUser, 
        getUser, 
        updateUser, 
        deleteUser, 
        restoreUser, 
        destroyUser
} from '../../controllers/userController.js'; 


userRouter.use(authenticated); 

userRouter.route('/')
                .get(getUsers,)
                .post(createUser); 

userRouter.route('/:username')
                .get(getUser)
                .put(updateUser)
                .patch(deleteUser)
                .delete(destroyUser); 

userRouter.patch('/:id/restore', restoreUser); 


export default userRouter; 