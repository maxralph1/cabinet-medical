import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const patientChartSchema = new Schema({
        patient: { type: Schema.Types.ObjectId, ref: 'User' }, 
        professional: { type: Schema.Types.ObjectId, ref: 'User' }, 
        notes: { type: String }, 
        comments: { type: String }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let PatientChart = mongoose.model('PatientChart', patientChartSchema); 
export default PatientChart; 