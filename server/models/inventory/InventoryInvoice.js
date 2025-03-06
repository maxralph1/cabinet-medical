import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const inventoryInvoiceSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        patient: { type: Schema.Types.ObjectId, ref: 'User' }, 
        notes: { type: String }, 
        payment_status: { 
            type: String, 
            required: true, 
            enum: ['paid', 'payment-in-progress', 'paid-with-paypal', 'unpaid'], 
            default: 'unpaid' 
        }, 
        payment_mode: { 
            type: String, 
            required: true, 
            enum: ['card', 'cash', 'paypal'], 
            default: 'card' 
        }, 
        total_paid: { type: String }, 
        paypal_order_id: { type: String }, 
        paypal_payer_id: { type: String }, 
        paid_at: { type: String }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let InventoryInvoice = mongoose.model('InventoryInvoice', inventoryInvoiceSchema); 
export default InventoryInvoice; 