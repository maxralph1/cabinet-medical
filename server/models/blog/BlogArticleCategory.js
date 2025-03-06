import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const blogArticleCategorySchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        blog_article: { type: Schema.Types.ObjectId, ref: 'BlogArticle' }, 
        blog_category: { type: Schema.Types.ObjectId, ref: 'BlogCategory' }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let BlogArticleCategory = mongoose.model('BlogArticleCategory', blogArticleCategorySchema); 
export default BlogArticleCategory; 