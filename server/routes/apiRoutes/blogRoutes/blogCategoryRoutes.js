import express from 'express'; 
const blogCategoryRouter = express.Router();
import authenticated from '../../../middleware/authenticated.js'; 
import roles from '../../../config/allowedRoles.js'; 
import checkRoles from '../../../middleware/checkRoles.js'; 
import { getBlogCategories, 
        createBlogCategory, 
        getBlogCategory, 
        updateBlogCategory, 
        deleteBlogCategory, 
        restoreBlogCategory, 
        destroyBlogCategory
} from '../../../controllers/blog/blogCategoryController.js'; 


blogCategoryRouter.use(authenticated); 

blogCategoryRouter.route('/')
                .get(getBlogCategories)
                .post(createBlogCategory); 

blogCategoryRouter.route('/:id')
                .get(getBlogCategory)
                .put(updateBlogCategory)
                .patch(deleteBlogCategory)
                .delete(destroyBlogCategory); 

blogCategoryRouter.patch('/:id/restore', restoreBlogCategory); 


export default blogCategoryRouter; 