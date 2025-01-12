import asyncHandler from 'express-async-handler'; 
import Diagnosis from '../models/Diagnosis.js'; 
import DiagnosisSegment from '../models/DiagnosisSegment.js';


/**
 * Get Diagnoses
 */
const getDiagnoses = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    let diagnoses, total; 
    if ((req?.user_role == 'admin') || (req?.user_role == 'superadmin')) {
        diagnoses = await Diagnosis.find({ deleted_at: null })
                                    .sort('-created_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .lean(); 

        total = await Diagnosis.countDocuments({ deleted_at: null }); 
    } else if ((req?.user_role == 'doctor') || (req?.user_role == 'nurse')) {
        diagnoses = await Diagnosis.find({ $or: [{ authorizing_professional: req?.user_id }, { examiner: req?.user_id }], deleted_at: null })
                                    .sort('-created_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .lean(); 

        total = await Diagnosis.countDocuments({ $or: [{ authorizing_professional: req?.user_id }, { examiner: req?.user_id }], deleted_at: null }); 
    } else {
        diagnoses = await Diagnosis.find({ patient: req?.user_id, deleted_at: null })
                                    .sort('-created_at')
                                    .skip(skip)
                                    .limit(limit)
                                    .lean(); 

        total = await Diagnosis.countDocuments({ patient: req?.user_id, deleted_at: null }); 
    }
    if (!diagnoses?.length) return res.status(404).json({ message: "No diagnosis found!" }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: diagnoses 
            });
}); 

/**
 * Create Diagnosis
 */
const createDiagnosis = asyncHandler(async (req, res) => {
    const { patient, notes, comments, examiner, 
            diagnosis_type_1, 
            diagnosis_type_2, 
            diagnosis_type_3, 
            diagnosis_type_4, 
            diagnosis_type_5, 
            diagnosis_type_6, 
            diagnosis_type_7 } = req?.body; 

    const diagnosis = new Diagnosis({
        patient, 
        authorizing_professional: req?.user_id, 
        notes, 
        comments, 
        examiner
    }); 

    const diagnosis_types = [
        diagnosis_type_1, 
        diagnosis_type_2, 
        diagnosis_type_3, 
        diagnosis_type_4, 
        diagnosis_type_5, 
        diagnosis_type_6, 
        diagnosis_type_7, 
    ]; 

    const valid_diagnosis_types = diagnosis_types.filter(diagnosis_type => diagnosis_type != null);

    for (let i = 0; i < valid_diagnosis_types.length; i++) {
        const diagnosis_type = valid_diagnosis_types[i];

        await DiagnosisSegment.create({
            user: req?.user_id,
            diagnosis: diagnosis._id, 
            diagnosis_type: diagnosis_type, 
        });
    }

    diagnosis.save()
                .then(() => {
                    res.status(201).json({ success: `Diagnosis ${diagnosis?._id} created` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 

/**
 * Get Diagnosis 
 */ 
const getDiagnosis = asyncHandler(async (req, res) => {
    const diagnosis = await Diagnosis.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!diagnosis) return res.status(404).json({ message: "Diagnosis not found!" }); 

    res.json({ data: diagnosis });
}); 

/**
 * Update Diagnosis
 */
const updateDiagnosis = asyncHandler(async (req, res) => {
    const diagnosis = await Diagnosis.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!diagnosis) return res.status(404).json({ message: "Diagnosis not found!" }); 

    // diagnosis.patient = req?.body?.patient || diagnosis?.patient; 
    // diagnosis.authorizing_professional = req?.body?.authorizing_professional || diagnosis?.authorizing_professional; 
    diagnosis.notes = req?.body?.notes || diagnosis?.notes; 
    diagnosis.comments = req?.body?.comments || diagnosis?.comments; 

    diagnosis.save()
                .then(() => {
                    res.json({ success: `Diagnosis ${diagnosis?._id} updated` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Soft-delete Diagnosis
 */
const deleteDiagnosis = asyncHandler(async (req, res) => {
    const diagnosis = await Diagnosis.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!diagnosis) return res.status(404).json({ message: "Diagnosis not found!" }); 

    if (diagnosis.deleted_at == '' || diagnosis.deleted_at == null) {
        diagnosis.deleted_at = new Date().toISOString();
        diagnosis.deleted_by = req?.user_id;
    }

    diagnosis.save()
                .then(() => {
                    res.json({ success: `Diagnosis ${diagnosis?._id} deleted` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Restore soft-deleted Diagnosis
 */
const restoreDiagnosis = asyncHandler(async (req, res) => {
    const diagnosis = await Diagnosis.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!diagnosis) return res.status(404).json({ message: "Diagnosis not found!" }); 

    diagnosis.deleted_at = null;
    diagnosis.deleted_by = null;

    diagnosis.save()
                .then(() => {
                    res.json({ success: `Diagnosis ${diagnosis?._id} restored` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Permanent-delete an Diagnosis
 */
const destroyDiagnosis = asyncHandler(async (req, res) => {
    const diagnosis = await Diagnosis.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!diagnosis) return res.status(404).json({ message: "Diagnosis not found!" }); 

    diagnosis.deleteOne()
                .then(() => {
                    res.json({ success: `Diagnosis ${diagnosis?._id} deleted permanently` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 


export { getDiagnoses, 
        createDiagnosis, 
        getDiagnosis, 
        updateDiagnosis, 
        deleteDiagnosis, 
        restoreDiagnosis, 
        destroyDiagnosis }; 