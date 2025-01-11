import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const blogPostSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        topic: { type: String }, 
        content: { type: String }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let BlogPost = mongoose.model('BlogPost', blogPostSchema); 
export default BlogPost; 