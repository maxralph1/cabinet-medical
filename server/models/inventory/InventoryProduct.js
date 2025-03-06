import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const inventoryProductSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        name: { type: String }, 
        description: { type: String }, 
        notes: { type: String }, 
        image_path: { 
            public_id: { type: String, default: '' }, 
            url: { type: String, default: '' }
        }, 
        amount_purchased: { type: String }, 
        manufacturer: { type: String }, 
        make_country: { type: String }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let InventoryProduct = mongoose.model('InventoryProduct', inventoryProductSchema); 
export default InventoryProduct; 