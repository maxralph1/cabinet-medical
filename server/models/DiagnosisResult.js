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
<<<<<<< HEAD
        // result: { Number },
        notes: { type: String },
=======
        result: { Number },
        comment: { type: String }
>>>>>>> 2167b0382c47c97bb177e6f3f0eb7b59d6b73cae
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let DiagnosisResult = mongoose.model('DiagnosisResult', diagnosisResultSchema); 
export default DiagnosisResult; 