import express from 'express'; 
const blogArticleRouter = express.Router();
import authenticated from '../../../middleware/authenticated.js'; 
import roles from '../../../config/allowedRoles.js'; 
import checkRoles from '../../../middleware/checkRoles.js'; 
import { getBlogArticles, 
        createBlogArticle, 
        getBlogArticle, 
        updateBlogArticle, 
        deleteBlogArticle, 
        restoreBlogArticle, 
        destroyBlogArticle
} from '../../../controllers/blog/blogArticleController.js'; 


// blogArticleRouter.use(authenticated); 

blogArticleRouter.route('/')
                .get(getBlogArticles)
                .post(authenticated, createBlogArticle); 

blogArticleRouter.route('/:id')
                .get(getBlogArticle)
                .put(authenticated, updateBlogArticle)
                .patch(authenticated, deleteBlogArticle)
                .delete(authenticated, destroyBlogArticle); 

blogArticleRouter.patch('/:id/restore', authenticated, restoreBlogArticle); 


export default blogArticleRouter; 