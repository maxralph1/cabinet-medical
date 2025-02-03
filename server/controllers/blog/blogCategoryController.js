import asyncHandler from 'express-async-handler'; 
import BlogCategory from '../../models/blog/BlogCategory.js';
import BlogArticleCategory from '../../models/blog/BlogArticleCategory.js';


/**
 * Get Blog Categories
 */
const getBlogCategories = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    const blogCategories = await BlogCategory.find({ deleted_at: null })
                                            .sort('-created_at')
                                            .skip(skip)
                                            .limit(limit)
                                            .lean();

    if (!blogCategories?.length) return res.status(404).json({ message: "No blog categories found!" }); 

    const total = await BlogCategory.countDocuments({ deleted_at: null }); 

    res.json({ meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: blogCategories });
}); 

/**
 * Create Blog Category
 */
const createBlogCategory = asyncHandler(async (req, res) => {
    const { name, description } = req?.body; 

    const blogCategory = new BlogCategory({
        user: req?.user_id,  
        name, 
        description 
    }); 

    blogCategory.save()
                .then(() => {
                    res.status(201).json({ success: `Blog Category ${blogCategory?._id} created` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Get Blog Category
 */
const getBlogCategory = asyncHandler(async (req, res) => {
    const blogCategory = await BlogCategory.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!blogCategory) return res.status(404).json({ message: "Blog Category not found!" }); 

    const articles = await BlogArticleCategory.find({ blog_category: blogCategory?._id })
                                                .sort('-created_at')
                                                .populate({
                                                    path: 'blog_article', 
                                                })
                                                .lean(); 

    let blogCategoryObj = blogCategory; 

    blogCategoryObj.articles = articles; 

    res.json({ data: blogCategoryObj }); 
}); 

/**
 * Update Blog Category
 */
const updateBlogCategory = asyncHandler(async (req, res) => {
    const blogCategory = await BlogCategory.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!blogCategory) return res.status(404).json({ message: "Blog Category not found!" }); 

    blogCategory.user = req?.body?.user || blogCategory?.user; 
    blogCategory.name = req?.body?.name || blogCategory?.name; 
    blogCategory.description = req?.body?.description || blogCategory?.description; 

    blogCategory.save()
                .then(() => {
                    res.json({ success: `Blog Category ${blogCategory?._id} updated` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Soft-delete Blog Category
 */
const deleteBlogCategory = asyncHandler(async (req, res) => {
    const blogCategory = await BlogCategory.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!blogCategory) return res.status(404).json({ message: "Blog Category not found!" }); 

    if (blogCategory.deleted_at == '' || blogCategory.deleted_at == null) {
        blogCategory.deleted_at = new Date().toISOString();
        blogCategory.deleted_by = req?.user_id;
    }

    blogCategory.save()
                .then(() => {
                    res.json({ success: `Blog Category ${blogCategory?._id} deleted` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Restore soft-deleted Blog Category
 */
const restoreBlogCategory = asyncHandler(async (req, res) => {
    const blogCategory = await BlogCategory.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!blogCategory) return res.status(404).json({ message: "Blog Category not found!" }); 

    blogCategory.deleted_at = null;
    blogCategory.deleted_by = null;

    blogCategory.save()
                .then(() => {
                    res.json({ success: `Blog Category ${blogCategory?._id} restored` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Permanent-delete Blog Category
 */
const destroyBlogCategory = asyncHandler(async (req, res) => {
    const blogCategory = await BlogCategory.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!blogCategory) return res.status(404).json({ message: "Blog Category not found!" }); 

    blogCategory.deleteOne()
                .then(() => {
                    res.json({ success: `Blog Category ${blogCategory?._id} deleted permanently` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 


export { getBlogCategories, 
        createBlogCategory, 
        getBlogCategory, 
        updateBlogCategory, 
        deleteBlogCategory, 
        restoreBlogCategory, 
        destroyBlogCategory }; 