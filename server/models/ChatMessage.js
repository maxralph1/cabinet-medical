import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const chatMessageSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        chat: { type: Schema.Types.ObjectId, ref: 'Chat' }, 
        content: { type: String }, 
        read: { type: Boolean, default: false }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let ChatMessage = mongoose.model('ChatMessage', chatMessageSchema); 
export default ChatMessage; 