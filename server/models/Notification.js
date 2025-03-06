import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

const notificationSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        read: { type: Boolean, default: false }, 
        read_at: { type: String, default: null },
        type: { 
            type: String, 
            required: true, 
            enum: ['appointment', 'message', 'payment', 'regimen-administration'], 
        }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let Notification = mongoose.model("Notification", notificationSchema);
export default Notification; 