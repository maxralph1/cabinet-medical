import asyncHandler from 'express-async-handler'; 
import Regimen from '../models/Regimen.js'; 
import RegimenAdministration from '../models/RegimenAdministration.js';


/**
 * Get Regimens
 */
const getRegimens = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    let regimens, total; 
    if ((req?.user_role == 'admin') || (req?.user_role == 'superadmin')) {
        regimens = await Regimen.find({ deleted_at: null })
                                .sort('-created_at')
                                .skip(skip)
                                .limit(limit)
                                .populate({
                                    path: 'patient',
                                    select: 'first_name last_name username'
                                })
                                .populate({
                                    path: 'authorizing_professional',
                                    select: 'first_name last_name username role'
                                })
                                .lean(); 

        total = await Regimen.countDocuments({ deleted_at: null }); 
    } else if ((req?.user_role == 'general_practitioner') 
            || (req?.user_role == 'laboratory_scientist')
            || (req?.user_role == 'nurse')) {
        regimens = await Regimen.find({ authorizing_professional: req?.user_id, deleted_at: null })
                                .sort('-created_at')
                                .skip(skip)
                                .limit(limit)
                                .populate({
                                    path: 'patient',
                                    select: 'first_name last_name username'
                                })
                                .populate({
                                    path: 'authorizing_professional',
                                    select: 'first_name last_name username role'
                                })
                                .lean(); 

        total = await Regimen.countDocuments({ authorizing_professional: req?.user_id, deleted_at: null }); 
    } else {
        regimens = await Regimen.find({ patient: req?.user_id, deleted_at: null })
                                .sort('-created_at')
                                .skip(skip)
                                .limit(limit)
                                .populate({
                                    path: 'patient',
                                    select: 'first_name last_name username'
                                })
                                .populate({
                                    path: 'authorizing_professional',
                                    select: 'first_name last_name username role'
                                })
                                .lean(); 

        total = await Regimen.countDocuments({ patient: req?.user_id, deleted_at: null }); 
    }
    if (!regimens?.length) return res.status(404).json({ message: "No regimen found!" }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: regimens 
            });
}); 

/**
 * Create Regimen
 */ 
const createRegimen = asyncHandler(async (req, res) => {
    const { patient, notes, comments, 
            date_start, time_start, 
            date_end, time_end, 
        proposed_administration_date_times } = req?.body; 

    // proposed_administration_date_times is an array

    const regimen = new Regimen({
        patient, 
        authorizing_professional: req?.user_id, 
        notes, 
        comments, 
        date_start, 
        time_start, 
        date_end, 
        time_end
    }); 

    if (proposed_administration_date_times && (proposed_administration_date_times?.length > 0)) {
        const dateTimesResolve = proposed_administration_date_times?.map(async (item, index) => {
            async function createRegimenAdministrations() {
                const newRegimenAdministration = await RegimenAdministration.create({
                    user: patient, 
                    regimen: regimen?._id, 
                    proposed_administration_date_time: item
                }); 
            }; 
            await createRegimenAdministrations();
        });
    }; 

    regimen.save()
            .then(() => {
                res.status(201).json({ success: `Regimen ${regimen?._id} created` });
            })
            .catch(error => {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            });
}); 

/**
 * Get Regimen
 */
const getRegimen = asyncHandler(async (req, res) => {
    const regimen = await Regimen.findOne({ _id: req?.params?.id, deleted_at: null })
                                .populate({
                                    path: 'patient',
                                    select: 'first_name last_name username'
                                })
                                .populate({
                                    path: 'authorizing_professional',
                                    select: 'first_name last_name username role'
                                })
                                .lean(); 

    if (!regimen) return res.status(404).json({ message: "Regimen not found!" }); 

    res.json({ data: regimen });
}); 

/**
 * Update Regimen
 */
const updateRegimen = asyncHandler(async (req, res) => {
    const regimen = await Regimen.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!regimen) return res.status(404).json({ message: "Regimen not found!" }); 

    // regimen.patient = req?.body?.patient || regimen?.patient; 
    // regimen.authorizing_professional = req?.body?.authorizing_professional || regimen?.authorizing_professional; 
    regimen.notes = req?.body?.notes || regimen?.notes; 
    regimen.comments = req?.body?.comments || regimen?.comments; 
    regimen.date_start = req?.body?.date_start || regimen?.date_start; 
    regimen.time_start = req?.body?.time_start || regimen?.time_start; 
    regimen.date_end = req?.body?.date_end || regimen?.date_end; 
    regimen.time_end = req?.body?.time_end || regimen?.time_end; 

    regimen.save()
            .then(() => {
                res.json({ success: `Regimen ${regimen?._id} updated` });
            })
            .catch(error => {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            }); 
}); 

/**
 * Soft-delete Regimen
 */
const deleteRegimen = asyncHandler(async (req, res) => {
    const regimen = await Regimen.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!regimen) return res.status(404).json({ message: "Regimen not found!" }); 

    if (regimen.deleted_at == '' || regimen.deleted_at == null) {
        regimen.deleted_at = new Date().toISOString();
        regimen.deleted_by = req?.user_id;
    }

    regimen.save()
            .then(() => {
                res.json({ success: `Regimen ${regimen?._id} deleted` });
            })
            .catch(error => {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            }); 
}); 

/**
 * Restore soft-deleted Regimen
 */
const restoreRegimen = asyncHandler(async (req, res) => {
    const regimen = await Regimen.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!regimen) return res.status(404).json({ message: "Regimen not found!" }); 

    regimen.deleted_at = null;
    regimen.deleted_by = null;

    regimen.save()
            .then(() => {
                res.json({ success: `Regimen ${regimen?._id} restored` });
            })
            .catch(error => {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            }); 
}); 

/**
 * Permanent-delete Regimen
 */
const destroyRegimen = asyncHandler(async (req, res) => {
    const regimen = await Regimen.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!regimen) return res.status(404).json({ message: "Regimen not found!" }); 

    regimen.deleteOne()
            .then(() => {
                res.json({ success: `Regimen ${regimen?._id} deleted permanently` });
            })
            .catch(error => {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            });
}); 


export { getRegimens, 
        createRegimen, 
        getRegimen, 
        updateRegimen, 
        deleteRegimen, 
        restoreRegimen, 
        destroyRegimen };