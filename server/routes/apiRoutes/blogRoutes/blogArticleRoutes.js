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


blogArticleRouter.use(authenticated); 

blogArticleRouter.route('/')
                .get(getBlogArticles)
                .post(createBlogArticle); 

blogArticleRouter.route('/:id')
                .get(getBlogArticle)
                .put(updateBlogArticle)
                .patch(deleteBlogArticle)
                .delete(destroyBlogArticle); 

blogArticleRouter.patch('/:id/restore', restoreBlogArticle); 


export default blogArticleRouter; 