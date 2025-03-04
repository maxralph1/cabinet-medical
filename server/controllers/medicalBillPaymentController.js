import axios from 'axios'; 
import asyncHandler from 'express-async-handler'; 
import { createOrder, 
        captureOrder, 
        authorizeOrder, 
        captureAuthorize 
} from '../utils/paypal-api.js'; 
// import orderPlacedNoticationMailTemplate from '../mails/templates/orderNotificationMail.js'; 
import MedicalBill from '../models/MedicalBill.js'; 


/**
 * Find  medicalBill (and pay)
 */
const createMedicalBillPayment = async (req, res) => {
    try {
        const { medicalBill } = req?.body; 

        const foundMedicalBill = await InventoryMedicalBill.findById(medicalBill); 
        if (!foundMedicalBill) {
            return res.status(404).json({ message: 'MedicalBill not found' });
        }; 

        let totalPayable;

        const itemsAssociatedWithMedicalBill = await InventoryProductMedicalBill.find({ inventory_medicalBill: medicalBill })
                                                                        .populate({
                                                                            path: 'inventory_product_unit',
                                                                            populate: {
                                                                                path: 'inventory_product', 
                                                                            }
                                                                        })
                                                                        .lean(); 

        console.log('associated items:', itemsAssociatedWithMedicalBill);
        if (!itemsAssociatedWithMedicalBill) {
            return res.status(404).json({ message: 'No items associated with medicalBill' }); 
        }; 

        totalPayable = (itemsAssociatedWithMedicalBill?.reduce((total, item) => {
            return total + Number(item?.inventory_product_unit?.amount_purchased || 0);
        }, 0))?.toFixed(2); 

        console.log('Payable:', totalPayable); 

        const { jsonResponse, httpStatusCode } = await createOrder(totalPayable); 

        const updateProductsPaymentStatusResolve = itemsAssociatedWithMedicalBill?.map( async(item, index) => {
            try {
                const productUnitFilter = { _id: item?.inventory_product_unit?._id }; 
                const productUnitUpdate = { payment_status: 'paid', inventory_medicalBill: foundMedicalBill?._id }; 

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

        const medicalBillFilter = { _id: foundMedicalBill?._id }; 
        const medicalBillUpdate = { paypal_order_id: jsonResponse?.id,  
                                total_paid: totalPayable }; 

        const updatedMedicalBill = await InventoryMedicalBill.findOneAndUpdate(medicalBillFilter, medicalBillUpdate, {
            new: true,  
        }) 
        if (!updatedMedicalBill) return res.status(404).json({ message: 'MedicalBill not found' });
        console.log('updated medicalBill', updatedMedicalBill); 

        res.status(httpStatusCode).json(jsonResponse); 
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}; 

/**
 * Capture medicalBill (and complete payment process)
 */
const captureMedicalBillPayment = async (req, res) => {
    try {
        const { orderID } = req?.params; 
        // const capture = await captureOrder(orderID); 
        // return res.status(200).json({ message: 'Payment captured successfully', data: capture }); 

        const { jsonResponse, httpStatusCode } = await captureOrder(orderID); 
        console.log('status', httpStatusCode); 
        console.log('json', jsonResponse); 

        const medicalBillFilter = { paypal_order_id: orderID }; 
        // const orderUpdate = { paid: true }; 
        const medicalBillUpdate = { payment_status: (jsonResponse?.payment_source?.paypal) 
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

        await InventoryMedicalBill.findOneAndUpdate(medicalBillFilter, medicalBillUpdate, {
            new: true
        }); 

        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }; 
}; 

/**
 * Authorize MedicalBill
 */
const authorizeMedicalBillPayment = async (req, res) => {
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
 * Capture Authorized MedicalBill
 */
const captureAuthorisedMedicalBillPayment = async (req, res) => {
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


export { createMedicalBillPayment, 
        captureMedicalBillPayment, 
        authorizeMedicalBillPayment, 
        captureAuthorisedMedicalBillPayment }