import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const blogLikeSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        blog_article: { type: Schema.Types.ObjectId, ref: 'BlogArticle' }, 
        blog_comment: { type: Schema.Types.ObjectId, ref: 'BlogComment' }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let BlogLike = mongoose.model('BlogLike', blogLikeSchema); 
export default BlogLike; 