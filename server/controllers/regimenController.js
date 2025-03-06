import asyncHandler from 'express-async-handler'; 
import { formatISO, parseISO, startOfDay, endOfDay, subDays, 
        startOfMonth, endOfMonth, addMonths, subMonths, 
        startOfYear, endOfYear, addYears, subYears } from 'date-fns'; 
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
    const { patient, notes,
            administrations_count, date_time_start, frequency_value, frequency_unit, 
            proposed_administration_date_times } = req?.body; 

    console.log(req?.body)

    // proposed_administration_date_times is an array

    const regimen = new Regimen({
        patient, 
        authorizing_professional: req?.user_id, 
        notes, 
    }); 

    /** Proposed Administration Frequency */
    if (proposed_administration_date_times && (proposed_administration_date_times?.length > 0)) {
        const proposed_administration_date_times_array = JSON.parse(proposed_administration_date_times);
        const proposedAdministrationdateTimesResolve = proposed_administration_date_times_array?.map(async (unit, index) => { 
            await RegimenAdministration.create({
                authorizing_professional: req?.user_id, 
                patient, 
                regimen: regimen?._id, 
                proposed_administration_date_time: unit?.date_time, 
            }); 
        }); 

        await Promise.all(proposedAdministrationdateTimesResolve); 
    }; 

    if ((administrations_count && date_time_start && frequency_value && frequency_unit)) {

        const proposedAdministrationdateTimesResolve = async () => {
            const promises = []; // Collect all promises to run them concurrently

            let proposed_date_time = new Date(date_time_start);

            for (let i = 0; i <= administrations_count; i++) {

                let createPromise = RegimenAdministration.create({
                        authorizing_professional: req?.user_id, 
                        patient, 
                        regimen: regimen?._id, 
                        proposed_administration_date_time: proposed_date_time?.toISOString(),
                    });

                promises.push(createPromise); 

                if (frequency_unit == 'per_second') {
                    proposed_date_time.setSeconds(proposed_date_time.getSeconds() + frequency_value);
                } else if (frequency_unit == 'per_minute') {
                    proposed_date_time.setMinutes(proposed_date_time.getMinutes() + frequency_value);
                } else if (frequency_unit == 'hourly') {
                    proposed_date_time.setHours(proposed_date_time.getHours() + frequency_value);
                } else if (frequency_unit == 'daily') {
                    proposed_date_time.setDate(proposed_date_time.getDate() + frequency_value);
                };
            }

            await Promise.all(promises);
        };

        await proposedAdministrationdateTimesResolve();

    };
    /** End of Proposed Administration Frequency */

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

    const regimen_administrations = await RegimenAdministration.find({ regimen: regimen?._id, deleted_at: null })
                                                    .sort('-created_at')
                                                    .lean(); 

    let regimenObj = regimen; 

    regimenObj.regimen_administrations = regimen_administrations; 

    res.json({ data: regimenObj });
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