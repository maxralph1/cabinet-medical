import asyncHandler from 'express-async-handler'; 
import { addMinutes } from 'date-fns';
import Appointment from '../models/Appointment.js'; 
import AppointmentRequest from '../models/AppointmentRequest.js';


/**
 * Get Appointment Requests
 */
const getAppointmentRequests = asyncHandler(async (req, res) => {
    const current_page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10; 
    const skip = (current_page - 1) * limit; 

    // console.log(req?.query); 
    // console.log(req?.user_role); 

    const appointmentRequests = await AppointmentRequest.find({ deleted_at: null })
                                                        .sort({ proposed_schedule_date_time: -1 })
                                                        .skip(skip)
                                                        .limit(limit)
                                                        .lean(); 

    const total = await AppointmentRequest.countDocuments({ deleted_at: null }); 
    
    if (!appointmentRequests?.length) return res.status(404).json({ message: "No appointment requests found!" }); 

    res.json({ 
                meta: {
                    current_page, 
                    limit, 
                    total_pages: Math.ceil(total / limit), 
                    total_results: total
                }, 
                data: appointmentRequests 
            });
}); 

/**
 * Create Appointment Request
 */
const createAppointmentRequest = asyncHandler(async (req, res) => {
    const { first_name, last_name, phone, email, 
            proposed_schedule_date_time, 
            comments } = req?.body; 

    const appointmentRequest = new AppointmentRequest({
        patient_first_name: first_name, 
        patient_last_name: last_name, 
        patient_phone: phone, 
        patient_email: email, 
        // professional, 
        comments,
        proposed_schedule_date_time,
    }); 

    appointmentRequest.save()
                    .then(() => {
                        res.status(201).json({ success: `Appointment Request ${appointmentRequest?._id} created` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    });
}); 

/**
 * Get Appointment Request
 */
const getAppointmentRequest = asyncHandler(async (req, res) => {
    const appointmentRequest = await AppointmentRequest.findOne({ _id: req?.params?.id, deleted_at: null }).lean(); 

    if (!appointmentRequest) return res.status(404).json({ message: "Appointment Request not found!" }); 

    res.json({ data: appointmentRequest });
}); 

/**
 * Update Appointment Request
 */
const updateAppointmentRequest = asyncHandler(async (req, res) => {
    const appointmentRequest = await AppointmentRequest.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!appointmentRequest) return res.status(404).json({ message: "Appointment Request not found!" }); 

    appointmentRequest.user.patient_first_name = req?.body?.patient_first_name || appointmentRequest?.user?.patient_first_name; 
    appointmentRequest.user.patient_last_name = req?.body?.patient_last_name || appointmentRequest?.user?.patient_last_name; 
    appointmentRequest.user.patient_phone = req?.body?.patient_phone || appointmentRequest?.user?.patient_phone; 
    appointmentRequest.user.patient_email = req?.body?.patient_email || appointmentRequest?.user?.patient_email; 
    appointmentRequest.comments = req?.body?.comments || appointmentRequest?.comments; 
    appointmentRequest.proposed_schedule_date_time = req?.body?.proposed_schedule_date_time || appointmentRequest?.proposed_schedule_date_time;

    appointmentRequest.save()
                    .then(() => {
                        res.json({ success: `Appointment Request ${appointmentRequest?._id} updated` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Soft-delete Appointment Request
 */
const deleteAppointmentRequest = asyncHandler(async (req, res) => {
    const appointmentRequest = await AppointmentRequest.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!appointmentRequest) return res.status(404).json({ message: "Appointment Request not found!" }); 

    if (appointmentRequest.deleted_at == '' || appointmentRequest.deleted_at == null) {
        appointmentRequest.deleted_at = new Date().toISOString();
        appointmentRequest.deleted_by = req?.user_id;
    }

    appointmentRequest.save()
                    .then(() => {
                        res.json({ success: `Appointment Request ${appointmentRequest?._id} deleted` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Restore soft-deleted Appointment Request
 */
const restoreAppointmentRequest = asyncHandler(async (req, res) => {
    const appointmentRequest = await AppointmentRequest.findOne({ _id: req?.params?.id, deleted_at: { $ne: null } }); 

    if (!appointmentRequest) return res.status(404).json({ message: "Appointment Request not found!" }); 

    appointmentRequest.deleted_at = null;
    appointmentRequest.deleted_by = null;

    appointmentRequest.save()
                    .then(() => {
                        res.json({ success: `Appointment Request ${appointmentRequest?._id} restored` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 

/**
 * Permanent-delete an Appointment Request
 */
const destroyAppointmentRequest = asyncHandler(async (req, res) => {
    const appointmentRequest = await AppointmentRequest.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!appointmentRequest) return res.status(404).json({ message: "Appointment Request not found!" }); 

    appointmentRequest.deleteOne()
                    .then(() => {
                        res.json({ success: `Appointment Request ${appointmentRequest?._id} deleted permanently` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    });
}); 


/********************* */
/** ADDITIONAL METHODS */
/********************* */

/**
 * Approve Appointment Request
 */
const approveAppointmentRequest = asyncHandler(async (req, res) => {
    const appointmentRequest = await AppointmentRequest.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!appointmentRequest) return res.status(404).json({ message: "Appointment Request not found!" });

    const appointment = await Appointment.create({
        appointment_request: appointmentRequest._id,
        user: req.user_id, 
        professional: req.user_id, 
        proposed_schedule_date: new Date(appointmentRequest.proposed_schedule_date_time)?.toLocaleDateString('en-CA'),
        proposed_schedule_start: appointmentRequest.proposed_schedule_date_time,
        proposed_schedule_end: addMinutes(appointmentRequest.proposed_schedule_date_time, 30),
        schedule_start: appointmentRequest.proposed_schedule_date_time,
        schedule_end: addMinutes(appointmentRequest.proposed_schedule_date_time, 30),
        type: 'external',
    });

    appointmentRequest.status = 'approved'; 
    appointmentRequest.appointment = appointment?._id;  

    appointmentRequest.save()
                .then(() => {
                    res.json({ success: `Appointment Request ${appointmentRequest?._id} approved` });
                })
                .catch(error => {
                    return res.status(400).json({ message: "An error occured", details: `${error}` });
                }); 
}); 

/**
 * Reject Appointment Request
 */
const rejectAppointmentRequest = asyncHandler(async (req, res) => {
    const appointmentRequest = await AppointmentRequest.findOne({ _id: req?.params?.id, deleted_at: null }); 

    if (!appointmentRequest) return res.status(404).json({ message: "Appointment Request not found!" }); 

    appointmentRequest.status = 'rejected'; 

    appointmentRequest.save()
                    .then(() => {
                        res.json({ success: `Appointment Request ${appointmentRequest?._id} rejected.` });
                    })
                    .catch(error => {
                        return res.status(400).json({ message: "An error occured", details: `${error}` });
                    }); 
}); 


export { getAppointmentRequests, 
        createAppointmentRequest, 
        getAppointmentRequest, 
        updateAppointmentRequest, 
        deleteAppointmentRequest, 
        restoreAppointmentRequest, 
        destroyAppointmentRequest, 
        approveAppointmentRequest, 
        rejectAppointmentRequest }; 