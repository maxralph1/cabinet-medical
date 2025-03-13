import cloudinaryImageUpload from '../../config/imageUpload/cloudinary.js'; 
import asyncHandler from 'express-async-handler'; 
import BlogArticle from '../../models/blog/BlogArticle.js'; 
import BlogArticleLike from '../../models/blog/BlogArticleLike.js'; 


/**
 * Get Blog Article Likes
 */
const getBlogArticleLikes = asyncHandler(async (req, res) => {
    res.json({ message: 'Blog Article Likes' });
}); 

/**
 * Create Blog Article Like
 */
const createBlogArticleLike = asyncHandler(async (req, res) => {
    const { article } = req?.body; 

    // console.log(article); 
    const existingBlogArticleLike = await BlogArticleLike.findOne({ blog_article: article, 
                                                                    user: req?.user_id, 
                                                                    deleted_at: null }); 

    if (existingBlogArticleLike) {
        if (existingBlogArticleLike.deleted_at == '' || existingBlogArticleLike.deleted_at == null) {
            existingBlogArticleLike.deleted_at = new Date().toISOString();
            existingBlogArticleLike.deleted_by = req?.user_id;
        } 

        existingBlogArticleLike.save()
                                .then(() => {
                                    res.status(200).json({ success: `Blog Article Like deleted` });
                                })
                                .catch(error => {
                                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                                }); 
        // return res.status(200).json({ message: `Blog Article Like deleted` });
    } else if (!existingBlogArticleLike) {
        const blogArticleLike = new BlogArticleLike({
            user: req?.user_id, 
            blog_article: article, 
        }); 

        blogArticleLike.save()
                        .then(() => {
                            res.status(201).json({ success: `Blog Article Like ${blogArticleLike?._id} for Article ${article} created` });
                        })
                        .catch(error => {
                            return res.status(400).json({ message: "An error occured", details: `${error}` });
                        }); 
    }
}); 

/**
 * Get Blog Article Like
 */
const getBlogArticleLike = asyncHandler(async (req, res) => {
    const blogArticleLike = await BlogArticleLike.findOne({ _id: req?.params?.id, deleted_at: null })
                                        .populate({
                                            path: 'user',
                                            select: 'first_name last_name username'
                                        })
                                        .lean(); 

    if (!blogArticleLike) return res.status(404).json({ message: "Blog Article Like not found!" }); 

    res.json({ data: blogArticleLike }); 
}); 

/**
 * Soft-delete Blog Article Like
 */
const deleteBlogArticleLike = asyncHandler(async (req, res) => {
    const blogArticleLike = await BlogArticleLike.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!blogArticleLike) return res.status(404).json({ message: "Blog Article not found!" }); 

    if (blogArticleLike.deleted_at == '' || blogArticleLike.deleted_at == null) {
        blogArticleLike.deleted_at = new Date().toISOString();
        blogArticleLike.deleted_by = req?.user_id;
    }

    blogArticleLike.save()
                .then(() => {
                    res.json({ success: `Blog Article Like ${blogArticleLike?._id} deleted` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Restore soft-deleted Blog Article Like
 */
const restoreBlogArticleLike = asyncHandler(async (req, res) => {
    const blogArticleLike = await BlogArticleLike.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!blogArticleLike) return res.status(404).json({ message: "Blog Article not found!" }); 

    blogArticleLike.deleted_at = null;
    blogArticleLike.deleted_by = null;

    blogArticleLike.save()
                .then(() => {
                    res.json({ success: `Blog Article Like ${blogArticleLike?._id} restored` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Permanent-delete Blog Article Like
 */
const destroyBlogArticleLike = asyncHandler(async (req, res) => {
    const blogArticleLike = await BlogArticleLike.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!blogArticleLike) return res.status(404).json({ message: "Blog Article not found!" }); 

    blogArticleLike.deleteOne()
                .then(() => {
                    res.json({ success: `Blog Article Like ${blogArticleLike?._id} deleted permanently` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 


export { getBlogArticleLikes, 
        createBlogArticleLike, 
        getBlogArticleLike, 
        deleteBlogArticleLike, 
        restoreBlogArticleLike, 
        destroyBlogArticleLike };