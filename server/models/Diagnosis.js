import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const diagnosisSchema = new Schema({
        patient: { type: Schema.Types.ObjectId, ref: 'User' }, 
<<<<<<< HEAD
        professional: { type: Schema.Types.ObjectId, ref: 'User' }, 
        notes: { type: String }, 
=======
        examiner: { type: Schema.Types.ObjectId, ref: 'User' }, 
>>>>>>> 2167b0382c47c97bb177e6f3f0eb7b59d6b73cae
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let Diagnosis = mongoose.model('Diagnosis', diagnosisSchema); 
export default Diagnosis; 