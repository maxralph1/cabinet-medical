import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const inventoryProductUnitSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        inventory_product: { type: Schema.Types.ObjectId, ref: 'InventoryProduct' }, 
        issued_to: { type: Schema.Types.ObjectId, ref: 'User' }, 
        disbursed: { type: Boolean, default: false }, 
        disbursed_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
        disbursed_on: { type: Date }, 
        image_path: { 
            public_id: { type: String, default: '' }, 
            url: { type: String, default: '' }
        }, 
        description: { type: String }, 
        amount_purchased: { type: Number }, 
        manufacture_date: { type: Date }, 
        expiration_date: { type: Date }, 
        purchase_date: { type: Date }, 
        make_country: { type: String }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let InventoryProductUnit = mongoose.model('InventoryProductUnit', inventoryProductUnitSchema); 
export default InventoryProductUnit; 