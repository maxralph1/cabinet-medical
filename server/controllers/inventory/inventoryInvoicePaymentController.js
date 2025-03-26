import axios from 'axios'; 
import asyncHandler from 'express-async-handler'; 
import { createOrder, 
        captureOrder, 
        authorizeOrder, 
        captureAuthorize 
} from '../../utils/paypal-api.js'; 
// import orderPlacedNoticationMailTemplate from '../../mails/templates/orderNotificationMail.js'; 
import InventoryInvoice from '../../models/inventory/InventoryInvoice.js';
import InventoryProductInvoice from '../../models/inventory/inventoryProductInvoice.js';
import InventoryProductUnit from '../../models/inventory/InventoryProductUnit.js';
import Notification from '../../models/Notification.js';


/**
 * Find inventory invoice (and pay)
 */
const createInvoicePayment = async (req, res) => {
    try {
        const { invoice } = req?.body; 

        const foundInvoice = await InventoryInvoice.findById(invoice); 
        if (!foundInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }; 

        let totalPayable;

        const itemsAssociatedWithInvoice = await InventoryProductInvoice.find({ inventory_invoice: invoice })
                                                                        .populate({
                                                                            path: 'inventory_product_unit',
                                                                            populate: {
                                                                                path: 'inventory_product', 
                                                                            }
                                                                        })
                                                                        .lean(); 

        console.log('associated items:', itemsAssociatedWithInvoice);
        if (!itemsAssociatedWithInvoice) {
            return res.status(404).json({ message: 'No items associated with invoice' }); 
        }; 

        totalPayable = (itemsAssociatedWithInvoice?.reduce((total, item) => {
            return total + Number(item?.inventory_product_unit?.amount_purchased || 0);
        }, 0))?.toFixed(2); 

        console.log('Payable:', totalPayable); 

        const { jsonResponse, httpStatusCode } = await createOrder(totalPayable); 

        const updateProductsPaymentStatusResolve = itemsAssociatedWithInvoice?.map( async(item, index) => {
            try {
                const productUnitFilter = { _id: item?.inventory_product_unit?._id }; 
                const productUnitUpdate = { payment_status: 'paid', inventory_invoice: foundInvoice?._id }; 

                const updatedProductUnit = await InventoryProductUnit.findOneAndUpdate(productUnitFilter, productUnitUpdate, {
                    new: true,  
                }) 
                if (!updatedProductUnit) return res.status(404).json({ message: 'Product Unit not found' });
                console.log('updated product unit', updatedProductUnit); 
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
        }); 
        // updateProductsPaymentStatusResolve(); 
        await Promise.all(updateProductsPaymentStatusResolve); 

        const invoiceFilter = { _id: foundInvoice?._id }; 
        const invoiceUpdate = { paypal_order_id: jsonResponse?.id,  
                                total_paid: totalPayable }; 

        const updatedInvoice = await InventoryInvoice.findOneAndUpdate(invoiceFilter, invoiceUpdate, {
            new: true,  
        }) 
        if (!updatedInvoice) return res.status(404).json({ message: 'Invoice not found' });
        console.log('updated invoice', updatedInvoice); 

        const notification = await Notification.create({
            user: foundInvoice?.patient, 
            inventory_invoice: foundInvoice?._id, 
            read: false,
            type: 'invoice-payment',
        });

        res.status(httpStatusCode).json(jsonResponse); 
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}; 

/**
 * Capture invoice (and complete payment process)
 */
const captureInvoicePayment = async (req, res) => {
    try {
        const { orderID } = req?.params; 
        // const capture = await captureOrder(orderID); 
        // return res.status(200).json({ message: 'Payment captured successfully', data: capture }); 

        const { jsonResponse, httpStatusCode } = await captureOrder(orderID); 
        console.log('status', httpStatusCode); 
        console.log('json', jsonResponse); 

        const invoiceFilter = { paypal_order_id: orderID }; 
        // const orderUpdate = { paid: true }; 
        const invoiceUpdate = { payment_status: (jsonResponse?.payment_source?.paypal) 
                                                ? 'paid-with-paypal' 
                                                    : (jsonResponse?.payment_source?.card) 
                                                    ? 'paid' 
                                                        : 'unpaid', 
                                payment_mode: (jsonResponse?.payment_source?.paypal) 
                                                ? 'paypal' 
                                                    : (jsonResponse?.payment_source?.card) 
                                                    ? 'card' 
                                                        : 'cash', 
                                paypal_payer_id: (jsonResponse?.payment_source?.paypal?.account_id || null),
                                paid: true, 
                                paid_at: new Date().toISOString() }; 

        await InventoryInvoice.findOneAndUpdate(invoiceFilter, invoiceUpdate, {
            new: true
        }); 

        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }; 
}; 

/**
 * Authorize Invoice
 */
const authorizeInvoicePayment = async (req, res) => {
    try {
        const { orderID } = req.params;
        const { jsonResponse, httpStatusCode } = await authorizeOrder(orderID);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to authorize order." });
    }
}

/**
 * Capture Authorized Invoice
 */
const captureAuthorisedInvoicePayment = async (req, res) => {
    try {
        const { authorizationId } = req.params;
        const { jsonResponse, httpStatusCode } = await captureAuthorize(
            authorizationId
        );
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to capture authorize." });
    }
}


export { createInvoicePayment, 
        captureInvoicePayment, 
        authorizeInvoicePayment, 
        captureAuthorisedInvoicePayment }