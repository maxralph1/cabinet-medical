import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const inventoryProductUnitSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        disbursed_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
        issued_to: { type: Schema.Types.ObjectId, ref: 'User' }, 
        inventory_product: { type: Schema.Types.ObjectId, ref: 'InventoryProduct' }, 
        inventory_invoice: { type: Schema.Types.ObjectId, ref: 'InventoryInvoice' }, 
        product_number: { type: String }, 
        disbursed: { type: Boolean, default: false }, 
        disbursed_on: { type: Date }, 
        amount_purchased: { type: Number }, 
        amount_sold: { type: Number }, 
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


let InventoryProductUnit = mongoose.model('InventoryProductUnit', inventoryProductUnitSchema); 
export default InventoryProductUnit; 