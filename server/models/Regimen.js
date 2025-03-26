import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const regimenSchema = new Schema({
        patient: { type: Schema.Types.ObjectId, ref: 'User' }, 
        authorizing_professional: { type: Schema.Types.ObjectId, ref: 'User' }, 
        appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' }, 
        diagnosis: { type: Schema.Types.ObjectId, ref: 'Diagnosis' }, 
        inventory: { type: Schema.Types.ObjectId, ref: 'Inventory' }, 
        notes: { type: String }, 
        comments: { type: String }, 
        status: {
            type: String, 
            required: true, 
            enum: ['pending', 'ongoing', 'completed', 'cancelled'], 
            default: 'pending'
        }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let Regimen = mongoose.model('Regimen', regimenSchema); 
export default Regimen; 