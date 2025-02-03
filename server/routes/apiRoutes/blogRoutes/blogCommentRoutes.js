import express from 'express'; 
const blogCommentRouter = express.Router();
import authenticated from '../../../middleware/authenticated.js'; 
import roles from '../../../config/allowedRoles.js'; 
import checkRoles from '../../../middleware/checkRoles.js'; 
import { getBlogComments, 
        createBlogComment, 
        getBlogComment, 
        updateBlogComment, 
        deleteBlogComment, 
        restoreBlogComment, 
        destroyBlogComment
} from '../../../controllers/blog/blogCommentController.js'; 


blogCommentRouter.use(authenticated); 

blogCommentRouter.route('/')
                .get(getBlogComments)
                .post(createBlogComment); 

blogCommentRouter.route('/:id')
                .get(getBlogComment)
                .put(updateBlogComment)
                .patch(deleteBlogComment)
                .delete(destroyBlogComment); 

blogCommentRouter.patch('/:id/restore', restoreBlogComment); 


export default blogCommentRouter; 