import cloudinaryImageUpload from '../../config/imageUpload/cloudinary.js'; 
import asyncHandler from 'express-async-handler'; 
import BlogArticle from '../../models/blog/BlogArticle.js';
import BlogArticleCategory from '../../models/blog/BlogArticleCategory.js';
<<<<<<< HEAD
import BlogComment from '../../models/blog/BlogComment.js';
import BlogLike from '../../models/blog/BlogLike.js';
=======
>>>>>>> 343b6d2dd910b4843d9f81e632cfe4014aafa064


/**
 * Get Blog Articles
 */
const getBlogArticles = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    const blogArticles = await BlogArticle.find({ deleted_at: null })
                                        .sort('-created_at')
                                        .skip(skip)
                                        .limit(limit)
                                        .lean();

    if (!blogArticles?.length) return res.status(404).json({ message: "No blog articles found!" }); 

    const total = await BlogArticle.countDocuments({ deleted_at: null }); 

    let blogArticleList = []; 

    const updateBlogArticlePromises = blogArticles?.map(async blogArticleItem => { 
        let foundBlogArticleCategories = await BlogArticleCategory.find({ blog_article: blogArticleItem?._id })
                                                                .populate({
                                                                    path: 'user',
                                                                    select: 'first_name last_name username'
                                                                })
                                                                .populate({
                                                                    path: 'blog_category', 
                                                                })
                                                                .populate({
                                                                    path: 'blog_article', 
                                                                })
<<<<<<< HEAD
                                                                .lean(); 
        blogArticleItem['categories'] = foundBlogArticleCategories; 

        let foundBlogArticleComments = await BlogComment.find({ blog_article: blogArticleItem?._id })
                                                        .populate({
                                                            path: 'user',
                                                            select: 'first_name last_name username'
                                                        })
                                                        .lean(); 
        blogArticleItem['comments'] = foundBlogArticleComments; 

        let foundBlogArticleLikes = await BlogLike.find({ blog_article: blogArticleItem?._id })
                                                .populate({
                                                    path: 'user',
                                                    select: 'first_name last_name username'
                                                })
                                                .lean(); 
        blogArticleItem['likes'] = foundBlogArticleLikes; 

=======
                                                                .lean()

        blogArticleItem['categories'] = foundBlogArticleCategories; 

>>>>>>> 343b6d2dd910b4843d9f81e632cfe4014aafa064
        blogArticleList.push(blogArticleItem); 
    }); 

    await Promise.all(updateBlogArticlePromises); 

    res.json({ meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: blogArticleList });
}); 

/**
 * Create Blog Article
 */
const createBlogArticle = asyncHandler(async (req, res) => {
    const { title, content, categories } = req?.body; 

    let blogArticleImageUpload = {};
    if (!req?.files?.image) {
        blogArticleImageUpload.public_id = ''
        blogArticleImageUpload.secure_url = ''
    } else if (req?.files?.image) {
        blogArticleImageUpload = await cloudinaryImageUpload(req?.files?.image.tempFilePath, "cabinet_medical_blog_article_images"); 
        if (!blogArticleImageUpload) return res.status(400).json({ message: "Image upload failed" }); 
    }; 

    const blogArticle = new BlogArticle({
        image_path: { 
            public_id: blogArticleImageUpload.public_id,
            url: blogArticleImageUpload.secure_url
        }, 
        user: req?.user_id,  
        title, 
        content 
    }); 

    const categories_array = categories.split(',');

    if (categories && categories?.length === 0) { 

        return res.status(400).json({ message: 'No categories. You must add at least one test item!' }); 

    } else if (categories && categories?.length > 0) { 
        const categoriesResolve = categories_array?.map(async (category, index) => { 
            await BlogArticleCategory.create({
                user: req?.user_id, 
                blog_article: article?._id, 
                blog_category: category, 
            });
        }); 

        await Promise.all(categoriesResolve); 
    };

    blogArticle.save()
                .then(() => {
                    res.status(201).json({ success: `Blog Article ${blogArticle?._id} created` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Get Blog Article
 */
const getBlogArticle = asyncHandler(async (req, res) => {
    const blogArticle = await BlogArticle.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!blogArticle) return res.status(404).json({ message: "Blog Article not found!" }); 

    const categories = await BlogArticleCategory.find({ blog_category: blogCategory?._id })
                                                .sort('-created_at')
                                                .populate({
                                                    path: 'blog_category', 
                                                })
                                                .lean(); 

    let blogArticleObj = blogArticle; 

    blogArticleObj.categories = categories; 

    res.json({ data: blogArticleObj }); 
}); 

/**
 * Update Blog Article
 */
const updateBlogArticle = asyncHandler(async (req, res) => {
    const blogArticle = await BlogArticle.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!blogArticle) return res.status(404).json({ message: "Blog Article not found!" }); 

    /** Image Upload */
    let blogArticleImageUpload = {};
    if (!req?.files?.image) {
        blogArticleImageUpload.public_id = ''
        blogArticleImageUpload.secure_url = ''
    } else if (req?.files?.image) {
        blogArticleImageUpload = await cloudinaryImageUpload(req?.files?.image.tempFilePath, "cabinet_medical_blog_article_images"); 
        if (!blogArticleImageUpload) return res.status(400).json({ message: "Image upload failed" }); 

        blogArticle.image_path.public_id = blogArticleImageUpload.public_id
        blogArticle.image_path.url = blogArticleImageUpload.secure_url
    }
    /** End of Image upload */

    blogArticle.user = req?.body?.user || blogArticle?.user; 
    blogArticle.title = req?.body?.title || blogArticle?.title; 
    blogArticle.content = req?.body?.content || blogArticle?.content; 
    
    blogArticle.save()
                .then(() => {
                    res.json({ success: `Blog Article ${blogArticle?._id} updated` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Soft-delete Blog Article
 */
const deleteBlogArticle = asyncHandler(async (req, res) => {
    const blogArticle = await BlogArticle.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!blogArticle) return res.status(404).json({ message: "Blog Article not found!" }); 

    if (blogArticle.deleted_at == '' || blogArticle.deleted_at == null) {
        blogArticle.deleted_at = new Date().toISOString();
        blogArticle.deleted_by = req?.user_id;
    }

    blogArticle.save()
                .then(() => {
                    res.json({ success: `Blog Article ${blogArticle?._id} deleted` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Restore soft-deleted Blog Article
 */
const restoreBlogArticle = asyncHandler(async (req, res) => {
    const blogArticle = await BlogArticle.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!blogArticle) return res.status(404).json({ message: "Blog Article not found!" }); 

    blogArticle.deleted_at = null;
    blogArticle.deleted_by = null;

    blogArticle.save()
                .then(() => {
                    res.json({ success: `Blog Article ${blogArticle?._id} restored` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Permanent-delete Blog Article
 */
const destroyBlogArticle = asyncHandler(async (req, res) => {
    const blogArticle = await BlogArticle.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!blogArticle) return res.status(404).json({ message: "Blog Article not found!" }); 

    blogArticle.deleteOne()
                .then(() => {
                    res.json({ success: `Blog Article ${blogArticle?._id} deleted permanently` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 


export { getBlogArticles, 
        createBlogArticle, 
        getBlogArticle, 
        updateBlogArticle, 
        deleteBlogArticle, 
        restoreBlogArticle, 
        destroyBlogArticle };