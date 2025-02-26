import cloudinaryImageUpload from '../../config/imageUpload/cloudinary.js'; 
import asyncHandler from 'express-async-handler'; 
import BlogArticle from '../../models/blog/BlogArticle.js'; 
import BlogArticleComment from '../../models/blog/BlogArticleComment.js'; 
import BlogArticleCategory from '../../models/blog/BlogArticleCategory.js'; 


/**
 * Get Blog Article Comments
 */
const getBlogArticleComments = asyncHandler(async (req, res) => {
    res.json({ message: 'Blog Article Comments'});
}); 

/**
 * Create Blog Article Comment
 */
const createBlogArticleComment = asyncHandler(async (req, res) => {
    // const { article } = req?.params; 
    const { article, content } = req?.body; 

    const blogArticleComment = new BlogArticleComment({
        user: req?.user_id, 
        blog_article: article, 
        content
    }); 

    blogArticleComment.save()
                .then(() => {
                    res.status(201).json({ success: `Blog Article Comment ${blogArticleComment?._id} for Article ${article} created` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Get Blog Article Comment
 */
const getBlogArticleComment = asyncHandler(async (req, res) => {
    const blogArticleComment = await BlogArticleComment.findOne({ _id: req?.params?.id, deleted_at: null })
                                        .populate({
                                            path: 'user',
                                            select: 'first_name last_name username'
                                        })
                                        .lean(); 

    if (!blogArticleComment) return res.status(404).json({ message: "Blog Article Comment not found!" }); 

    res.json({ data: blogArticleComment }); 
}); 

/**
 * Update Blog Article Comment
 */
const updateBlogArticleComment = asyncHandler(async (req, res) => {
    res.json({ message: 'Update Blog Article Comment' });
}); 

/**
 * Soft-delete Blog Article Comment
 */
const deleteBlogArticleComment = asyncHandler(async (req, res) => {
    const blogArticleComment = await BlogArticleComment.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!blogArticleComment) return res.status(404).json({ message: "Blog Article not found!" }); 

    if (blogArticleComment.deleted_at == '' || blogArticleComment.deleted_at == null) {
        blogArticleComment.deleted_at = new Date().toISOString();
        blogArticleComment.deleted_by = req?.user_id;
    }

    blogArticleComment.save()
                .then(() => {
                    res.json({ success: `Blog Article Comment ${blogArticleComment?._id} deleted` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Restore soft-deleted Blog Article Comment
 */
const restoreBlogArticleComment = asyncHandler(async (req, res) => {
    const blogArticleComment = await BlogArticleComment.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!blogArticleComment) return res.status(404).json({ message: "Blog Article not found!" }); 

    blogArticleComment.deleted_at = null;
    blogArticleComment.deleted_by = null;

    blogArticleComment.save()
                .then(() => {
                    res.json({ success: `Blog Article Comment ${blogArticleComment?._id} restored` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Permanent-delete Blog Article Comment
 */
const destroyBlogArticleComment = asyncHandler(async (req, res) => {
    const blogArticleComment = await BlogArticleComment.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!blogArticleComment) return res.status(404).json({ message: "Blog Article not found!" }); 

    blogArticleComment.deleteOne()
                .then(() => {
                    res.json({ success: `Blog Article Comment ${blogArticleComment?._id} deleted permanently` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 


export { getBlogArticleComments, 
        createBlogArticleComment, 
        getBlogArticleComment, 
        updateBlogArticleComment, 
        deleteBlogArticleComment, 
        restoreBlogArticleComment, 
        destroyBlogArticleComment };