import asyncHandler from 'express-async-handler'; 
import ContactUs from '../models/ContactUs.js';


/**
 * Get Contact Us Requests
 */
const getContactUsRecords = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    // console.log(req?.query); 
    // console.log(req?.user_role); 

    const contactUsRecords = await ContactUs.find({ deleted_at: null })
                                            .sort({ created_at: -1 })
                                            .skip(skip)
                                            .limit(limit)
                                            .lean(); 

    const total = await ContactUs.countDocuments({ deleted_at: null }); 
    
    if (!contactUsRecords?.length) return res.status(404).json({ message: "No contact us requests found!" }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: contactUsRecords 
            });
}); 

/**
 * Create Contact Us Request
 */
const createContactUs = asyncHandler(async (req, res) => {
    const { first_name, last_name, phone, email, 
            subject, 
            proposed_schedule_date_time, 
            comments } = req?.body; 

    const contactUs = new ContactUs({
        patient_first_name: first_name, 
        patient_last_name: last_name, 
        patient_phone: phone, 
        patient_email: email, 
        subject,
        comments,
        proposed_schedule_date_time,
    }); 

    contactUs.save()
            .then(() => {
                res.status(201).json({ success: `Contact Us Request ${contactUs?._id} created` });
            })
            .catch(error => {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            });
}); 

/**
 * Get Contact Us Request
 */
const getContactUs = asyncHandler(async (req, res) => {
    const contactUs = await ContactUs.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!contactUs) return res.status(404).json({ message: "ContactUs not found!" }); 

    res.json({ data: contactUs });
}); 

/**
 * Update Contact Us Request
 */
const updateContactUs = asyncHandler(async (req, res) => {
    const contactUs = await ContactUs.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!contactUs) return res.status(404).json({ message: "Contact Us Request not found!" }); 

    contactUs.user.patient_first_name = req?.body?.patient_first_name || contactUs?.user?.patient_first_name; 
    contactUs.user.patient_last_name = req?.body?.patient_last_name || contactUs?.user?.patient_last_name; 
    contactUs.user.patient_phone = req?.body?.patient_phone || contactUs?.user?.patient_phone; 
    contactUs.user.patient_email = req?.body?.patient_email || contactUs?.user?.patient_email; 
    contactUs.subject = req?.body?.subject || contactUs?.subject; 
    contactUs.comments = req?.body?.comments || contactUs?.comments; 

    contactUs.save()
            .then(() => {
                res.json({ success: `Contact Us Request ${contactUs?._id} updated` });
            })
            .catch(error => {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            }); 
}); 

/**
 * Soft-delete Contact Us Request
 */
const deleteContactUs = asyncHandler(async (req, res) => {
    const contactUs = await ContactUs.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!contactUs) return res.status(404).json({ message: "Contact Us Request not found!" }); 

    if (contactUs.deleted_at == '' || contactUs.deleted_at == null) {
        contactUs.deleted_at = new Date().toISOString();
        contactUs.deleted_by = req?.user_id;
    }

    contactUs.save()
            .then(() => {
                res.json({ success: `Contact Us Request ${contactUs?._id} deleted` });
            })
            .catch(error => {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            }); 
}); 

/**
 * Restore soft-deleted Contact Us Request
 */
const restoreContactUs = asyncHandler(async (req, res) => {
    const contactUs = await ContactUs.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!contactUs) return res.status(404).json({ message: "ContactUs not found!" }); 

    contactUs.deleted_at = null;
    contactUs.deleted_by = null;

    contactUs.save()
            .then(() => {
                res.json({ success: `Contact Us Request ${contactUs?._id} restored` });
            })
            .catch(error => {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            }); 
}); 

/**
 * Permanent-delete an Contact Us Request
 */
const destroyContactUs = asyncHandler(async (req, res) => {
    const contactUs = await ContactUs.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!contactUs) return res.status(404).json({ message: "ContactUs not found!" }); 

    contactUs.deleteOne()
            .then(() => {
                res.json({ success: `Contact Us Request ${contactUs?._id} deleted permanently` });
            })
            .catch(error => {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            });
}); 


export { getContactUsRecords, 
        createContactUs, 
        getContactUs, 
        updateContactUs, 
        deleteContactUs, 
        restoreContactUs, 
        destroyContactUs }; 