import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const chatUserSchema = new Schema({
        chat: { type: Schema.Types.ObjectId, ref: 'Chat' }, 
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        invite_accepted: { type: Boolean, default: false }, 
        invite_accepted_date: { type: Date },
        leave_chat: { type: Boolean, default: false }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let ChatUser = mongoose.model('ChatUser', chatUserSchema); 
export default ChatUser; 