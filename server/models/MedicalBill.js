import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const medicalBillSchema = new Schema({
        patient: { type: Schema.Types.ObjectId, ref: 'User' }, 
        authorizing_professional: { type: Schema.Types.ObjectId, ref: 'User' }, 
        appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' }, 
        diagnosis: { type: Schema.Types.ObjectId, ref: 'Diagnosis' }, 
        // regimen: { type: Schema.Types.ObjectId, ref: 'Regimen' }, 
        purpose: { type: String }, 
        notes: { type: String }, 
        comments: { type: String }, 
        amount: { type: Number }, 
        fully_paid: { type: Boolean, default: false }, 
        fully_paid_on: { type: String }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let MedicalBill = mongoose.model('MedicalBill', medicalBillSchema); 
export default MedicalBill; 