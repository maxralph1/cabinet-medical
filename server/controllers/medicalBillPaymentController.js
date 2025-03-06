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

        const foundMedicalBill = await MedicalBill.findById(medicalBill); 
        if (!foundMedicalBill) {
            return res.status(404).json({ message: 'Medical Bill not found' });
        }; 

        const totalPayable = foundMedicalBill?.amount; 

        console.log('Payable:', totalPayable); 

        const { jsonResponse, httpStatusCode } = await createOrder(totalPayable); 

        const medicalBillFilter = { _id: foundMedicalBill?._id }; 
        const medicalBillUpdate = { paypal_order_id: jsonResponse?.id,  
                                    total_paid: totalPayable }; 

        const updatedMedicalBill = await MedicalBill.findOneAndUpdate(medicalBillFilter, medicalBillUpdate, {
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
                                fully_paid: true, 
                                fully_paid_on: new Date().toISOString() }; 

        await MedicalBill.findOneAndUpdate(medicalBillFilter, medicalBillUpdate, {
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