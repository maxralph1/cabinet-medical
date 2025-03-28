import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const chatUserSchema = new Schema({
        chat: { type: Schema.Types.ObjectId, ref: 'Chat' }, 
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        active: { type: Boolean, default: false }, 
        role: { 
            type: String, 
            enum: ['admin', 'participant'], 
        }, 
        join_mode: { 
            type: String, 
            enum: ['invite-link', 'added'], 
        }, 
        joined_on: { type: Date },
        invite_accepted: { type: Boolean }, 
        invite_accepted_date: { type: Date },
        removed_on: { type: Date },
        removed_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
        receive_notifications: { type: Boolean, default: true }, 
        leave_chat: { type: Boolean, default: false }, 
        left_chat_on: { type: Date },
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let ChatUser = mongoose.model('ChatUser', chatUserSchema); 
export default ChatUser; 