import asyncHandler from 'express-async-handler'; 
import Appointment from '../models/Appointment.js'; 
import Notification from '../models/Notification.js';


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
                                        .populate({
                                            path: 'appointment_request',
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
                                        .populate({
                                            path: 'appointment_request',
                                        })
                                        .lean(); 

        total = await Appointment.countDocuments({ professional: req?.user_id, deleted_at: null }); 
    } else {
        appointments = await Appointment.find({ patient: req?.user_id, deleted_at: null })
                                        .sort({ proposed_schedule_start: -1 })
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
                                        .populate({
                                            path: 'appointment_request',
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
            proposed_schedule_date, 
            proposed_schedule_start, 
            proposed_schedule_end, 
            purpose } = req?.body; 

    // console.log(proposed_schedule_date, 
    //         proposed_schedule_start, 
    //         proposed_schedule_end, 
    //         notes, 
    //         purpose)

    const startTime = new Date(proposed_schedule_start);
    const endTime = new Date(proposed_schedule_end);

    if (endTime < startTime) return res.status(400).json({ message: "End schedule cannot be less than start schedule" });

    if (endTime.getTime() === startTime.getTime()) return res.status(400).json({ message: "End schedule cannot be equal to start schedule" });

    const timeDifference = endTime - startTime; 

    const timeDifferenceInHours = timeDifference / (1000 * 60 * 60);

    if (timeDifferenceInHours > 2) return res.status(400).json({ message: "The time difference cannot be more than 2 hours" }); 
    console.log('passed 1');

    console.log('startTime instanceof Date:', startTime instanceof Date);
    console.log('endTime instanceof Date:', endTime instanceof Date);

    const alreadyExistingAppointment = await Appointment.aggregate([
        {
            $match: {
                proposed_schedule_start: { $lt: endTime },
                proposed_schedule_end: { $gt: startTime }
            }
        }
    ]);

    if (alreadyExistingAppointment.length > 0) {
        return res.status(409).json({ 
            message: "There is already an appointment that conflicts with the proposed schedule.",
            conflicting_appointment: alreadyExistingAppointment 
        });
    }; 

    const appointment = new Appointment({
        user: req?.user_id, 
        patient, 
        professional: professional ? professional : req?.user_id, 
        notes, 
        purpose,
        proposed_schedule_date, 
        proposed_schedule_start, 
        proposed_schedule_end,
    }); 

    const notification = await Notification.create({
        user: appointment?.patient, 
        appointment: appointment._id,
        read: false,
        type: 'appointment-new', 
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
    const appointment = await Appointment.findOne({ _id: req?.params?.id, deleted_at: null })
                                        .populate({
                                            path: 'patient',
                                            select: 'first_name last_name username'
                                        })
                                        .populate({
                                            path: 'professional',
                                            select: 'first_name last_name username role'
                                        })
                                        .lean(); 

    if (!appointment) return res.status(404).json({ message: "Appointment not found!" }); 

    res.json({ data: appointment });
}); 

/**
 * Update Appointment
 */
const updateAppointment = asyncHandler(async (req, res) => {
    const appointment = await Appointment.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!appointment) return res.status(404).json({ message: "Appointment not found!" }); 

    /** Data processing logic */
    const startTime = new Date(req?.body?.proposed_schedule_start);
    const endTime = new Date(req?.body?.proposed_schedule_end);

    if (endTime < startTime) return res.status(400).json({ message: "End schedule cannot be less than start schedule" });

    if (endTime.getTime() === startTime.getTime()) return res.status(400).json({ message: "End schedule cannot be equal to start schedule" });

    const timeDifference = endTime - startTime; 

    const timeDifferenceInHours = timeDifference / (1000 * 60 * 60);

    if (timeDifferenceInHours > 2) return res.status(400).json({ message: "The time difference cannot be more than 2 hours" }); 
    console.log('passed 1');

    console.log('startTime instanceof Date:', startTime instanceof Date);
    console.log('endTime instanceof Date:', endTime instanceof Date);

    const alreadyExistingAppointment = await Appointment.aggregate([
        {
            $match: {
                proposed_schedule_start: { $lt: endTime },
                proposed_schedule_end: { $gt: startTime },
                _id: { $ne: appointment?._id } 
            }
        }
    ]);

    if (alreadyExistingAppointment.length > 0) {
        return res.status(409).json({ 
            message: "There is already an appointment that conflicts with the proposed schedule.",
            conflicting_appointment: alreadyExistingAppointment 
        });
    }; 
    /** End of Data processing logic */

    appointment.patient = req?.body?.patient || appointment?.patient; 
    appointment.professional = req?.body?.professional || appointment?.professional; 
    appointment.purpose = req?.body?.purpose || appointment?.purpose; 
    appointment.notes = req?.body?.notes || appointment?.notes; 
    appointment.proposed_schedule_date = req?.body?.proposed_schedule_date || appointment?.proposed_schedule_date; 
    appointment.proposed_schedule_start = req?.body?.proposed_schedule_start || appointment?.proposed_schedule_start; 
    appointment.proposed_schedule_end = req?.body?.proposed_schedule_end || appointment?.proposed_schedule_end; 
    appointment.status = req?.body?.status || appointment?.status; 

    const notification = await Notification.create({
        user: appointment?.patient, 
        appointment: appointment._id,
        read: false,
        type: (appointment.status == 'cancelled') ? 'appointment-cancel' : 'appointment-modified'
    });

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
        // appointment.proposed_schedule_date = new Date().toISOString();
        // appointment.proposed_schedule_start = new Date().toISOString();
        // appointment.proposed_schedule_end = new Date().toISOString();
        appointment.deleted_at = new Date().toISOString();
        appointment.deleted_by = req?.user_id;
    }; 

    const notification = await Notification.create({
        user: appointment?.patient, 
        appointment: appointment._id,
        read: false,
        type: 'appointment-cancel', 
    });

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


/********************* */
/** ADDITIONAL METHODS */
/********************* */

/**
 * GET Appointments by a Specific Date
 */
const getAppointmentsSpecificDate = asyncHandler(async (req, res) => {
    const dateQuery = req?.query?.date; 

    const appointments = await Appointment.find({ proposed_schedule_date: dateQuery, 
                                            deleted_at: null,
                                            $or: [
                                                { patient: req?.user_id }, 
                                                { professional: req?.user_id } 
                                            ]
                                        })
                                        .sort({ proposed_schedule_start: -1 })
                                        .populate({
                                            path: 'patient',
                                            select: 'first_name last_name username'
                                        })
                                        .populate({
                                            path: 'professional',
                                            select: 'first_name last_name username role'
                                        })
                                        .lean(); 
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