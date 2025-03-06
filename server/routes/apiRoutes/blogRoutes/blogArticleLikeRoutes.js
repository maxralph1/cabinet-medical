import express from 'express'; 
const blogArticleLikeRouter = express.Router();
import authenticated from '../../../middleware/authenticated.js'; 
import roles from '../../../config/allowedRoles.js'; 
import checkRoles from '../../../middleware/checkRoles.js'; 
import { getBlogArticleLikes, 
        createBlogArticleLike, 
        getBlogArticleLike, 
        deleteBlogArticleLike, 
        restoreBlogArticleLike, 
        destroyBlogArticleLike
} from '../../../controllers/blog/blogArticleLikeController.js'; 


blogArticleLikeRouter.use(authenticated); 

blogArticleLikeRouter.route('/')
                .get(getBlogArticleLikes)
                .post(createBlogArticleLike); 

blogArticleLikeRouter.route('/:id')
                .get(getBlogArticleLike)
                .patch(deleteBlogArticleLike)
                .delete(destroyBlogArticleLike); 

blogArticleLikeRouter.patch('/:id/restore', restoreBlogArticleLike); 


export default blogArticleLikeRouter; 