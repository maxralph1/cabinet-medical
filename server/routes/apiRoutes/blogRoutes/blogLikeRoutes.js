import express from 'express'; 
const blogLikeRouter = express.Router();
import authenticated from '../../../middleware/authenticated.js'; 
import roles from '../../../config/allowedRoles.js'; 
import checkRoles from '../../../middleware/checkRoles.js'; 
import { getBlogLikes, 
        createBlogLike, 
        getBlogLike, 
        updateBlogLike, 
        deleteBlogLike, 
        restoreBlogLike, 
        destroyBlogLike
} from '../../../controllers/blog/blogLikeController.js'; 


blogLikeRouter.use(authenticated); 

blogLikeRouter.route('/')
                .get(getBlogLikes)
                .post(createBlogLike); 

blogLikeRouter.route('/:id')
                .get(getBlogLike)
                .put(updateBlogLike)
                .patch(deleteBlogLike)
                .delete(destroyBlogLike); 

blogLikeRouter.patch('/:id/restore', restoreBlogLike); 


export default blogLikeRouter; 