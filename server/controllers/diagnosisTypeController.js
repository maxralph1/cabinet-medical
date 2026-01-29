import asyncHandler from 'express-async-handler'; 
import DiagnosisType from '../models/DiagnosisType.js'; 


/**
 * Get Diagnosis Types
 */ 
const getDiagnosisTypes = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    const diagnosis_types = await DiagnosisType.find({ deleted_at: null })
                                                .sort('-created_at')
                                                .skip(skip)
                                                .limit(limit)
                                                .lean(); 

    const total = await DiagnosisType.countDocuments({ deleted_at: null }); 
        
    if (!diagnosis_types?.length) return res.status(404).json({ message: "No diagnosis types found!" }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: diagnosis_types 
            });
}); 

/**
 * Create Diagnosis Type
 */
const createDiagnosisType = asyncHandler(async (req, res) => {
    const { title, description } = req?.body; 

    const diagnosis_type = new DiagnosisType({
        title, 
        description
    }); 

    diagnosis_type.save()
                    .then(() => {
                        res.status(201).json({ success: `Diagnosis type ${diagnosis_type?._id} created` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    });
}); 

/**
 * Get Diagnosis Type
 */ 
const getDiagnosisType = asyncHandler(async (req, res) => {
    const diagnosisType = await DiagnosisType.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!diagnosisType) return res.status(404).json({ message: "Diagnosis Type not found!" }); 

    res.json({ data: diagnosisType });
}); 

/**
 * Update Diagnosis Type
 */
const updateDiagnosisType = asyncHandler(async (req, res) => {
    const diagnosisType = await DiagnosisType.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!diagnosisType) return res.status(404).json({ message: "Diagnosis Type not found!" }); 

    diagnosisType.title = req?.body?.title || diagnosisType?.title; 
    diagnosisType.description = req?.body?.description || diagnosisType?.title; 

    diagnosisType.save()
                .then(() => {
                    res.json({ success: `Diagnosis Type ${diagnosisType?._id} updated` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Soft-delete Diagnosis Type
 */
const deleteDiagnosisType = asyncHandler(async (req, res) => {
    const diagnosisType = await DiagnosisType.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!diagnosisType) return res.status(404).json({ message: "Diagnosis Type not found!" }); 

    if (diagnosisType.deleted_at == '' || diagnosisType.deleted_at == null) {
        diagnosisType.deleted_at = new Date().toISOString();
        diagnosisType.deleted_by = req?.user_id;
    }

    diagnosisType.save()
                .then(() => {
                    res.json({ success: `Diagnosis Type ${diagnosisType?._id} deleted` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Restore soft-deleted Diagnosis Type
 */
const restoreDiagnosisType = asyncHandler(async (req, res) => {
    const diagnosisType = await DiagnosisType.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!diagnosisType) return res.status(404).json({ message: "Diagnosis Type not found!" }); 

    diagnosisType.deleted_at = null;
    diagnosisType.deleted_by = null;

    diagnosisType.save()
                .then(() => {
                    res.json({ success: `Diagnosis Type ${diagnosisType?._id} restored` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Permanent-delete Diagnosis Type
 */
const destroyDiagnosisType = asyncHandler(async (req, res) => {
    const diagnosisType = await DiagnosisType.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!diagnosisType) return res.status(404).json({ message: "Diagnosis Type not found!" }); 

    diagnosisType.deleteOne()
                .then(() => {
                    res.json({ success: `Diagnosis Type ${diagnosisType?._id} deleted permanently` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 


export { getDiagnosisTypes, 
        createDiagnosisType, 
        getDiagnosisType, 
        updateDiagnosisType, 
        deleteDiagnosisType, 
        restoreDiagnosisType, 
        destroyDiagnosisType }; 