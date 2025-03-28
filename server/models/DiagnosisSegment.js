import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const diagnosisSegmentSchema = new Schema({
        // user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        patient: { type: Schema.Types.ObjectId, ref: 'User' }, 
        authorizing_professional: { type: Schema.Types.ObjectId, ref: 'User' }, 
        diagnosis: { type: Schema.Types.ObjectId, ref: 'Diagnosis' }, 
        diagnosis_type: { type: Schema.Types.ObjectId, ref: 'DiagnosisType' }, 
        result: { type: String, default: '' },  
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let DiagnosisSegment = mongoose.model('DiagnosisSegment', diagnosisSegmentSchema); 
export default DiagnosisSegment; 