import express from 'express'; 

const blogRouter = express.Router();
import blogCategoryRouter from './blogRoutes/blogCategoryRoutes.js'; 
import blogArticleRouter from './blogRoutes/blogArticleRoutes.js'; 
import blogCommentRouter from './blogRoutes/blogArticleCommentRoutes.js'; 
import blogLikeRouter from './blogRoutes/blogArticleLikeRoutes.js'; 

 
blogRouter.use('/categories', blogCategoryRouter); 
blogRouter.use('/articles', blogArticleRouter); 
blogRouter.use('/comments', blogCommentRouter); 
blogRouter.use('/likes', blogLikeRouter); 


export default blogRouter;