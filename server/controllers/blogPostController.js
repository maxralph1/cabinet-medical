import cloudinaryImageUpload from '../config/imageUpload/cloudinary.js'; 
import asyncHandler from 'express-async-handler'; 
// import slug from 'slug';
// const slugIt = slug; 
import BlogPost from '../models/BlogPost.js'; 


/** 
 * Get Blog Posts
 */ 
const getBlogPosts = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    const blogPosts = await BlogPost.find({ deleted_at: null })
                                    .sort('-created_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .lean(); 
    if (!blogPosts?.length) return res.status(404).json({ message: "No blog posts found!" }); 

    const total = await BlogPost.countDocuments({ deleted_at: null }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: blogPosts 
            });
}); 

/**
 * Create Blog Post
 */ 
const createBlogPost = asyncHandler(async (req, res) => {
    const { user, topic, content } = req?.body; 

    const blogPost = new BlogPost({
        user: req?.user_id, 
        topic, 
        content
    }); 

    blogPost.save()
                .then(() => {
                    res.status(201).json({ success: `Blog Post ${blogPost?._id} created` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 

/**
 * Get Blog Post
 */ 
const getBlogPost = asyncHandler(async (req, res) => {
    const blogPost = await BlogPost.findById(req?.params?.id)
                                    .lean(); 
    if (!blogPost) return res.status(404).json({ message: "Blog Post not found!" }); 

    res.json({ data: blogPost }); 
}); 

/**
 * Update Blog Post
 */ 
const updateBlogPost = asyncHandler(async (req, res) => {
    const blogPost = await BlogPost.findById(req?.params?.id); 
    if (!blogPost) return res.status(404).json({ message: "Blog Post not found!" }); 

    blogPost.topic = req?.body?.topic || blogPost?.topic; 
    blogPost.content = req?.body?.content || blogPost?.content;  

    blogPost.save()
                .then(() => {
                    res.json({ success: `Blog Post ${blogPost?._id} updated` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Soft-delete Blog Post
 */
const deleteBlogPost = asyncHandler(async (req, res) => {
    const blogPost = await BlogPost.findById(req?.params?.id); 
    if (!blogPost) return res.status(404).json({ message: "Blog Post not found!" }); 

    if (blogPost.deleted_at == '' || blogPost.deleted_at == null) {
        blogPost.deleted_at = new Date().toISOString();
        blogPost.deleted_by = req?.user_id;
    };

    blogPost.save()
                .then(() => {
                    res.json({ success: `Blog Post ${blogPost?._id} deleted` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Restore soft-deleted Blog Post
 */ 
const restoreBlogPost = asyncHandler(async (req, res) => {
    const blogPost = await BlogPost.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!blogPost) return res.status(404).json({ message: "BlogPost not found!" }); 

    blogPost.deleted_at = null;
    blogPost.deleted_by = null; 

    blogPost.save()
                .then(() => {
                    res.json({ success: `Blog Post ${blogPost?._id} restored` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 

/**
 * Permanent-delete a Blog Post
 */ 
const destroyBlogPost = asyncHandler(async (req, res) => {
    const blogPost = await BlogPost.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!blogPost) return res.status(404).json({ message: "Blog Post not found!" }); 

    blogPost.deleteOne()
                .then(() => {
                    res.json({ success: `Blog Post ${blogPost?._id} deleted` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 


export { getBlogPosts, 
        createBlogPost, 
        getBlogPost, 
        updateBlogPost, 
        deleteBlogPost, 
        restoreBlogPost, 
        destroyBlogPost };