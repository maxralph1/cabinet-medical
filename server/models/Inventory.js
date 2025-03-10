import { name } from 'ejs';
import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const inventorySchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        issued_to: { type: Schema.Types.ObjectId, ref: 'User' }, 
        disbursed: { type: Boolean, default: false }, 
        disbursed_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
        disbursed_on: { type: Date }, 
        notes: { type: String }, 
        image_path: { 
            public_id: { type: String, default: '' }, 
            url: { type: String, default: '' }
        }, 
        product_type: { type: String }, 
        product_code: { type: String }, 
        product_name: { type: String }, 
        product_description: { type: String }, 
        amount_purchased: { type: String }, 
        manufacturer: { type: String }, 
        make_country: { type: String }, 
        manufacture_date: { type: Date }, 
        expiration_date: { type: Date }, 
        purchase_date: { type: Date }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let Inventory = mongoose.model('Inventory', inventorySchema); 
export default Inventory; 