import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const diagnosisResultSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        medical_examination: { type: Schema.Types.ObjectId, ref: 'Diagnosis' }, 
        type: {
            type: String, 
            required: true, 
            enum: ['blood-cell', 'heart-rate', 'sugar-level', 'water-level'], 
            default: 'blood-cell'
        }, 
        result: { String },
        result: { Number },
        comment: { type: String }
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let DiagnosisResult = mongoose.model('DiagnosisResult', diagnosisResultSchema); 
export default DiagnosisResult; 