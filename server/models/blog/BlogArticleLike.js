import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const blogArticleLikeSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        blog_article: { type: Schema.Types.ObjectId, ref: 'BlogArticle' }, 
        // blog_article_comment: { type: Schema.Types.ObjectId, ref: 'BlogArticleComment' }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let BlogArticleLike = mongoose.model('BlogArticleLike', blogArticleLikeSchema); 
export default BlogArticleLike; 