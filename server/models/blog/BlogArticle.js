import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const blogArticleSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        // blog_category: { type: Schema.Types.ObjectId, ref: 'BlogCategory' }, 
        title: { type: String }, 
        content: { type: String }, 
        featured: { type: Boolean, default: false }, 
        must_read: { type: Boolean, default: false }, 
        image_path: { 
            public_id: { type: String, default: '' },
            url: { type: String, default: '' }
        }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let BlogArticle = mongoose.model('BlogArticle', blogArticleSchema); 
export default BlogArticle; 