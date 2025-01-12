import express from 'express'; 
const blogPostRouter = express.Router();
import authenticated from '../../middleware/authenticated.js'; 
import roles from '../../config/allowedRoles.js'; 
import checkRoles from '../../middleware/checkRoles.js'; 
import { getBlogPosts, 
        createBlogPost, 
        getBlogPost, 
        updateBlogPost, 
        deleteBlogPost, 
        restoreBlogPost, 
        destroyBlogPost
} from '../../controllers/blogPostController.js'; 


blogPostRouter.use(authenticated); 

blogPostRouter.route('/')
                .get(getBlogPosts,)
                .post(createBlogPost); 

blogPostRouter.route('/:id')
                .get(getBlogPost)
                .put(updateBlogPost)
                .patch(deleteBlogPost)
                .delete(destroyBlogPost); 

blogPostRouter.patch('/:id/restore', restoreBlogPost); 


export default blogPostRouter; 