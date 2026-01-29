import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const chatSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        active: { type: Boolean, default: false }, 
        pinned: { type: Boolean, default: false }, 
        topic: { type: String }, 
        description: { type: String }, 
        type: { 
            type: String, 
            enum: ['one-on-one', 'group'], 
            default: 'one-on-one'
        }, 
        locked: { 
            type: String, 
            enum: ['for-everyone', 'for-non-admins'], 
        }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let Chat = mongoose.model('Chat', chatSchema); 
export default Chat; 