import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const chatSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        pinned: { type: Boolean, default: false }, 
        pinned_message: { type: Schema.Types.ObjectId, ref: 'Message' }, 
        topic: { type: String }, 
        description: { type: String }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let Chat = mongoose.model('Chat', chatSchema); 
export default Chat; 