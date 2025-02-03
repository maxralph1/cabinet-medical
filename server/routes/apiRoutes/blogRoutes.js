import express from 'express'; 

const blogRouter = express.Router();
import blogCategoryRouter from './blogRoutes/blogCategoryRoutes.js'; 
import blogArticleRouter from './blogRoutes/blogArticleRoutes.js'; 
<<<<<<< HEAD
import blogCommentRouter from './blogRoutes/blogCommentRoutes.js'; 
import blogLikeRouter from './blogRoutes/blogLikeRoutes.js'; 
=======
>>>>>>> 343b6d2dd910b4843d9f81e632cfe4014aafa064

 
blogRouter.use('/categories', blogCategoryRouter); 
blogRouter.use('/articles', blogArticleRouter); 
<<<<<<< HEAD
blogRouter.use('/comments', blogCommentRouter); 
blogRouter.use('/likes', blogLikeRouter); 
=======
>>>>>>> 343b6d2dd910b4843d9f81e632cfe4014aafa064


export default blogRouter;