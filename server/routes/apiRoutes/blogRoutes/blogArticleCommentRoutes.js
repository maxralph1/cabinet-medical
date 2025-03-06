import express from 'express'; 
const blogArticleCommentRouter = express.Router();
import authenticated from '../../../middleware/authenticated.js'; 
import roles from '../../../config/allowedRoles.js'; 
import checkRoles from '../../../middleware/checkRoles.js'; 
import { getBlogArticleComments, 
        createBlogArticleComment, 
        getBlogArticleComment, 
        updateBlogArticleComment, 
        deleteBlogArticleComment, 
        restoreBlogArticleComment, 
        destroyBlogArticleComment
} from '../../../controllers/blog/blogArticleCommentController.js'; 


blogArticleCommentRouter.use(authenticated); 

blogArticleCommentRouter.route('/')
                .get(getBlogArticleComments)
                .post(createBlogArticleComment); 

blogArticleCommentRouter.route('/:id')
                .get(getBlogArticleComment)
                .put(updateBlogArticleComment)
                .patch(deleteBlogArticleComment)
                .delete(destroyBlogArticleComment); 

blogArticleCommentRouter.patch('/:id/restore', restoreBlogArticleComment); 


export default blogArticleCommentRouter; 