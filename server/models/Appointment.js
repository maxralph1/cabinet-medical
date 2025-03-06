import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        patient: { type: Schema.Types.ObjectId, ref: 'User' }, 
        professional: { type: Schema.Types.ObjectId, ref: 'User' }, 
        purpose: { type: String }, 
        notes: { type: String }, 
        proposed_year_start: { type: String, required: true }, 
        proposed_month_start: { type: String, required: true }, 
        proposed_date_start: { type: String, required: true }, 
        proposed_time_start: { type: String, required: true }, 
        proposed_year_end: { type: String, required: true }, 
        proposed_month_end: { type: String, required: true }, 
        proposed_date_end: { type: String, required: true }, 
        proposed_time_end: { type: String, required: true }, 
        year_start: { type: String,  }, 
        month_start: { type: String,  }, 
        date_start: { type: String }, 
        time_start: { type: String }, 
        year_end: { type: String,  }, 
        month_end: { type: String,  }, 
        date_end: { type: String }, 
        time_end: { type: String }, 
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