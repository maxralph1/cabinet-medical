import { useContext, useEffect, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useAppointments } from '@/hooks/dashboard/useAppointments.jsx'; 
import { useRegimens } from '@/hooks/dashboard/useRegimens.jsx'; 
import { useRevenue } from '@/hooks/dashboard/useRevenue.jsx'; 
import { useUserCount } from '@/hooks/dashboard/useUserCount.jsx'; 
import { useWidgets } from '@/hooks/dashboard/useWidgets.jsx'; 
import { useWidgetValues } from '@/hooks/dashboard/useWidgetValues.jsx'; 
import { useWidget } from '@/hooks/dashboard/useWidget.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const { user } = useContext(AuthContext); 
    const date = new Date();
    const hour = date.getHours();  

    const [appointmentRange, setAppointmentRange] = useState('all'); 
    const [regimenRange, setRegimenRange] = useState('all'); 
    const [revenueRange, setRevenueRange] = useState('all'); 
    const [userCountRange, setUserCountRange] = useState('all'); 

    const { appointments } = useAppointments(appointmentRange); 
    const { regimens } = useRegimens(regimenRange); 
    const { revenue } = useRevenue(revenueRange); 
    const { userCount } = useUserCount(userCountRange); 
    const { widgets, getWidgets } = useWidgets(); 
    const { widgetValues } = useWidgetValues();
    const { widget, createWidget, deleteWidget } = useWidget(); 
    console.log(appointments); 
    console.log(regimens); 
    console.log('revenue:', revenue); 
    console.log(userCount); 
    console.log('widgets:', widgets); 
    console.log('widgetValues:', widgetValues); 

    const getClosestAppointment = () => {
        const now = new Date();

        // Format current date and time as 'YYYY-MM-DDTHH:mm' to match the proposed appointment format
        const currentDateTime = now.toISOString().slice(0, 16); // '2025-03-05T10:15' format
        
        // Find the appointment happening today
        const todayAppointment = appointments?.data?.find((appointment) => {
            const proposedStartDateTime = `${appointment?.proposed_year_start}-${String(appointment?.proposed_month_start).padStart(2, '0')}-${String(appointment?.proposed_date_start).padStart(2, '0')}T${appointment?.proposed_time_start}`;
            return proposedStartDateTime === currentDateTime;
        });

        if (todayAppointment) {
            // If an appointment is happening today, return it
            return todayAppointment;
        }

        // If no appointment is happening today, find the closest future appointment
        const futureAppointments = appointments?.data?.filter((appointment) => {
            const proposedStartDateTime = `${appointment?.proposed_year_start}-${String(appointment?.proposed_month_start).padStart(2, '0')}-${String(appointment?.proposed_date_start).padStart(2, '0')}T${appointment?.proposed_time_start}`;
            return proposedStartDateTime > currentDateTime;
        });

        // If there are future appointments, return the closest one
        if (futureAppointments?.data?.length > 0) {
            // Sort by the proposed start time, and pick the first (earliest future appointment)
            const closestFutureAppointment = futureAppointments?.data?.reduce((closest, appointment) => {
                const proposedStartDateTime = `${appointment?.proposed_year_start}-${String(appointment?.proposed_month_start).padStart(2, '0')}-${String(appointment?.proposed_date_start).padStart(2, '0')}T${appointment?.proposed_time_start}`;
                return !closest || proposedStartDateTime < closest ? proposedStartDateTime : closest;
            });

            return futureAppointments?.data?.find((appointment) => {
                const proposedStartDateTime = `${appointment?.proposed_year_start}-${String(appointment?.proposed_month_start).padStart(2, '0')}-${String(appointment?.proposed_date_start).padStart(2, '0')}T${appointment?.proposed_time_start}`;
                return proposedStartDateTime === closestFutureAppointment;
            });
        }

        // If no future appointments are found, return null
        return null;
    }; 

    /** Time Difference Calculation */
    const [timeDifference, setTimeDifference] = useState(null);

    // Function to calculate time difference
    const calculateTimeDifference = (timeEnd, timeStart) => {
        const timeToDate = (time) => {
            if (!time || typeof time !== 'string' || !time.includes(':')) {
                throw new Error('Invalid time format');
            }

            const [hours, minutes] = time.split(':');
            if (isNaN(hours) || isNaN(minutes)) {
                throw new Error('Invalid time format');
            }

            const now = new Date();
            now.setHours(hours, minutes, 0, 0);
            return now;
        };

        try {
            if (!timeEnd || !timeStart) {
                throw new Error('Both timeEnd and timeStart are required');
            }

            const startTime = timeToDate(timeStart);
            const endTime = timeToDate(timeEnd);

            const diffInMilliseconds = endTime - startTime;
            const diffInMinutes = diffInMilliseconds / (1000 * 60);

            return diffInMinutes;
        } catch (error) {
            console.error('Error:', error.message);
            return 'N/A';
        }
    };

    useEffect(() => {
        // Wait for data to be available and then calculate the time difference
        if (appointments?.data?.upcoming_appointment?.proposed_time_end && 
            appointments?.data?.upcoming_appointment?.proposed_time_start) {
            
            const diff = calculateTimeDifference(
                appointments?.data?.upcoming_appointment?.proposed_time_end,
                appointments?.data?.upcoming_appointment?.proposed_time_start
            );
            
            setTimeDifference(diff);  // Store the result in state
        }
    }, [appointments]);
    /** End of Time Difference Calculation */

    return (
        <Layout>
            <div className="salutation d-flex flex-column">
                <span className="text-secondary fs-4">Hi { user?.user?.first_name + ' ' + user?.user?.last_name}</span>
                {/* <span className="text-secondary fs-5">Hi { user?.user?.first_name + ' ' + user?.user?.last_name},</span>
                <span className="fs-1 fw-light">Good&nbsp;
                    { hour < 12 
                        ? 'morning' 
                            : hour < 16 
                            ? 'afternoon' 
                                : hour >= 16 
                                ? 'evening' 
                                    : '' }
                </span> */}
                <div className="d-flex flex-column gap-2 pt-2 align-items-end">
                    <span>You have&nbsp;<a href="#" className="fw-semibold text-warning">1 appointment&nbsp;</a>today in the next <span className="fw-semibold">30 minutes</span>.</span>
                    <span>You have&nbsp;<a href="#" className="fw-semibold text-warning">1 ongoing regimen&nbsp;</a>. Ensure to take your medication.</span>
                </div>
            </div>
            
            <section className="dashboard-meters w-100">
                <section className="admin-meters gap-3 pt-4">
                    <article className="revenue border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start">
                        <span className="d-flex justify-content-center align-items-center border-radius-50 p-2"
                            style={{ backgroundColor: '#f2f2f2' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-dollar"
                                viewBox="0 0 16 16">
                                <path
                                    d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z" />
                            </svg>
                        </span>
                        <span>Total Revenue</span>
                        <span className="fs-4 fw-semibold">{ (Number(revenue?.data?.total_medical_bills_amount) + Number(revenue?.data?.total_invoice_paid)) || '0.00' }<span className="fs-5">MUR</span></span>
                        <span className="bg-body-tertiary"><small>Updated&nbsp;{ dayjs(revenue?.data?.latest_update?.updated_at).format('MMMM D, YYYY') }</small></span>
                    </article>
                    
                    <article className="appointments border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start">
                        <span className="d-flex justify-content-center align-items-center border-radius-50 p-2"
                            style={{ backgroundColor: '#f2f2f2' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-event"
                                viewBox="0 0 16 16">
                                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                <path
                                    d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                            </svg>
                        </span>
                        <span>Total Appointments</span>
                        <span className="fs-4 fw-semibold">{ Number(appointments?.data?.appointments_count) || 0 }</span>
                        <span className="bg-body-tertiary"><small>Updated&nbsp;{ dayjs(appointments?.data?.latest_update?.updated_at).format('MMMM D, YYYY') }</small></span>
                    </article>
                    
                    <article className="doctors border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start">
                        <span className="d-flex justify-content-center align-items-center border-radius-50 p-2"
                            style={{ backgroundColor: '#f2f2f2' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-medical" viewBox="0 0 16 16">
                                <path d="M8.5 4.5a.5.5 0 0 0-1 0v.634l-.549-.317a.5.5 0 1 0-.5.866L7 6l-.549.317a.5.5 0 1 0 .5.866l.549-.317V7.5a.5.5 0 1 0 1 0v-.634l.549.317a.5.5 0 1 0 .5-.866L9 6l.549-.317a.5.5 0 1 0-.5-.866l-.549.317zM5.5 9a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z"/>
                                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1"/>
                            </svg>
                        </span>
                        <span>Total Doctors</span>
                        <span className="fs-4 fw-semibold">
                            { Number(userCount?.data?.general_practitioners 
                                || userCount?.data?.gynaecologists
                            ) || 0 }
                        </span>
                        <span className="bg-body-tertiary"><small>Updated&nbsp;{ dayjs(userCount?.data?.latest_update?.updated_at).format('MMMM D, YYYY') }</small></span>
                    </article>
                    
                    <article className="patients border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start">
                        <span className="d-flex justify-content-center align-items-center border-radius-50 p-2"
                            style={{ backgroundColor: '#f2f2f2' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-standing"
                                viewBox="0 0 16 16">
                                <path
                                    d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M6 6.75v8.5a.75.75 0 0 0 1.5 0V10.5a.5.5 0 0 1 1 0v4.75a.75.75 0 0 0 1.5 0v-8.5a.25.25 0 1 1 .5 0v2.5a.75.75 0 0 0 1.5 0V6.5a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v2.75a.75.75 0 0 0 1.5 0v-2.5a.25.25 0 0 1 .5 0" />
                            </svg>
                        </span>
                        <span>Total Patients</span>
                        <span className="fs-4 fw-semibold">
                            { Number(userCount?.data?.patients) || 0 }
                        </span>
                        <span className="bg-body-tertiary"><small>Updated&nbsp;{ dayjs(userCount?.data?.latest_update?.updated_at).format('MMMM D, YYYY') }</small></span>
                    </article>
                </section>

                <section className="patient-meters align-items-center d-flex gap-3 flex-wrap pt-4">
                    { (widgets?.data?.widget?.length > 0) && (widgets?.data?.widget?.map((widget, index) => {
                        return (
                            <article key={ index } className={`widget border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start`}>
                                <div className="w-100 d-flex justify-content-between align-items-center">
                                    <span>{ (widget == 'heart_rate') ? 'Heart Rate' 
                                                : (widget == 'liquid_volume') ? 'Liquid Volume' 
                                                : (widget == 'rbc') ? 'Red Blood Cells' 
                                                : (widget == 'sugar_level') ? 'Sugar Level' 
                                                : (widget == 'water_level') ? 'Water Level' 
                                                : (widget == 'wbc') ? 'White Blood Cells' 
                                                : '' }</span>
                                    <span 
                                        className="d-flex justify-content-center align-items-center border-radius-50 p-2"
                                        style={{ backgroundColor: '#f2f2f2' }}>
                                            { (widget == 'heart_rate') 
                                                ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-pulse"
                                                        viewBox="0 0 16 16">
                                                        <path
                                                            d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053.918 3.995.78 5.323 1.508 7H.43c-2.128-5.697 4.165-8.83 7.394-5.857q.09.083.176.171a3 3 0 0 1 .176-.17c3.23-2.974 9.522.159 7.394 5.856h-1.078c.728-1.677.59-3.005.108-3.947C13.486.878 10.4.28 8.717 2.01zM2.212 10h1.315C4.593 11.183 6.05 12.458 8 13.795c1.949-1.337 3.407-2.612 4.473-3.795h1.315c-1.265 1.566-3.14 3.25-5.788 5-2.648-1.75-4.523-3.434-5.788-5" />
                                                        <path
                                                            d="M10.464 3.314a.5.5 0 0 0-.945.049L7.921 8.956 6.464 5.314a.5.5 0 0 0-.88-.091L3.732 8H.5a.5.5 0 0 0 0 1H4a.5.5 0 0 0 .416-.223l1.473-2.209 1.647 4.118a.5.5 0 0 0 .945-.049l1.598-5.593 1.457 3.642A.5.5 0 0 0 12 9h3.5a.5.5 0 0 0 0-1h-3.162z" />
                                                    </svg>
                                                ) : (widget == 'liquid_volume') 
                                                    ? (
                                                        ''
                                                    ) : (widget == 'rbc') 
                                                        ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-droplet-fill" viewBox="0 0 16 16">
                                                                <path d="M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6M6.646 4.646l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448c.82-1.641 1.717-2.753 2.093-3.13"/>
                                                            </svg>
                                                        ) : (widget == 'sugar_level') 
                                                            ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-boxes" viewBox="0 0 16 16">
                                                                    <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434zM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567zM7.5 9.933l-2.75 1.571v3.134l2.75-1.571zm1 3.134 2.75 1.571v-3.134L8.5 9.933zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567zm2.242-2.433V3.504L8.5 5.076V8.21zM7.5 8.21V5.076L4.75 3.504v3.134zM5.258 2.643 8 4.21l2.742-1.567L8 1.076zM15 9.933l-2.75 1.571v3.134L15 13.067zM3.75 14.638v-3.134L1 9.933v3.134z"/>
                                                                </svg>
                                                            ) : (widget == 'water_level') 
                                                                ? (
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-moisture"
                                                                        viewBox="0 0 16 16">
                                                                        <path
                                                                            d="M13.5 0a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V7.5h-1.5a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V15h-1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5zM7 1.5l.364-.343a.5.5 0 0 0-.728 0l-.002.002-.006.007-.022.023-.08.088a29 29 0 0 0-1.274 1.517c-.769.983-1.714 2.325-2.385 3.727C2.368 7.564 2 8.682 2 9.733 2 12.614 4.212 15 7 15s5-2.386 5-5.267c0-1.05-.368-2.169-.867-3.212-.671-1.402-1.616-2.744-2.385-3.727a29 29 0 0 0-1.354-1.605l-.022-.023-.006-.007-.002-.001zm0 0-.364-.343zm-.016.766L7 2.247l.016.019c.24.274.572.667.944 1.144.611.781 1.32 1.776 1.901 2.827H4.14c.58-1.051 1.29-2.046 1.9-2.827.373-.477.706-.87.945-1.144zM3 9.733c0-.755.244-1.612.638-2.496h6.724c.395.884.638 1.741.638 2.496C11 12.117 9.182 14 7 14s-4-1.883-4-4.267" />
                                                                    </svg>
                                                                ) : (widget == 'wbc') 
                                                                    ? (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-droplet" viewBox="0 0 16 16">
                                                                            <path fillRule="evenodd" d="M7.21.8C7.69.295 8 0 8 0q.164.544.371 1.038c.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8m.413 1.021A31 31 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
                                                                            <path fillRule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87z"/>
                                                                        </svg>
                                                                    ) : ''}
                                                    
                                    </span>

                                </div>
                                <span className="fs-6 fw-semibold">120{ (widget == 'heart_rate') ? 'BPM'
                                                                        : (widget == 'liquid_volume') ? 'L' 
                                                                        : (widget == 'rbc') ? <span>/<span className="micro">μ</span>L</span> 
                                                                        : (widget == 'sugar_level') ? '/mL' 
                                                                        : (widget == 'water_level') ? 'L' 
                                                                        : (widget == 'wbc') ? <span>/<span className="micro">μ</span>L</span>  
                                                                        : '' }</span>
                                <span className="bg-body-tertiary"><small>Updated January 9, 2025</small></span>
                            </article>
                        )
                    })) }

                    <div>
                        <span 
                            type="button" 
                            data-bs-toggle="modal" 
                            data-bs-target={`#widgetOptionsModal`}
                            className="d-flex flex-column align-items-center justify-content-center gap-2 border-radius-25 border-1 p-2 cursor-pointer" style={{ width: '100px', height: '100px', borderStyle: 'dashed' }}>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-plus-circle-fill"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                                </svg>
                            </span>
                            <span><small>Add Widget</small></span>
                        </span>

                        <section className="modal fade" id={`widgetOptionsModal`} tabIndex="-1" aria-labelledby={`widgetOptionsModalLabel`}>
                            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                <div className="modal-content">
                                    <div className="modal-header d-flex justify-content-end">
                                        <h3 className="visually-hidden" id={`widgetOptionsModalLabel`}>Widget Options</h3>
                                        <button type="button" data-bs-dismiss="modal" aria-label="Close" className="border-0 bg-transparent">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <section className="modal-body d-flex flex-column gap-2 pt-3">
                                        <article className="d-flex align-items-center gap-3">
                                            <h4 className="fs-6 mt-2">Heart Rate</h4>
                                            { (widgets?.data?.widget?.length > 0) && widgets?.data?.widget?.find(foundWidget => foundWidget == 'heart_rate') 
                                                ? <button 
                                                    onClick={ async () => {
                                                        await deleteWidget('heart_rate'); 
                                                        await getWidgets(); 
                                                    } } 
                                                    className="bg-transparent border-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill text-danger" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                        </svg>
                                                    </button> 
                                                : <button 
                                                    onClick={ async () => {
                                                        await createWidget('heart_rate'); 
                                                        await getWidgets(); 
                                                    } }
                                                    className="bg-transparent border-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill text-info" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                                        </svg>
                                                    </button> }
                                        </article>
                                        <article className="d-flex align-items-center gap-3">
                                            <h4 className="fs-6 mt-2">Liquid Volume</h4>
                                            { (widgets?.data?.widget?.length > 0) && widgets?.data?.widget?.find(foundWidget => foundWidget == 'liquid_volume') 
                                                ? <button 
                                                    onClick={ async () => {
                                                        await deleteWidget('liquid_volume'); 
                                                        await getWidgets(); 
                                                    } } 
                                                    className="bg-transparent border-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill text-danger" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                        </svg>
                                                    </button> 
                                                : <button 
                                                    onClick={ async () => {
                                                        await createWidget('liquid_volume'); 
                                                        await getWidgets(); 
                                                    } }
                                                    className="bg-transparent border-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill text-info" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                                        </svg>
                                                    </button> }
                                        </article>
                                        <article className="d-flex align-items-center gap-3">
                                            <h4 className="fs-6 mt-2">Red Blood Cells</h4>
                                            { (widgets?.data?.widget?.length > 0) && widgets?.data?.widget?.find(foundWidget => foundWidget == 'rbc') 
                                                ? <button 
                                                    onClick={ async () => {
                                                        await deleteWidget('rbc'); 
                                                        await getWidgets(); 
                                                    } } 
                                                    className="bg-transparent border-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill text-danger" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                        </svg>
                                                    </button> 
                                                : <button 
                                                    onClick={ async () => {
                                                        await createWidget('rbc'); 
                                                        await getWidgets(); 
                                                    } }
                                                    className="bg-transparent border-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill text-info" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                                        </svg>
                                                    </button> }
                                        </article>
                                        <article className="d-flex align-items-center gap-3">
                                            <h4 className="fs-6 mt-2">Sugar Level</h4>
                                            { (widgets?.data?.widget?.length > 0) && widgets?.data?.widget?.find(foundWidget => foundWidget == 'sugar_level') 
                                                ? <button 
                                                    onClick={ async () => {
                                                        await deleteWidget('sugar_level'); 
                                                        await getWidgets(); 
                                                    } } 
                                                    className="bg-transparent border-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill text-danger" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                        </svg>
                                                    </button> 
                                                : <button 
                                                    onClick={ async () => {
                                                        await createWidget('sugar_level'); 
                                                        await getWidgets(); 
                                                    } }
                                                    className="bg-transparent border-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill text-info" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                                        </svg>
                                                    </button> }
                                        </article>
                                        <article className="d-flex align-items-center gap-3">
                                            <h4 className="fs-6 mt-2">Water Level</h4>
                                            { (widgets?.data?.widget?.length > 0) && widgets?.data?.widget?.find(foundWidget => foundWidget == 'water_level') 
                                                ? <button 
                                                    onClick={ async () => {
                                                        await deleteWidget('water_level'); 
                                                        await getWidgets(); 
                                                    } } 
                                                    className="bg-transparent border-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill text-danger" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                        </svg>
                                                    </button> 
                                                : <button 
                                                    onClick={ async () => {
                                                        await createWidget('water_level'); 
                                                        await getWidgets(); 
                                                    } }
                                                    className="bg-transparent border-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill text-info" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                                        </svg>
                                                    </button> }
                                        </article>
                                        <article className="d-flex align-items-center gap-3">
                                            <h4 className="fs-6 mt-2">White Blood Cells</h4>
                                            { (widgets?.data?.widget?.length > 0) && widgets?.data?.widget?.find(foundWidget => foundWidget == 'wbc') 
                                                ? <button 
                                                    onClick={ async () => {
                                                        await deleteWidget('wbc'); 
                                                        await getWidgets(); 
                                                    } } 
                                                    className="bg-transparent border-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill text-danger" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                        </svg>
                                                    </button> 
                                                : <button 
                                                    onClick={ async () => {
                                                        await createWidget('wbc'); 
                                                        await getWidgets(); 
                                                    } }
                                                    className="bg-transparent border-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill text-info" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                                        </svg>
                                                    </button> }
                                        </article>
                                    </section>
                                </div>
                            </div>
                        </section>
                    </div>
                </section>
            </section>

            <section className="appointments pt-4 gap-3">
                <section className="upcoming border border-1 border-tertiary border-radius-25 px-3 py-4 d-flex flex-column gap-2 align-items-start">
                    {/* { console.log(appointments) } */}
                    <h2 className="fs-5">Upcoming appointment</h2>
                    <section className="doctor w-100 gap-3">
                        <div className="info d-flex flex-column align-items-start gap-1">
                            {/* <span>Dr. Sasmita Ra&nbsp; */}
                            <span>
                                {/* Dr.{ appointments?.data?.upcoming_appointment?.patient?.first_name }&nbsp; */}
                                <span>
                                    { (user?.user?.role == 'patient') ? 'Dr. ' : '' }
                                    {/* { (((user?.role == 'general_practitioner') || (user?.role == 'gynaecologist')) 
                                            ? 'Dr. ' : '') } */}
                                </span>
                                <span>
                                    { (user?.user?.role == 'patient') 
                                        ? ((appointments?.data?.upcoming_appointment?.professional?.first_name)?.slice(0,1)?.toUpperCase() + (appointments?.data?.upcoming_appointment?.professional?.first_name)?.slice(1)) 
                                            + ' ' 
                                            + ((appointments?.data?.upcoming_appointment?.professional?.last_name)?.slice(0,1)?.toUpperCase() + (appointments?.data?.upcoming_appointment?.professional?.last_name)?.slice(1))
                                        : ((appointments?.data?.upcoming_appointment?.patient?.first_name)?.slice(0,1)?.toUpperCase() + (appointments?.data?.upcoming_appointment?.patient?.first_name)?.slice(1)) 
                                            + ' ' 
                                            + ((appointments?.data?.upcoming_appointment?.patient?.last_name)?.slice(0,1)?.toUpperCase() + (appointments?.data?.upcoming_appointment?.patient?.last_name)?.slice(1)) }
                                </span>
                                <span className="chat-with-doctor ms-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left-text"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                        <path
                                            d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                                    </svg>
                                </span>
                            </span>
                            <span className="badge rounded-pill text-bg-info">
                                { (user?.user?.role == 'patient') 
                                    ? ((appointments?.data?.upcoming_appointment?.professional?.role)?.slice(0,1)?.toUpperCase() + (appointments?.data?.upcoming_appointment?.professional?.role)?.slice(1))  
                                    : ((user?.user?.role == 'general_practitioner')
                                        || (user?.user?.role == 'gynaecologist') 
                                        || (user?.user?.role == 'paediatrician')) 
                                    ? 'Patient' 
                                    : '' }
                            </span>
                        </div>
                        <div className="image">
                            <picture>
                                <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" media="(orientation: portrait)" />
                                <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" className="object-fit-cover border-radius-25" alt="" />
                            </picture>
                        </div>
                    </section>
                    <section className="about-doctor-patient pt-3">
                        <p>
                            { (user?.user?.role == 'patient') 
                                ? (appointments?.data?.upcoming_appointment?.professional?.bio) 
                                : (appointments?.data?.upcoming_appointment?.patient?.bio)}
                        </p>
                    </section> 
                    <section className="appointment-schedule w-100 d-flex justify-content-between">
                        <div className="appointment-date-time d-flex align-items-center gap-1">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-event"
                                viewBox="0 0 16 16">
                                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                    <path
                                        d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                </svg>
                            </span>
                            <span>
                                { appointments?.data?.upcoming_appointment?.proposed_date_start }&nbsp;
                                { dayjs(appointments?.data?.upcoming_appointment?.proposed_month_start).format('MMM.') }&nbsp;
                                { dayjs(appointments?.data?.upcoming_appointment?.proposed_year_start).format('YYYY') }&nbsp;
                                { appointments?.data?.upcoming_appointment?.proposed_time_start }&nbsp;
                            </span>
                        </div>
                        <div className="appointment-length d-flex align-items-center gap-1">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stopwatch-fill"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584l.013-.012.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354-.012.012A6.97 6.97 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0" />
                                </svg>
                            </span>
                            <span>
                                { timeDifference !== null ? timeDifference : '0' }&nbsp;minute{ (timeDifference < 2) ? '' : 's' }
                            </span>
                        </div>
                    </section>
                    <section className="w-100 d-flex justify-content-end pt-3">
                        <Link 
                            to={ route('home.appointments.index') } 
                            className="btn btn-sm btn-warning border-radius-35 text-decoration-none">Check Appointments</Link>
                    </section>
                </section>

                <section className="latest border border-1 border-tertiary border-radius-25 px-3 py-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="fs-5">Latest Appointments</h2>
                        <Link to={ route('home.appointments.create') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center py-0 my-0">
                            <span className="mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-plus-lg"
                                    viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                                </svg>
                            </span>
                            <span>Schedule</span>
                        </Link>
                    </div>
                    <small className="text-secondary">Stay updated on your recent healthcare visits</small>
                    <section className="table-responsive pt-3 w-100">
                        { (appointments?.data?.latest_appointments?.length > 0) 
                            ?   <table className="table table-borderless">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Patient/Doctor Name</th>
                                            <th scope="col" className="d-none d-md-table-cell">Contact</th>
                                            <th scope="col" className="d-none d-md-table-cell">Date, Time</th>
                                            <th scope="col">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { (appointments?.data?.latest_appointments?.map((appointment, index) => {
                                            return (
                                                <tr key={ appointment?._id }>
                                                    <th scope="row">{ index + 1 }</th>
                                                    <td>{ (user?.user?.role == 'patient') 
                                                            ? ((appointment?.professional?.first_name)?.slice(0,1)?.toUpperCase() + (appointment?.professional?.first_name)?.slice(1)) 
                                                                + ' ' 
                                                                + ((appointment?.professional?.last_name)?.slice(0,1)?.toUpperCase() + (appointment?.professional?.last_name)?.slice(1))
                                                            : ((appointment?.patient?.first_name)?.slice(0,1)?.toUpperCase() + (appointment?.patient?.first_name)?.slice(1)) 
                                                                + ' ' 
                                                                + ((appointment?.patient?.last_name)?.slice(0,1)?.toUpperCase() + (appointment?.patient?.last_name)?.slice(1)) }</td>
                                                    <td className="d-none d-md-table-cell">
                                                        { (user?.user?.role == 'patient') 
                                                            ? (appointment?.professional?.phone ? appointment?.professional?.phone : appointment?.professional?.email) 
                                                            : (appointment?.patient?.phone ? appointment?.patient?.phone : appointment?.patient?.email) }
                                                    </td>
                                                    <td className="d-none d-md-table-cell">
                                                        {/* { dayjs(appointment?.proposed_date_start).format('D') }&nbsp; */}
                                                        { appointment?.proposed_date_start }&nbsp;
                                                        { dayjs(appointment?.proposed_month_start).format('MMM.') }&nbsp;
                                                        { dayjs(appointment?.proposed_year_start).format('YYYY') }&nbsp;
                                                        {/* { dayjs(appointment?.proposed_time_start).format('h:mm') }&nbsp; */}
                                                        { appointment?.proposed_time_start }&nbsp;
                                                        {/* { appointment?.proposed_year_start }&nbsp;
                                                        { appointment?.proposed_time_start }&nbsp; */}
                                                    </td>
                                                    {/* { dayjs(diagnosisSegmentItem?.created_at).format('ddd, MMM D, YYYY h:mm A') } */}
                                                    <td>
                                                        { (appointment?.status == 'cancelled') 
                                                            ? <span className="badge rounded-pill text-bg-danger">Cancelled</span> 
                                                            : (appointment?.status == 'ongoing') 
                                                            ? <span className="badge rounded-pill text-bg-success">Ongoing</span> 
                                                            : (appointment?.status == 'pending') 
                                                            ? <span className="badge rounded-pill text-bg-warning">Pending</span> 
                                                            : (appointment?.status == 'took-place') 
                                                            ? <span className="badge rounded-pill text-bg-secondary">Took place</span> 
                                                            : '' }
                                                        
                                                    </td>
                                                </tr>
                                            )
                                        }))}

                                    </tbody>
                                </table>
                            :   <div className="py-4 text-center">
                                    <span className="text-center">You have no appointments yet.</span>
                                </div>}
                    </section>
                </section>
            </section>
        </Layout>
    )
}
