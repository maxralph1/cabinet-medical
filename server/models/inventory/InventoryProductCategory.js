import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const inventoryProductCategorySchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        inventory_product: { type: Schema.Types.ObjectId, ref: 'InventoryProduct' }, 
        inventory_category: { type: Schema.Types.ObjectId, ref: 'InventoryCategory' }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let InventoryProductCategory = mongoose.model('InventoryProductCategory', inventoryProductCategorySchema); 
export default InventoryProductCategory; 