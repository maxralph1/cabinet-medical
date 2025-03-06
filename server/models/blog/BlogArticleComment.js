import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const blogArticleCommentSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        blog_article: { type: Schema.Types.ObjectId, ref: 'BlogArticle' }, 
        content: { type: String }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let BlogArticleComment = mongoose.model('BlogArticleComment', blogArticleCommentSchema); 
export default BlogArticleComment; 
