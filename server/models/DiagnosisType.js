import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const diagnosisTypeSchema = new Schema({
        patient: { type: Schema.Types.ObjectId, ref: 'User' }, 
        title: { type: String }, 
        description: { type: String }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let DiagnosisType = mongoose.model('DiagnosisType', diagnosisTypeSchema); 
export default DiagnosisType; 