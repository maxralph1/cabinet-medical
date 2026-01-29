import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        appointment_request: { type: Schema.Types.ObjectId, ref: 'AppointmentRequest' }, 
        patient: { type: Schema.Types.ObjectId, ref: 'User' }, 
        professional: { type: Schema.Types.ObjectId, ref: 'User' }, 
        purpose: { type: String }, 
        notes: { type: String }, 
        proposed_schedule_date: { type: String, required: true }, 
        proposed_schedule_start: { type: Date, required: true }, 
        // proposed_year_start: { type: String, required: true }, 
        // proposed_month_start: { type: String, required: true }, 
        // proposed_date_start: { type: String, required: true }, 
        // proposed_time_start: { type: String, required: true }, 
        proposed_schedule_end: { type: Date, required: true }, 
        // proposed_year_end: { type: String, required: true }, 
        // proposed_month_end: { type: String, required: true }, 
        // proposed_date_end: { type: String, required: true }, 
        // proposed_time_end: { type: String, required: true }, 
        schedule_start: { type: String }, 
        // year_start: { type: String }, 
        // month_start: { type: String }, 
        // date_start: { type: String }, 
        // time_start: { type: String }, 
        schedule_end: { type: String }, 
        // year_end: { type: String }, 
        // month_end: { type: String }, 
        // date_end: { type: String }, 
        // time_end: { type: String }, 
        status: {
            type: String, 
            required: true, 
            enum: ['pending-approval', 'declined-approval', 'approved', 'ongoing', 'took-place', 'cancelled'], 
            default: 'pending-approval'
        }, 
        type: {
            type: String, 
            required: true, 
            enum: ['internal', 'external'], 
            default: 'internal'
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