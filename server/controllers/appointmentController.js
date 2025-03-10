import asyncHandler from 'express-async-handler'; 
import Appointment from '../models/Appointment.js'; 


/**
 * Get Appointments
 */
const getAppointments = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 
    const yearQuery = req?.query?.year; 
    const monthQuery = req?.query?.month; 
    const dateQuery = req?.query?.date; 

    console.log(req?.query); 
    console.log(req?.user_role); 

    // const selectedYear = req?.query?.year;
    // const selectedMonth = req?.query?.month;
    // const selectedDate = req?.query?.date;
    // const selectedTimeStart = req?.query?.time_start; 
    // const selectedTimeEnd = req?.query?.time_end; 

    let appointments, total; 

    if ((req?.user_role == 'admin') || (req?.user_role == 'superadmin')) {
        appointments = await Appointment.find({ deleted_at: null })
                                        .sort({ proposed_month_start: -1, proposed_date_start: -1, proposed_time_start: -1 })
                                        .skip(skip)
                                        .limit(limit)
                                        .populate({
                                            path: 'patient',
                                            select: 'first_name last_name username'
                                        })
                                        .populate({
                                            path: 'professional',
                                            select: 'first_name last_name username role'
                                        })
                                        .lean(); 

        total = await Appointment.countDocuments({ deleted_at: null });
    } else if ((req?.user_role == 'general_practitioner') 
            || (req?.user_role == 'gynaecologist') 
            || (req?.user_role == 'nurse') 
            || (req?.user_role == 'laboratory_scientist')) {
        appointments = await Appointment.find({ professional: req?.user_id, deleted_at: null })
                                        .sort({ proposed_month_start: -1, proposed_date_start: -1, proposed_time_start: -1 })
                                        .skip(skip)
                                        .limit(limit)
                                        .populate({
                                            path: 'patient',
                                            select: 'first_name last_name username'
                                        })
                                        .populate({
                                            path: 'professional',
                                            select: 'first_name last_name username role'
                                        })
                                        .lean(); 

        total = await Appointment.countDocuments({ professional: req?.user_id, deleted_at: null }); 
    } else {
        appointments = await Appointment.find({ patient: req?.user_id, deleted_at: null })
                                        .sort({ proposed_month_start: -1, proposed_date_start: -1, proposed_time_start: -1 })
                                        .skip(skip)
                                        .limit(limit)
                                        .populate({
                                            path: 'patient',
                                            select: 'first_name last_name username'
                                        })
                                        .populate({
                                            path: 'professional',
                                            select: 'first_name last_name username role'
                                        })
                                        .lean(); 

        total = await Appointment.countDocuments({ patient: req?.user_id, deleted_at: null }); 
    }
    if (!appointments?.length) return res.status(404).json({ message: "No appointments found!" }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: appointments 
            });
}); 

/**
 * Create Appointment
 */
const createAppointment = asyncHandler(async (req, res) => {
    const { patient, professional, notes, 
            proposed_year_start, 
            proposed_month_start, 
            proposed_date_start, 
            proposed_time_start, 
            proposed_year_end, 
            proposed_month_end, 
            proposed_date_end, 
            proposed_time_end, 
            status } = req?.body; 

    if (proposed_date_end < proposed_date_start) return res.status(400).json({ message: "End date cannot be less than start date" }); 

    if (proposed_time_end < proposed_time_start) return res.status(400).json({ message: "End time cannot be less than start time" }); 
    
    if ((proposed_date_end == proposed_date_start) && (proposed_time_end < proposed_time_start)) return res.status(400).json({ message: "End time cannot be less than start time" }); 

    const alreadyExistingAppointment = await Appointment.find({ proposed_year_start: proposed_year_start, 
                                                                proposed_month_start: proposed_month_start, 
                                                                proposed_date_start: proposed_date_start, 

                                                            }).lean();

    const appointment = new Appointment({
        user: req?.user_id, 
        patient, 
        professional: professional ? professional : req?.user_id, 
        notes, 
        proposed_year_start, 
        proposed_month_start, 
        proposed_date_start, 
        proposed_time_start, 
        proposed_year_end: proposed_year_end ? proposed_year_end : proposed_year_start, 
        proposed_month_end: proposed_month_end ? proposed_month_end : proposed_month_start, 
        proposed_date_end: proposed_date_end ? proposed_date_end : proposed_date_start,  
        proposed_time_end: proposed_time_end ? proposed_time_end : proposed_time_start, 
        status
    }); 

    appointment.save()
                .then(() => {
                    res.status(201).json({ success: `Appointment ${appointment?._id} created` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 

/**
 * Get Appointment
 */
const getAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!appointment) return res.status(404).json({ message: "Appointment not found!" }); 

    res.json({ data: appointment });
}); 

/**
 * Update Appointment
 */
const updateAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!appointment) return res.status(404).json({ message: "Appointment not found!" }); 

    appointment.patient = req?.body?.patient || appointment?.patient; 
    appointment.professional = req?.body?.professional || appointment?.professional; 
    appointment.notes = req?.body?.notes || appointment?.notes; 
    appointment.date_start = req?.body?.date_start || appointment?.date_start; 
    appointment.time_start = req?.body?.time_start || appointment?.time_start; 
    appointment.date_end = req?.body?.date_end || appointment?.date_end; 
    appointment.time_end = req?.body?.time_end || appointment?.time_end; 
    appointment.status = req?.body?.status || appointment?.status; 

    appointment.save()
                .then(() => {
                    res.json({ success: `Appointment ${appointment?._id} updated` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Soft-delete Appointment
 */
const deleteAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!appointment) return res.status(404).json({ message: "Appointment not found!" }); 

    if (appointment.deleted_at == '' || appointment.deleted_at == null) {
        appointment.deleted_at = new Date().toISOString();
        appointment.deleted_by = req?.user_id;
    }

    appointment.save()
                .then(() => {
                    res.json({ success: `Appointment ${appointment?._id} deleted` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Restore soft-deleted Appointment
 */
const restoreAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!appointment) return res.status(404).json({ message: "Appointment not found!" }); 

    appointment.deleted_at = null;
    appointment.deleted_by = null;

    appointment.save()
                .then(() => {
                    res.json({ success: `Appointment ${appointment?._id} restored` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Permanent-delete an Appointment
 */
const destroyAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!appointment) return res.status(404).json({ message: "Appointment not found!" }); 

    appointment.deleteOne()
                .then(() => {
                    res.json({ success: `Appointment ${appointment?._id} deleted permanently` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                });
}); 


/**
 * ADDITIONAL METHODS
 */
/**
 * Get Appointments
 */
const getAppointmentsSpecificDate = asyncHandler(async (req, res) => {
    const yearQuery = req?.query?.year; 
    const monthQuery = req?.query?.month; 
    const dateQuery = req?.query?.date; 

    console.log(req?.query); 
    console.log(req?.user_role); 

    // const selectedYear = req?.query?.year;
    // const selectedMonth = req?.query?.month;
    // const selectedDate = req?.query?.date;
    // const selectedTimeStart = req?.query?.time_start; 
    // const selectedTimeEnd = req?.query?.time_end; 

    let appointments; 

    if (yearQuery && monthQuery && dateQuery) {
        appointments = await Appointment.find({ proposed_year_start: yearQuery, 
                                                proposed_month_start: monthQuery, 
                                                proposed_date_start: dateQuery, 
                                                deleted_at: null })
                                        .sort({ proposed_time_start: -1 })
                                        .populate({
                                            path: 'patient',
                                            select: 'first_name last_name username'
                                        })
                                        .populate({
                                            path: 'professional',
                                            select: 'first_name last_name username role'
                                        })
                                        .lean(); 
    }

    res.json({ data: appointments });
}); 


export { getAppointments, 
        createAppointment, 
        getAppointment, 
        updateAppointment, 
        deleteAppointment, 
        restoreAppointment, 
        destroyAppointment, 
        getAppointmentsSpecificDate, }; 