import cloudinaryImageUpload from '../../config/imageUpload/cloudinary.js'; 
import asyncHandler from 'express-async-handler'; 
import BlogComment from '../../models/blog/BlogComment.js';


/**
 * Get Blog Comments
 */
const getBlogComments = asyncHandler(async (req, res) => {
    res.json({ message: "Get all blog comments" }); 
}); 

/**
 * Create Blog Comments
 */
const createBlogComment = asyncHandler(async (req, res) => {
    const { article, content } = req?.body; 

    const blogComment = new BlogComment({
        user: req?.user_id, 
        article, 
        content
    }); 

    blogComment.save()
                .then(() => {
                    res.status(201).json({ success: `Blog Comment ${blogComment?._id} created` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Get Blog Comment
 */
const getBlogComment = asyncHandler(async (req, res) => {
    const blogComment = await BlogComment.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!blogComment) return res.status(404).json({ message: "Blog Comment not found!" }); 

    res.json({ data: blogComment }); 
}); 

/**
 * Update Blog Comment
 */
const updateBlogComment = asyncHandler(async (req, res) => {
    const blogComment = await BlogComment.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!blogComment) return res.status(404).json({ message: "Blog Comment not found!" }); 

    blogComment.content = req?.body?.content || blogComment?.content; 

    blogComment.save()
                .then(() => {
                    res.json({ success: `Blog Comment ${blogComment?._id} updated` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Soft-delete Blog Comment
 */
const deleteBlogComment = asyncHandler(async (req, res) => {
    const blogComment = await BlogComment.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!blogComment) return res.status(404).json({ message: "Blog Comment not found!" }); 

    if (blogComment.deleted_at == '' || blogComment.deleted_at == null) {
        blogComment.deleted_at = new Date().toISOString();
        blogComment.deleted_by = req?.user_id;
    }

    blogComment.save()
                    .then(() => {
                        res.json({ success: `Blog Comment ${blogComment?._id} deleted` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Restore soft-deleted Blog Comment
 */
const restoreBlogComment = asyncHandler(async (req, res) => {
    const blogComment = await BlogComment.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!blogComment) return res.status(404).json({ message: "Blog Comment not found!" }); 

    blogComment.deleted_at = null;
    blogComment.deleted_by = null;

    blogComment.save()
                    .then(() => {
                        res.json({ success: `Blog Comment ${blogComment?._id} restored` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Permanent-delete Blog Comment
 */
const destroyBlogComment = asyncHandler(async (req, res) => {
    const blogComment = await BlogComment.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!blogComment) return res.status(404).json({ message: "Blog Comment not found!" }); 

    blogComment.deleteOne()
                    .then(() => {
                        res.json({ success: `Blog Comment ${blogComment?._id} deleted permanently` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    });
}); 


export { getBlogComments, 
        createBlogComment, 
        getBlogComment, 
        updateBlogComment, 
        deleteBlogComment, 
        restoreBlogComment, 
        destroyBlogComment }; 