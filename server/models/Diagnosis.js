import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const diagnosisSchema = new Schema({
        patient: { type: Schema.Types.ObjectId, ref: 'User' }, 
        authorizing_professional: { type: Schema.Types.ObjectId, ref: 'User' }, 
        examiner: { type: Schema.Types.ObjectId, ref: 'User' }, 
        notes: { type: String }, 
        comments: { type: String }, 
        retrieved_by_patient: { type: Boolean, default: false }, 
        retrieved_on: { type: String }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let Diagnosis = mongoose.model('Diagnosis', diagnosisSchema); 
export default Diagnosis; 