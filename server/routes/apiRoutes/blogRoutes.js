import express from 'express'; 

const blogRouter = express.Router();
import blogCategoryRouter from './blogRoutes/blogCategoryRoutes.js'; 
import blogArticleRouter from './blogRoutes/blogArticleRoutes.js'; 

 
blogRouter.use('/categories', blogCategoryRouter); 
blogRouter.use('/articles', blogArticleRouter); 


export default blogRouter;