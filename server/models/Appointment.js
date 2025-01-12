import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        patient: { type: Schema.Types.ObjectId, ref: 'User' }, 
        professional: { type: Schema.Types.ObjectId, ref: 'User' }, 
        notes: { type: String }, 
        proposed_date_start: { type: Date, required: true }, 
        proposed_time_start: { type: String, required: true }, 
        proposed_date_end: { type: Date, required: true }, 
        proposed_time_end: { type: String, required: true }, 
        date_start: { type: Date, required: true }, 
        time_start: { type: String, required: true }, 
        date_end: { type: Date, required: true }, 
        time_end: { type: String, required: true }, 
        status: {
            type: String, 
            required: true, 
            enum: ['pending', 'on-going', 'took-place', 'cancelled'], 
            default: 'pending'
        }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let Appointment = mongoose.model('Appointment', appointmentSchema); 
export default Appointment; 