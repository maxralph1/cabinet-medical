import asyncHandler from 'express-async-handler';
import { addDays } from 'date-fns';
import {
    getYesterdayDateRange,
    getTodayDateRange,
    getPreviousWeekDateRange,
    getCurrentWeekDateRange,
    getPreviousMonthDateRange,
    getCurrentMonthDateRange,
    getPreviousYearDateRange,
    getCurrentYearDateRange
} from '../../utils/date_range.js';
const { yesterdayStart, yesterdayEnd } = getYesterdayDateRange();
const { todayStart, todayEnd } = getTodayDateRange();
const { lastWeekStart, lastWeekEnd } = getPreviousWeekDateRange();
const { weekStart, weekEnd } = getCurrentWeekDateRange();
const { lastMonthStart, lastMonthEnd } = getPreviousMonthDateRange();
const { monthStart, monthEnd } = getCurrentMonthDateRange();
const { lastYearStart, lastYearEnd } = getPreviousYearDateRange();
const { yearStart, yearEnd } = getCurrentYearDateRange();
import {
    getRangeStart,
    getPreviousRangeStart,
    getRangeEnd,
    getPreviousRangeEnd
} from '../../utils/date_range_computation.js';
import User from '../../models/User.js';
import Appointment from '../../models/Appointment.js';
import MedicalBill from '../../models/MedicalBill.js';
import InventoryInvoice from '../../models/inventory/InventoryInvoice.js';
import DiagnosisType from '../../models/DiagnosisType.js';
// import Diagnosis from '../../models/Diagnosis.js'; 
import DiagnosisSegment from '../../models/DiagnosisSegment.js';
import RegimenAdministration from '../../models/RegimenAdministration.js';


/**
 * Get Revenue
 */
const getRevenue = asyncHandler(async (req, res) => {
    const range = req?.query?.range;

    const rangeStart = getRangeStart(range, todayStart, weekStart, monthStart, yearStart);
    const previousRangeStart = getPreviousRangeStart(range, yesterdayStart, lastWeekStart, lastMonthStart, lastYearStart);
    const rangeEnd = getRangeEnd(range, todayEnd, weekEnd, monthEnd, yearEnd);
    const previousRangeEnd = getPreviousRangeEnd(range, yesterdayEnd, lastWeekEnd, lastMonthEnd, lastYearEnd);

    try {
        const [totalAmount, totalPreviousAmount, totalPaid, totalPreviousPaid] = await Promise.all([

            MedicalBill.aggregate([
                {
                    $match: {
                        fully_paid: true,
                        deleted_at: null,
                        ...(rangeStart && rangeEnd ? {
                            created_at: { $gte: rangeStart, $lte: rangeEnd }
                        } : {})
                    }
                },
                {
                    $group: {
                        _id: null, // No grouping, we want the total sum
                        totalAmount: { $sum: "$amount" }
                    }
                }
            ]),

            MedicalBill.aggregate([
                {
                    $match: {
                        fully_paid: true,
                        deleted_at: null,
                        ...(previousRangeStart && previousRangeEnd ? {
                            created_at: { $gte: previousRangeStart, $lte: previousRangeEnd }
                        } : {})
                    }
                },
                {
                    $group: {
                        _id: null, // No grouping, we want the total sum
                        totalPreviousAmount: { $sum: "$amount" }
                    }
                }
            ]),

            InventoryInvoice.aggregate([
                {
                    $match: {
                        payment_status: 'paid',
                        deleted_at: null,
                        ...(rangeStart && rangeEnd ? {
                            created_at: { $gte: rangeStart, $lte: rangeEnd }
                        } : {})
                    }
                },
                {
                    $addFields: {
                        totalPaidNumber: { $toDouble: "$total_paid" } // Convert `total_paid` to a number
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalPaid: { $sum: "$totalPaidNumber" }
                    }
                }
            ]),

            InventoryInvoice.aggregate([
                {
                    $match: {
                        payment_status: 'paid',
                        deleted_at: null,
                        ...(previousRangeStart && previousRangeEnd ? {
                            created_at: { $gte: previousRangeStart, $lte: previousRangeEnd }
                        } : {})
                    }
                },
                {
                    $addFields: {
                        totalPreviousPaidNumber: { $toDouble: "$total_paid" } // Convert `total_paid` to a number
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalPreviousPaid: { $sum: "$totalPaidNumber" }
                    }
                }
            ]),
        ]);

        const totalAmountResult = totalAmount?.length > 0 ? totalAmount[0]?.totalAmount : 0;
        const totalPaidResult = totalPaid?.length > 0 ? totalPaid[0]?.totalPaid : 0;
        const totalPreviousAmountResult = totalPreviousAmount?.length > 0 ? totalPreviousAmount[0]?.totalPreviousAmount : 0;
        const totalPreviousPaidResult = totalPreviousPaid?.length > 0 ? totalPreviousPaid[0]?.totalPreviousPaid : 0;

        const latestUpdateMedicalBill = await MedicalBill.findOne()
            .sort({ updated_at: -1 })
            .select('updated_at')
            .lean();
        const latestUpdateInventoryInvoice = await InventoryInvoice.findOne()
            .sort({ updated_at: -1 })
            .select('updated_at')
            .lean();

        // Combine the results from both collections
        const combinedResults = [latestUpdateMedicalBill, latestUpdateInventoryInvoice];

        // Sort by the updated_at field to find the most recent one
        const latestUpdate = combinedResults.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))[0];

        console.log('Latest update:', latestUpdate);

        res.json({
            data: {
                total_previous_medical_bills_amount: totalPreviousAmountResult,
                total_previous_invoice_paid: totalPreviousPaidResult,
                total_medical_bills_amount: totalAmountResult,
                total_invoice_paid: totalPaidResult,
                latest_update: latestUpdate,
            }
        });
    } catch (error) {
        res.status(500).json({ message: `Error calculating totals: ${error}` });
    }
});

/**
 * Get Appointments
 */
const getAppointments = asyncHandler(async (req, res) => {
    const range = req?.query?.range;

    const rangeStart = getRangeStart(range, todayStart, weekStart, monthStart, yearStart);
    const previousRangeStart = getPreviousRangeStart(range, yesterdayStart, lastWeekStart, lastMonthStart, lastYearStart);
    const rangeEnd = getRangeEnd(range, todayEnd, weekEnd, monthEnd, yearEnd);
    const previousRangeEnd = getPreviousRangeEnd(range, yesterdayEnd, lastWeekEnd, lastMonthEnd, lastYearEnd);

    let latestAppointments, appointmentsCount, upcomingAppointments;
    if (req?.role == 'patient') {
        latestAppointments = await Appointment.find({ patient: req?.user_id, 
                                                    deleted_at: null,
                                                    ...(rangeStart && rangeEnd ? {
                                                        proposed_schedule_start: { $gte: rangeStart }, 
                                                        proposed_schedule_end: { $lte: rangeEnd } 
                                                    } : {}) 
                                                })
                                                .sort({ proposed_schedule_start: -1 })
                                                .limit(7)
                                                .populate({
                                                    path: 'patient',
                                                    select: 'first_name last_name username role phone email'
                                                })
                                                .populate({
                                                    path: 'professional',
                                                    select: 'first_name last_name username role phone email'
                                                })
                                                .populate({
                                                    path: 'appointment_request',
                                                })
                                                .lean(); 

        appointmentsCount = await Appointment.countDocuments({
            patient: req?.user_id, 
            deleted_at: null,
            ...(rangeStart && rangeEnd ? {
                proposed_schedule_start: { $gte: rangeStart }, 
                proposed_schedule_end: { $lte: rangeEnd } 
            } : {})
        });

        upcomingAppointments = await Appointment.find({
            patient: req?.user_id,
            deleted_at: null,
            ...(rangeStart && rangeEnd ? {
                proposed_schedule_start: { $gte: rangeStart }, 
                proposed_schedule_end: { $lte: rangeEnd } 
            } : {})
        })
        .populate({
            path: 'patient',
            select: 'first_name last_name username role phone email'
        })
        .populate({
            path: 'professional',
            select: 'first_name last_name username role phone email'
        })
        .populate({
            path: 'appointment_request',
        })
        .lean();;

    } else {
        latestAppointments = await Appointment.find({ professional: req?.user_id, 
                                                    deleted_at: null,
                                                    ...(rangeStart && rangeEnd ? {
                                                        proposed_schedule_start: { $gte: rangeStart?.toISOString() }, 
                                                        proposed_schedule_end: { $lte: rangeEnd?.toISOString() } 
                                                    } : {}) 
                                                })
                                                .sort({ proposed_schedule_start: -1 })
                                                .limit(7)
                                                .populate({
                                                    path: 'patient',
                                                    select: 'first_name last_name username role phone email'
                                                })
                                                .populate({
                                                    path: 'professional',
                                                    select: 'first_name last_name username role phone email'
                                                })
                                                .populate({
                                                    path: 'appointment_request',
                                                })
                                                .lean(); 

        appointmentsCount = await Appointment.countDocuments({
            professional: req?.user_id, 
            deleted_at: null,
            ...(rangeStart && rangeEnd ? {
                proposed_schedule_start: { $gte: rangeStart?.toISOString() }, 
                proposed_schedule_end: { $lte: rangeEnd?.toISOString() } 
            } : {})
        });

        upcomingAppointments = await Appointment.find({
            professional: req?.user_id,
            deleted_at: null,
            ...(rangeStart && rangeEnd ? {
                proposed_schedule_start: { $gte: rangeStart?.toISOString() }, 
                proposed_schedule_end: { $lte: rangeEnd?.toISOString() } 
            } : {})
        })
        .populate({
            path: 'patient',
            select: 'first_name last_name username role phone email'
        })
        .populate({
            path: 'professional',
            select: 'first_name last_name username role phone email'
        })
        .populate({
            path: 'appointment_request',
        })
        .lean();

        // console.log(upcomingAppointments)
    };

    const latestUpdate = await Appointment.findOne()
        .sort({ updated_at: -1 })
        .select('updated_at')
        .populate({
            path: 'patient',
            select: 'first_name last_name username role phone email'
        })
        .populate({
            path: 'professional',
            select: 'first_name last_name username role phone email'
        })
        .populate({
            path: 'appointment_request',
        })
        .lean();

    res.json({
        data: {
            latest_appointments: latestAppointments,
            appointments_count: appointmentsCount,
            upcoming_appointments: upcomingAppointments,
            latest_update: latestUpdate
        }
    });
});

/**
 * Get All Regimen and process on client-side
 */
const getRegimens = asyncHandler(async (req, res) => {
    const regimens = await RegimenAdministration.find({
        $or: [
            { authorizing_professional: req?.user_id },
            { patient: req?.user_id }
        ],
        status: { $in: ["ongoing", "pending"] } 
    }).lean();

    res.json({ data: regimens });
})

/**
 * Get Doctor and Patient Counts
 */
const getUserCount = asyncHandler(async (req, res) => {
    const range = req?.query?.range;

    const rangeStart = getRangeStart(range, todayStart, weekStart, monthStart, yearStart);
    const previousRangeStart = getPreviousRangeStart(range, yesterdayStart, lastWeekStart, lastMonthStart, lastYearStart);
    const rangeEnd = getRangeEnd(range, todayEnd, weekEnd, monthEnd, yearEnd);
    const previousRangeEnd = getPreviousRangeEnd(range, yesterdayEnd, lastWeekEnd, lastMonthEnd, lastYearEnd);

    const superAdmins = await User.countDocuments({ role: 'super-admin', deleted_at: null });
    const admins = await User.countDocuments({ role: 'admin', deleted_at: null });
    const generalPractitioners = await User.countDocuments({ role: 'general_practitioner', deleted_at: null });
    const gynaecologists = await User.countDocuments({ role: 'gynaecologist', deleted_at: null });
    const nurses = await User.countDocuments({ role: 'nurse', deleted_at: null });
    const laboratoryScientists = await User.countDocuments({ role: 'laboratory_scientist', deleted_at: null });
    const patients = await User.countDocuments({
        role: 'patient',
        deleted_at: null,
        ...(rangeStart && rangeEnd ? {
            created_at: { $gte: rangeStart, $lte: rangeEnd }
        } : {})
    });

    const latestUpdate = await User.findOne()
        .sort({ created_at: -1 })
        .select('created_at')
        .lean();

    res.json({
        data: {
            super_admins: superAdmins,
            admins: admins,
            general_practitioners: generalPractitioners,
            gynaecologists: gynaecologists,
            nurses: nurses,
            laboratory_scientists: laboratoryScientists,
            patients: patients,
            latest_update: latestUpdate
        }
    });
});

/**
 * Get Widgets
 */
const getWidgets = asyncHandler(async (req, res) => {
    const foundUserWidgets = await User.findById(req?.user_id).select('widget');

    if (!foundUserWidgets) return res.status(404).json({ message: 'No user found' });

    res.json({ data: foundUserWidgets });
});

/**
 * Get Widget Values
 */
const getWidgetValues = asyncHandler(async (req, res) => {
    // if (req?.role == 'patient') {
        const bloodGlucose = await DiagnosisType.findOne({ title: 'Blood Glucose Level' }).lean();
        const heartRate = await DiagnosisType.findOne({ title: 'Heart Rate' }).lean();
        const liquidVolume = await DiagnosisType.findOne({ title: 'Liquid Volume' }).lean();
        const rbc = await DiagnosisType.findOne({ title: 'RBC Count' }).lean();
        const wbc = await DiagnosisType.findOne({ title: 'WBC Count' }).lean();

        const heartRateResult = await DiagnosisSegment.findOne({
            diagnosis_type: heartRate?._id, 
            patient: req?.user_id,
            // $or: [
            //     { result: { $exists: false } },
            //     { result: { $ne: '' } }
            // ] 
        })
        .sort({ updated_at: -1 })
        .lean(); 

        const rbcResult = await DiagnosisSegment.findOne({ 
            diagnosis_type: rbc?._id, 
            patient: req?.user_id , 
            // $or: [
            //     { result: { $exists: false } },
            //     { result: { $ne: '' } }
            // ]
        })
        .sort({ updated_at: -1 })
        .lean();

        const bloodGlucoseLevelResult = await DiagnosisSegment.findOne({ 
            diagnosis_type: bloodGlucose?._id, 
            patient: req?.user_id, 
            // $or: [
            //     { result: { $exists: false } },
            //     { result: { $ne: '' } }
            // ]
        })
        .sort({ updated_at: -1 })
        .lean();

        const liquidVolumeResult = await DiagnosisSegment.findOne({ 
            diagnosis_type: liquidVolume?._id, 
            patient: req?.user_id, 
            // $or: [
            //     { result: { $exists: false } },
            //     { result: { $ne: '' } }
            // ] 
        })
        .sort({ updated_at: -1 })
        .lean();

        const wbcResult = await DiagnosisSegment.findOne({ 
            diagnosis_type: wbc?._id, 
            patient: req?.user_id, 
            // $or: [
            //     { result: { $exists: false } },
            //     { result: { $ne: '' } }
            // ] 
        })
        .sort({ updated_at: -1 })
        .lean();

        res.json({
            data: {
                heart_rate: heartRateResult,
                rbc: rbcResult,
                blood_glucose_level: bloodGlucoseLevelResult,
                liquid_volume: liquidVolumeResult,
                wbc: wbcResult,
            }
        });
    // } else {
    //     // foundUser = await User.find({ username: req?.user_id }); 
    //     return;
    // }
});

/**
 * Add Widget
 */
const addWidget = asyncHandler(async (req, res) => {
    const { widget } = req?.body;
    console.log(widget);
    console.log(req?.body);

    if ((widget == 'heart_rate')
        || (widget == 'rbc')
        || (widget == 'blood_sugar_level')
        || (widget == 'liquid_volume')
        || (widget == 'wbc')) {
        try {
            const foundUser = await User.findById(req?.user_id);

            // Check if the value is already in the array
            if (foundUser.widget.includes(widget)) {
                console.log('Value is already in the array, no need to add it');
            } else {
                // If the value is not in the array, add it using $addToSet or push
                const result = await User.updateOne(
                    { _id: req?.user_id },
                    { $addToSet: { widget: widget } }
                );

                if (result.nModified === 0) {
                    // console.log('No user widgets were updated');
                    res.status(422).json({ message: 'No user widgets were updated' });
                } else {
                    res.json({ success: 'Widget added successfully' });
                }
            }
        } catch (error) {
            // console.error('Error adding value:', error); 
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
    };
});

/**
 * Remove Widget
 */
const removeWidget = asyncHandler(async (req, res) => {
    const { widget } = req?.body;

    if ((widget == 'heart_rate')
        || (widget == 'rbc')
        || (widget == 'blood_glucose_level')
        || (widget == 'liquid_volume')
        || (widget == 'wbc')) {
        try {
            const result = await User.updateOne(
                { _id: req?.user_id },
                { $pull: { widget: widget } }
            );

            if (result.nModified === 0) {
                // console.log('No iuser widgets were removed');
                res.status(422).json({ message: 'No user widgets were removeded' });
            } else {
                // console.log('Value removed successfully'); 
                res.json({ success: 'Widget removed successfully' });
            }
        } catch (error) {
            // console.error('Error removing value:', error); 
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
    };
});


export {
    getRevenue,
    getAppointments,
    getRegimens,
    getUserCount,
    getWidgets,
    getWidgetValues,
    addWidget,
    removeWidget
}