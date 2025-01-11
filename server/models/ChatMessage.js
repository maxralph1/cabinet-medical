import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const chatMessageSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        chat: { type: Schema.Types.ObjectId, ref: 'Chat' }, 
        content: { type: String }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let ChatMessage = mongoose.model('ChatMessage', chatMessageSchema); 
export default ChatMessage; 