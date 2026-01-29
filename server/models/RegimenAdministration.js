import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const regimenAdministrationSchema = new Schema({
        authorizing_professional: { type: Schema.Types.ObjectId, ref: 'User' }, 
        patient: { type: Schema.Types.ObjectId, ref: 'User' }, 
        regimen: { type: Schema.Types.ObjectId, ref: 'Regimen' }, 
        proposed_administration_date_time: { type: Date }, 
        administered: { type: Boolean, default: false }, 
        administration_date_time: { type: Date }, 
        comment: { type: String }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let RegimenAdministration = mongoose.model('RegimenAdministration', regimenAdministrationSchema); 
export default RegimenAdministration; 