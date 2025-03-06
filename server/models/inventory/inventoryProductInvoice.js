import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const inventoryProductInvoiceSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        inventory_product_unit: { type: Schema.Types.ObjectId, ref: 'InventoryProductUnit' }, 
        inventory_invoice: { type: Schema.Types.ObjectId, ref: 'InventoryInvoice' }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let InventoryProductInvoice = mongoose.model('InventoryProductInvoice', inventoryProductInvoiceSchema); 
export default InventoryProductInvoice; 