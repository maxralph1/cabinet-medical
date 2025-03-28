import asyncHandler from 'express-async-handler'; 
import PatientChart from '../models/PatientChart.js'; 


/**
 * Get Patient Charts
 */ 
const getPatientCharts = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    const patientCharts = await PatientChart.find({ deleted_at: null })
                                            .sort('-created_at')
                                            .skip(skip)
                                            .limit(limit)
                                            .lean(); 

    const total = await PatientChart.countDocuments({ deleted_at: null }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: patientCharts 
            });
}); 

/**
 * Create Patient Chart
 */
const createPatientChart = asyncHandler(async (req, res) => {
    const { patient, /**professional,**/notes, comments } = req?.body; 

    const patientChart = new PatientChart({
        user: req?.user_id, 
        patient, 
        // professional: professional ? professional : req?.user_id, 
        professional: req?.user_id, 
        notes, 
        comments
    }); 

    patientChart.save()
                .then(() => {
                    res.status(201).json({ success: `PatientChart ${patientChart?._id} created` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 

/**
 * Get Patient Chart
 */
const getPatientChart = asyncHandler(async (req, res) => {
    const patientChart = await PatientChart.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!patientChart) return res.status(404).json({ message: "Patient Chart not found!" }); 

    res.json({ data: patientChart });
}); 

/**
 * Update Patient Chart
 */
const updatePatientChart = asyncHandler(async (req, res) => {
    const patientChart = await PatientChart.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!patientChart) return res.status(404).json({ message: "PatientChart not found!" }); 

    patientChart.patient = req?.body?.patient || patientChart?.patient; 
    patientChart.professional = req?.body?.professional || patientChart?.professional; 
    patientChart.notes = req?.body?.notes || patientChart?.notes; 
    patientChart.comments = req?.body?.comments || patientChart?.comments; 

    patientChart.save()
                .then(() => {
                    res.json({ success: `PatientChart ${patientChart?._id} updated` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Soft-delete Patient Chart
 */
const deletePatientChart = asyncHandler(async (req, res) => {
    const patientChart = await PatientChart.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!patientChart) return res.status(404).json({ message: "Patient Chart not found!" }); 

    if (patientChart.deleted_at == '' || patientChart.deleted_at == null) {
        patientChart.deleted_at = new Date().toISOString();
        patientChart.deleted_by = req?.user_id;
    }

    patientChart.save()
                .then(() => {
                    res.json({ success: `Patient Chart ${patientChart?._id} deleted` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Restore soft-deleted Patient Chart
 */
const restorePatientChart = asyncHandler(async (req, res) => {
    const patientChart = await PatientChart.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!patientChart) return res.status(404).json({ message: "Patient Chart not found!" }); 

    patientChart.deleted_at = null;
    patientChart.deleted_by = null;

    patientChart.save()
                .then(() => {
                    res.json({ success: `Patient Chart ${patientChart?._id} restored` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Permanent-delete Patient Chart
 */
const destroyPatientChart = asyncHandler(async (req, res) => {
    const patientChart = await PatientChart.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!patientChart) return res.status(404).json({ message: "Patient Chart not found!" }); 

    patientChart.deleteOne()
                .then(() => {
                    res.json({ success: `Patient Chart ${patientChart?._id} deleted permanently` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 


export { getPatientCharts, 
        createPatientChart, 
        getPatientChart, 
        updatePatientChart, 
        deletePatientChart, 
        restorePatientChart, 
        destroyPatientChart }; 