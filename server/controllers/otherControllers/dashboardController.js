import asyncHandler from 'express-async-handler'; 
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
    try {
        const [totalAmount, totalPaid] = await Promise.all([
            MedicalBill.aggregate([
                {
                    $match: { fully_paid: true, deleted_at: null }
                },
                {
                    $group: {
                        _id: null, // No grouping, we want the total sum
                        totalAmount: { $sum: "$amount" }
                    }
                }
            ]),

            InventoryInvoice.aggregate([
                {
                    $match: { payment_status: 'paid', deleted_at: null }
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
            ])
        ]);

        const totalAmountResult = totalAmount?.length > 0 ? totalAmount[0]?.totalAmount : 0;
        const totalPaidResult = totalPaid?.length > 0 ? totalPaid[0]?.totalPaid : 0; 

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
                total_medical_bills_amount: totalAmountResult,
                total_invoice_paid: totalPaidResult, 
                latest_update: latestUpdate
            } });
    } catch (error) {
        res.status(500).json({ message: `Error calculating totals: ${error}`});
    }
}); 

/**
 * Get Appointments
 */
const getAppointments = asyncHandler(async (req, res) => {
    let latestAppointments, appointmentsCount, upcomingAppointment;
    if (req?.role == 'patient') {
        latestAppointments = await Appointment.find({ patient: req?.user_id })
                                        .sort({
                                            proposed_year_start: -1,
                                            proposed_month_start: -1,
                                            proposed_time_start: -1
                                        })
                                        .limit(10)
                                        .populate({
                                            path: 'patient',
                                            select: 'first_name last_name username role bio email phone'
                                        })
                                        .populate({
                                            path: 'professional',
                                            select: 'first_name last_name username role bio email phone'
                                        })
                                        .lean(); 
        appointmentsCount = await Appointment.countDocuments({ patient: req?.user_id }); 
        upcomingAppointment = await Appointment.findOne({ patient: req?.user_id })
                                                .sort({ updated_at: -1 })
                                                .populate({
                                                    path: 'patient',
                                                    select: 'first_name last_name username role bio email phone'
                                                })
                                                .populate({
                                                    path: 'professional',
                                                    select: 'first_name last_name username role bio email phone'
                                                })
                                                .lean();
    } else {
        latestAppointments = await Appointment.find({ professional: req?.user_id })
                                        .sort({
                                            proposed_year_start: -1,
                                            proposed_month_start: -1,
                                            proposed_time_start: -1
                                        })
                                        .limit(10)
                                        .populate({
                                            path: 'patient',
                                            select: 'first_name last_name username role bio email phone'
                                        })
                                        .populate({
                                            path: 'professional',
                                            select: 'first_name last_name username role bio email phone'
                                        })
                                        .lean(); 
        appointmentsCount = await Appointment.countDocuments({ professional: req?.user_id }); 
        upcomingAppointment = await Appointment.findOne({ professional: req?.user_id })
                                                .sort({ updated_at: -1 })
                                                .populate({
                                                    path: 'patient',
                                                    select: 'first_name last_name username role bio email phone'
                                                })
                                                .populate({
                                                    path: 'professional',
                                                    select: 'first_name last_name username role bio email phone'
                                                })
                                                .lean(); 
    }; 

    const latestUpdate = await Appointment.findOne()
                                        .sort({ updated_at: -1 })
                                        .select('updated_at')
                                        .populate({
                                            path: 'patient',
                                            select: 'first_name last_name username role bio email phone'
                                        })
                                        .populate({
                                            path: 'professional',
                                            select: 'first_name last_name username role bio email phone'
                                        })
                                        .lean();

    res.json({ data: {
        latest_appointments: latestAppointments, 
        appointments_count: appointmentsCount, 
        upcoming_appointment: upcomingAppointment, 
        latest_update: latestUpdate
    }});
}); 

/**
 * Get All Regimen and process on client-side
 */
const getRegimens = asyncHandler(async (req, res) => {
    const regimen = await RegimenAdministration.findOne({ patient: req?.user_id }).lean();

    res.json({ data: regimen });
})

/**
 * Get Doctor and Patient Counts
 */
const getUserCount = asyncHandler(async (req, res) => {
    const superAdmins = await User.countDocuments({ role: 'super-admin', deleted_at: null }); 
    const admins = await User.countDocuments({ role: 'admin', deleted_at: null }); 
    const generalPractitioners = await User.countDocuments({ role: 'general_practitioner', deleted_at: null }); 
    const gynaecologists = await User.countDocuments({ role: 'gynaecologist', deleted_at: null }); 
    const nurses = await User.countDocuments({ role: 'nurse', deleted_at: null }); 
    const laboratoryScientists = await User.countDocuments({ role: 'laboratory_scientist', deleted_at: null }); 
    const patients = await User.countDocuments({ role: 'patient', deleted_at: null }); 

    const latestUpdate = await User.findOne()
                                        .sort({ updated_at: -1 })
                                        .select('updated_at')
                                        .lean();
    
    res.json({ data: {
        super_admins: superAdmins, 
        admins: admins, 
        general_practitioners: generalPractitioners, 
        gynaecologists: gynaecologists, 
        nurses: nurses, 
        laboratory_scientists: laboratoryScientists, 
        patients: patients, 
        latest_update: latestUpdate
    }}); 
}); 

/**
 * Get Widgets
 */
const getWidgets = asyncHandler(async (req, res) => {
    const foundUserWidgets = await User.findById(req?.user_id).select('widget'); 

    if (!foundUserWidgets) return res.status(404).json({message: 'No user found'}); 

    res.json({ data: foundUserWidgets });
}); 

/**
 * Get Widget Values
 */
const getWidgetValues = asyncHandler(async (req, res) => {
    if (req?.role == 'patient') {
        foundUser = await User.find({ username: req?.user_id }); 

        const heartRate = await DiagnosisType.findOne({ title: 'Heart Rate' }).lean(); 
        const rbc = await DiagnosisType.findOne({ title: 'RBC' }).lean(); 
        const sugarLevel = await DiagnosisType.findOne({ title: 'Sugar Level' }).lean(); 
        const waterLevel = await DiagnosisType.findOne({ title: 'Water Level' }).lean(); 
        const wbc = await DiagnosisType.findOne({ title: 'WBC' }).lean(); 

        heartRateResult = await DiagnosisSegment.findOne({ diagnosis_type: heartRate?._id })
                                                .sort({ updated_at: -1 })
                                                .lean(); 

        rbcResult = await DiagnosisSegment.findOne({ diagnosis_type: rbc?._id })
                                                .sort({ updated_at: -1 })
                                                .lean(); 

        sugarLevelResult = await DiagnosisSegment.findOne({ diagnosis_type: sugarLevel?._id })
                                                .sort({ updated_at: -1 })
                                                .lean(); 

        waterLevelResult = await DiagnosisSegment.findOne({ diagnosis_type: waterLevel?._id })
                                                .sort({ updated_at: -1 })
                                                .lean(); 

        wbcResult = await DiagnosisSegment.findOne({ diagnosis_type: wbc?._id })
                                                .sort({ updated_at: -1 })
                                                .lean(); 

        res.json({ data: {
            heart_rate: heartRate, 
            rbc: rbc, 
            sugar_level: sugarLevel, 
            water_level: waterLevel, 
            wbc: wbc, 
        }}); 
    } else {
        // foundUser = await User.find({ username: req?.user_id }); 
        return;
    }
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
        || (widget == 'sugar_level') 
        || (widget == 'water_level') 
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
        || (widget == 'sugar_level') 
        || (widget == 'water_level') 
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