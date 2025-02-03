import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

<<<<<<<< HEAD:server/models/blog/BlogComment.js
const blogCommentSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        blog_article: { type: Schema.Types.ObjectId, ref: 'BlogArticle' }, 
        content: { type: String }, 
========
const blogCategorySchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        name: { type: String }, 
        description: { type: String }, 
>>>>>>>> 343b6d2dd910b4843d9f81e632cfe4014aafa064:server/models/blog/BlogCategory.js
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


<<<<<<<< HEAD:server/models/blog/BlogComment.js
let BlogComment = mongoose.model('BlogComment', blogCommentSchema); 
export default BlogComment; 
========
let BlogCategory = mongoose.model('BlogCategory', blogCategorySchema); 
export default BlogCategory; 
>>>>>>>> 343b6d2dd910b4843d9f81e632cfe4014aafa064:server/models/blog/BlogCategory.js
