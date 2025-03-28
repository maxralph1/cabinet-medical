import asyncHandler from 'express-async-handler'; 
import DiagnosisSegment from '../models/DiagnosisSegment.js'; 
import Notification from '../models/Notification.js';


/**
 * Get Diagnosis Segments
 */ 
const getDiagnosisSegments = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 
    const diagnosis_type = req?.query?.type; 

    let diagnosis_segments, total; 
    if ((req?.user_role == 'admin') || (req?.user_role == 'superadmin')) {
        if (diagnosis_type) {
            diagnosis_segments = await DiagnosisSegment.find({ diagnosis_type: diagnosis_type, deleted_at: null })
                                                        .sort('-created_at')
                                                        .skip(skip)
                                                        .limit(limit)
                                                        .lean(); 

            total = await Diagnosis.countDocuments({ diagnosis_type: diagnosis_type, deleted_at: null }); 
        } else {
            diagnosis_segments = await DiagnosisSegment.find({ deleted_at: null })
                                                        .sort('-created_at')
                                                        .skip(skip)
                                                        .limit(limit)
                                                        .lean(); 

            total = await Diagnosis.countDocuments({ deleted_at: null }); 
        }
        
    } else if ((req?.user_role == 'doctor') || (req?.user_role == 'nurse')) {
        if (diagnosis_type) {
            diagnosis_segments = await DiagnosisSegment.find({ $or: [{ authorizing_professional: req?.user_id }, { examiner: req?.user_id }], diagnosis_type: diagnosis_type, deleted_at: null })
                                                        .sort('-created_at')
                                                        .skip(skip)
                                                        .limit(limit)
                                                        .lean(); 

            total = await Diagnosis.countDocuments({ $or: [{ authorizing_professional: req?.user_id }, { examiner: req?.user_id }], diagnosis_type: diagnosis_type, deleted_at: null }); 
        } else {
            diagnosis_segments = await DiagnosisSegment.find({ $or: [{ authorizing_professional: req?.user_id }, { examiner: req?.user_id }], deleted_at: null })
                                                        .sort('-created_at')
                                                        .skip(skip)
                                                        .limit(limit)
                                                        .lean(); 

            total = await Diagnosis.countDocuments({ $or: [{ authorizing_professional: req?.user_id }, { examiner: req?.user_id }], deleted_at: null }); 
        }
        
    } else {
        if (diagnosis_type) {
            diagnosis_segments = await DiagnosisSegment.find({ patient: req?.user_id, diagnosis_type: diagnosis_type, deleted_at: null })
                                                        .sort('-created_at')
                                                        .skip(skip)
                                                        .limit(limit)
                                                        .lean(); 

            total = await Diagnosis.countDocuments({ patient: req?.user_id, diagnosis_type: diagnosis_type, deleted_at: null }); 
        } else {
            diagnosis_segments = await DiagnosisSegment.find({ patient: req?.user_id, deleted_at: null })
                                                        .sort('-created_at')
                                                        .skip(skip)
                                                        .limit(limit)
                                                        .lean(); 

            total = await Diagnosis.countDocuments({ patient: req?.user_id, deleted_at: null }); 
        }
    }
    if (!diagnosis_segments?.length) return res.status(404).json({ message: "No diagnosis found!" }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: diagnosis_segments 
            });
}); 

/**
 * Create Diagnosis Segment
 */
const createDiagnosisSegment = asyncHandler(async (req, res) => {
    const { diagnosis, diagnosis_type, patient } = req?.body; 

    const diagnosis_segment = new DiagnosisSegment({
        diagnosis, 
        diagnosis_type, 
        patient
    }); 

    diagnosis_segment.save()
                    .then(() => {
                        res.status(201).json({ success: `Diagnosis segment ${diagnosis_segment?._id} created` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    });
}); 

/**
 * Get Diagnosis Segment
 */ 
const getDiagnosisSegment = asyncHandler(async (req, res) => {
    const diagnosisSegment = await DiagnosisSegment.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!diagnosisSegment) return res.status(404).json({ message: "Diagnosis segment not found!" }); 

    res.json({ data: diagnosisSegment });
}); 

/**
 * Update Diagnosis Segment
 */
const updateDiagnosisSegment = asyncHandler(async (req, res) => {
    console.log(req?.params?.id, req?.body?.result);
    const diagnosisSegment = await DiagnosisSegment.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!diagnosisSegment) return res.status(404).json({ message: "Diagnosis Segment not found!" }); 

    // diagnosisSegment.patient = req?.body?.patient || diagnosisSegment?.patient; 
    // diagnosisSegment.authorizing_professional = req?.body?.authorizing_professional || diagnosisSegment?.authorizing_professional; 
    diagnosisSegment.result = req?.body?.result || diagnosisSegment?.result; 

    const notification = await Notification.create({
        user: diagnosisSegment?.patient, 
        diagnosis_segment: diagnosisSegment?._id, 
        read: false,
        type: 'diagnosis-result',
    });

    diagnosisSegment.save()
                    .then(() => {
                        res.json({ success: `Diagnosis Segment ${diagnosisSegment?._id} updated` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Soft-delete Diagnosis Segment
 */
const deleteDiagnosisSegment = asyncHandler(async (req, res) => {
    const diagnosisSegment = await DiagnosisSegment.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!diagnosisSegment) return res.status(404).json({ message: "Diagnosis Segment not found!" }); 

    if (diagnosisSegment.deleted_at == '' || diagnosisSegment.deleted_at == null) {
        diagnosisSegment.deleted_at = new Date().toISOString();
        diagnosisSegment.deleted_by = req?.user_id;
    }

    diagnosisSegment.save()
                    .then(() => {
                        res.json({ success: `Diagnosis Segment ${diagnosisSegment?._id} deleted` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Restore soft-deleted Diagnosis Segment
 */
const restoreDiagnosisSegment = asyncHandler(async (req, res) => {
    const diagnosisSegment = await DiagnosisSegment.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!diagnosisSegment) return res.status(404).json({ message: "Diagnosis Segment not found!" }); 

    diagnosisSegment.deleted_at = null;
    diagnosisSegment.deleted_by = null;

    diagnosisSegment.save()
                    .then(() => {
                        res.json({ success: `Diagnosis Segment ${diagnosisSegment?._id} restored` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Permanent-delete Diagnosis Segment
 */
const destroyDiagnosisSegment = asyncHandler(async (req, res) => {
    const diagnosisSegment = await DiagnosisSegment.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!diagnosisSegment) return res.status(404).json({ message: "Diagnosis Segment not found!" }); 

    diagnosisSegment.deleteOne()
                    .then(() => {
                        res.json({ success: `Diagnosis Segment ${diagnosisSegment?._id} deleted permanently` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    });
}); 


export { getDiagnosisSegments, 
        createDiagnosisSegment, 
        getDiagnosisSegment, 
        updateDiagnosisSegment, 
        deleteDiagnosisSegment, 
        restoreDiagnosisSegment, 
        destroyDiagnosisSegment }; 