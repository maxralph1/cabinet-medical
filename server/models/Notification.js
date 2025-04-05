import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

const notificationSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' }, 
        chat_message: { type: Schema.Types.ObjectId, ref: 'ChatMessage' }, 
        diagnosis_segment: { type: Schema.Types.ObjectId, ref: 'DiagnosisSegment' }, 
        inventory_invoice: { type: Schema.Types.ObjectId, ref: 'InventoryInvoice' }, 
        medical_bill: { type: Schema.Types.ObjectId, ref: 'MedicalBill' }, 
        regimen: { type: Schema.Types.ObjectId, ref: 'Regimen' }, 
        read: { type: Boolean, default: false }, 
        read_at: { type: String, default: null },
        type: { 
            type: String, 
            required: true, 
            enum: ['appointment-new', 'appointment-approved', 'appointment-declined', 'appiontment-cancel', 'appointment-modified', 'appointment-reminder', 'chat-message', 'diagnosis-result', 'invoice-new', 'invoice-payment', 'medical-bill-new', 'medical-bill-payment', 'regimen'], 
        }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let Notification = mongoose.model("Notification", notificationSchema);
export default Notification; 