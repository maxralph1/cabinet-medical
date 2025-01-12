import asyncHandler from 'express-async-handler'; 
import MedicalBill from '../models/MedicalBill.js'; 


/**
 * Get Medical Bills
 */ 
const getMedicalBills = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    let medicalBills; 
    if ((req?.user_role == 'admin') || (req?.user_role == 'superadmin')) {
        medicalBills = await MedicalBill.find({ deleted_at: null })
                                        .sort('-created_at')
                                        .skip(skip)
                                        .limit(limit)
                                        .lean(); 

        total = await MedicalBill.countDocuments({ deleted_at: null });
    } else if ((req?.user_role == 'doctor') || (req?.user_role == 'nurse')) {
        medicalBills = await MedicalBill.find({ authorizing_professional: req?.user_id, deleted_at: null })
                                        .sort('-created_at')
                                        .skip(skip)
                                        .limit(limit)
                                        .lean(); 

        total = await MedicalBill.countDocuments({ authorizing_professional: req?.user_id, deleted_at: null }); 
    } else {
        medicalBills = await MedicalBill.find({ patient: req?.user_id, deleted_at: null })
                                        .sort('-created_at')
                                        .skip(skip)
                                        .limit(limit)
                                        .lean(); 

        total = await MedicalBill.countDocuments({ patient: req?.user_id, deleted_at: null }); 
    }
    if (!medicalBills?.length) return res.status(404).json({ message: "No medicalBills found!" }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: medicalBills 
            });
}); 

/**
 * Create Medical Bill
 */
const createMedicalBill = asyncHandler(async (req, res) => {
    const { patient, authorizing_professional, purpose, notes, comments, amount } = req?.body; 

    const medicalBill = new MedicalBill({
        user: req?.user_id, 
        patient, 
        authorizing_professional: authorizing_professional ? authorizing_professional : req?.user_id, 
        purpose, 
        notes, 
        comments, 
        amount
    }); 

    medicalBill.save()
                .then(() => {
                    res.status(201).json({ success: `Medical Bill ${medicalBill?._id} created` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 

/**
 * Get Medical Bill
 */
const getMedicalBill = asyncHandler(async (req, res) => {
    const medicalBill = await MedicalBill.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!medicalBill) return res.status(404).json({ message: "Medical Bill not found!" }); 

    res.json({ data: medicalBill });
}); 

/**
 * Update Medical Bill
 */
const updateMedicalBill = asyncHandler(async (req, res) => {
    const medicalBill = await MedicalBill.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!medicalBill) return res.status(404).json({ message: "Medical Bill not found!" }); 

    medicalBill.patient = req?.body?.patient || medicalBill?.patient; 
    medicalBill.authorizing_professional = req?.body?.authorizing_professional || medicalBill?.authorizing_professional; 
    medicalBill.purpose = req?.body?.purpose || medicalBill?.purpose; 
    medicalBill.notes = req?.body?.notes || medicalBill?.notes; 
    medicalBill.comments = req?.body?.comments || medicalBill?.comments; 
    medicalBill.amount = req?.body?.amount || medicalBill?.amount; 
    medicalBill.fully_paid = req?.body?.fully_paid || medicalBill?.fully_paid; 
    medicalBill.fully_paid_on = req?.body?.fully_paid_on || medicalBill?.fully_paid_on; 

    medicalBill.save()
                .then(() => {
                    res.json({ success: `Medical Bill ${medicalBill?._id} updated` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Soft-delete Medical Bill
 */
const deleteMedicalBill = asyncHandler(async (req, res) => {
    const medicalBill = await MedicalBill.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!medicalBill) return res.status(404).json({ message: "Medical Bill not found!" }); 

    if (medicalBill.deleted_at == '' || medicalBill.deleted_at == null) {
        medicalBill.deleted_at = new Date().toISOString();
        medicalBill.deleted_by = req?.user_id;
    }

    medicalBill.save()
                .then(() => {
                    res.json({ success: `Medical Bill ${medicalBill?._id} deleted` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Restore soft-deleted Medical Bill
 */
const restoreMedicalBill = asyncHandler(async (req, res) => {
    const medicalBill = await MedicalBill.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!medicalBill) return res.status(404).json({ message: "Medical Bill not found!" }); 

    medicalBill.deleted_at = null;
    medicalBill.deleted_by = null;

    medicalBill.save()
                .then(() => {
                    res.json({ success: `Medical Bill ${medicalBill?._id} restored` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Permanent-delete an Medical Bill
 */
const destroyMedicalBill = asyncHandler(async (req, res) => {
    const medicalBill = await MedicalBill.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!medicalBill) return res.status(404).json({ message: "Medical Bill not found!" }); 

    medicalBill.deleteOne()
                .then(() => {
                    res.json({ success: `Medical Bill ${medicalBill?._id} deleted permanently` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 


export { getMedicalBills, 
        createMedicalBill, 
        getMedicalBill, 
        updateMedicalBill, 
        deleteMedicalBill, 
        restoreMedicalBill, 
        destroyMedicalBill }; 