import cloudinaryImageUpload from '../../config/imageUpload/cloudinary.js'; 
import asyncHandler from 'express-async-handler'; 
import BlogLike from '../../models/blog/BlogLike.js';


/**
 * Get Blog Likes
 */
const getBlogLikes = asyncHandler(async (req, res) => {
    res.json({ message: "Get all blog likes" }); 
}); 

/**
 * Create Blog Likes
 */
const createBlogLike = asyncHandler(async (req, res) => {
    const { article, comment } = req?.body; 

    const blogLike = new BlogLike({
        user: req?.user_id, 
        article, 
        comment
    }); 

    blogLike.save()
            .then(() => {
                res.status(201).json({ success: `Blog Like ${blogLike?._id} created` });
            })
            .catch(error => {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            }); 
}); 

/**
 * Get Blog Like
 */
const getBlogLike = asyncHandler(async (req, res) => {
    const blogLike = await BlogLike.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!blogLike) return res.status(404).json({ message: "Blog Like not found!" }); 

    res.json({ data: blogLike }); 
}); 

/**
 * Update Blog Like
 */
const updateBlogLike = asyncHandler(async (req, res) => {
    res.json({ message: "Update blog like" }); 
}); 

/**
 * Soft-delete Blog Like
 */
const deleteBlogLike = asyncHandler(async (req, res) => {
    const blogLike = await BlogLike.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!blogLike) return res.status(404).json({ message: "Blog Like not found!" }); 

    if (blogLike.deleted_at == '' || blogLike.deleted_at == null) {
        blogLike.deleted_at = new Date().toISOString();
        blogLike.deleted_by = req?.user_id;
    }

    blogLike.save()
            .then(() => {
                res.json({ success: `Blog Like ${blogLike?._id} deleted` });
            })
            .catch(error => {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            }); 
}); 

/**
 * Restore soft-deleted Blog Like
 */
const restoreBlogLike = asyncHandler(async (req, res) => {
    const blogLike = await BlogLike.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!blogLike) return res.status(404).json({ message: "Blog Like not found!" }); 

    blogLike.deleted_at = null;
    blogLike.deleted_by = null;

    blogLike.save()
            .then(() => {
                res.json({ success: `Blog Like ${blogLike?._id} restored` });
            })
            .catch(error => {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            }); 
}); 

/**
 * Permanent-delete Blog Like
 */
const destroyBlogLike = asyncHandler(async (req, res) => {
    const blogLike = await BlogLike.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!blogLike) return res.status(404).json({ message: "Blog Like not found!" }); 

    blogLike.deleteOne()
            .then(() => {
                res.json({ success: `Blog Like ${blogLike?._id} deleted permanently` });
            })
            .catch(error => {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            });
}); 


export { getBlogLikes, 
        createBlogLike, 
        getBlogLike, 
        updateBlogLike, 
        deleteBlogLike, 
        restoreBlogLike, 
        destroyBlogLike }; 