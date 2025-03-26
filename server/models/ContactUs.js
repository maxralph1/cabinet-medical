import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const contactUsSchema = new Schema({
        // user: {
        patient_first_name: { type: String }, 
        patient_last_name: { type: String }, 
        // },
        patient_email: { 
            type: String,
            required: [true, 'Email address is required'], 
            validate: {
                validator: function(email) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(email);
                },
                message: props => `${props.value} is not a valid email address!`
            }
        }, 
        patient_phone: { 
            type: String, 
            validate: {
                validator: function(phone) {
                    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
                    return phoneRegex.test(phone);
                }, 
                message: props => `${props.value} is not a valid phone number.`
            }   
        }, 
        subject: { type: String }, 
        comments: { type: String }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let ContactUs = mongoose.model('ContactUs', contactUsSchema); 
export default ContactUs; 