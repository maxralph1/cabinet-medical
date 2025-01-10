import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const diagnosisSchema = new Schema({
        patient: { type: Schema.Types.ObjectId, ref: 'User' }, 
        examiner: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let Diagnosis = mongoose.model('Diagnosis', diagnosisSchema); 
export default Diagnosis; 