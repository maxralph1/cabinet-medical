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

    const [appointmentRange, setAppointmentRange] = useState(''); 
    const [regimenRange, setRegimenRange] = useState('all'); 
    const [revenueRange, setRevenueRange] = useState(''); 
    const [userCountRange, setUserCountRange] = useState(''); 

    const { appointments, getAppointments } = useAppointments(appointmentRange); 
    const { regimens } = useRegimens(regimenRange); 
    const { revenue, getRevenue } = useRevenue(revenueRange); 
    const { userCount, getUserCount } = useUserCount(userCountRange); 
    const { widgets, getWidgets } = useWidgets(); 
    const { widgetValues } = useWidgetValues();
    const { widget, createWidget, deleteWidget } = useWidget(); 
    console.log(appointments); 
    console.log(regimens); 
    console.log('revenue:', revenue); 
    console.log(userCount); 
    console.log('widgets:', widgets); 
    console.log('widgetValues:', widgetValues); 

    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [closestAppointment, setClosestAppointment] = useState(null); 
    console.log(closestAppointment)

    useEffect(() => {
        if (appointments?.data?.upcoming_appointments) {
            setUpcomingAppointments(appointments?.data?.upcoming_appointments);
        }
    }, [appointments]); 

    // const getClosestAppointment = (appointments) => {
    //     const now = new Date();
    //     const currentDateTime = now.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm' format

    //     // Find the appointment happening today
    //     const todayAppointment = appointments?.find((appointment) => {
    //         const proposedStartDateTime = appointment?.proposed_schedule_start;
    //         return proposedStartDateTime === currentDateTime;
    //     });

    //     if (todayAppointment) {
    //         // If an appointment is happening today, return it
    //         return todayAppointment;
    //     }

    //     // If no appointment is happening today, find the closest future appointment
    //     const futureAppointments = appointments?.filter((appointment) => {
    //         const proposedStartDateTime = appointment?.proposed_schedule_start;
    //         return proposedStartDateTime > currentDateTime;
    //     });

    //     // If there are future appointments, return the closest one
    //     if (futureAppointments?.length > 0) {
    //         const closestFutureAppointment = futureAppointments?.reduce((closest, appointment) => {
    //             const proposedStartDateTime = appointment?.proposed_schedule_start;
    //             return !closest || proposedStartDateTime < closest ? proposedStartDateTime : closest;
    //         });

    //         return futureAppointments?.find((appointment) => {
    //             const proposedStartDateTime = appointment?.proposed_schedule_start;
    //             return proposedStartDateTime === closestFutureAppointment;
    //         });
    //     }

    //     // If no future appointments are found, return null
    //     return null;
    // }; 

    /** Get only the number of future(upcoming) appointments */
    const currentDate = dayjs();

    const futureAppointments = appointments?.data?.upcoming_appointments?.filter(futureAppointment => dayjs(futureAppointment?.proposed_schedule_start).isAfter(currentDate));
    /** End of Get only the number of future(upcoming) appointments */

    /** Get the next (immediate) upcoming appointment */
    useEffect(() => {
        // if (upcomingAppointments.length > 0) {
        //     const closest = getClosestAppointment(upcomingAppointments);
        //     setClosestAppointment(closest);
        // }

        if (futureAppointments?.length > 0) {
            const closest = futureAppointments?.sort((a, b) => 
                dayjs(a?.proposed_schedule_start).isBefore(dayjs(b.proposed_schedule_start)) ? -1 : 1
            )[0];
            setClosestAppointment(closest);
        }
    // }, [upcomingAppointments]); 
    }, [futureAppointments]); 
    /** End of Get the next (immediate) upcoming appointment */

    const handleChatSubmit = async (e) => {
        e.preventDefault(); 

        const formData = new FormData(); 
        // appointment?.data?.notes && formData.append('notes', appointment?.data?.notes); 
        // appointment?.data?.purpose && formData.append('purpose', appointment?.data?.purpose); 

        // await createAppointment(formData); 
        // await appointment?.setData({}); 
    };


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
                    <span>You have&nbsp;
                        { (futureAppointments?.length<1) && <span className="fw-semibold">no appointments in the coming days.</span> }

                        { (futureAppointments?.length>0) && (
                            <>
                                <Link to={ route('home.appointments.index') } className="fw-semibold text-warning">
                                    { futureAppointments?.length }&nbsp;
                                    appointment{ futureAppointments?.length>1 && 's' }
                                </Link>
                                <span className="">&nbsp;in the coming days.</span>
                            </>
                        ) }
                    </span>

                    <span>You have&nbsp;
                        { (regimens?.data?.length<1) && <span className="fw-semibold">no uncompleted regimen in the coming days.</span> }

                        { (regimens?.data?.length>0) && (
                            <>
                                <Link to={ route('home.regimens.index') } className="fw-semibold text-warning">
                                    { regimens?.data?.length } uncompleted regimen{ regimens?.data?.length>1 && 's' }
                                </Link>
                                <span>&nbsp;{ regimens?.data?.length>1 && '. Ensure to take your medication.' }</span>
                            </>
                        ) }
                    </span>
                </div>
            </div>
            
            <section className="dashboard-meters w-100">
                <section className="admin-meters gap-3 pt-4">

                    { (user?.user?.role != 'patient') && (
                        <article className="revenue border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start">
                            <div className="w-100 d-flex justify-content-between">
                                <span className="d-flex justify-content-center align-items-center border-radius-50 p-2"
                                style={{ backgroundColor: '#f2f2f2' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-dollar"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z" />
                                    </svg>
                                </span>
                                <div className="dropdown">
                                    <span type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                                        </svg>
                                    </span>
                                    <ul class="dropdown-menu border-radius-25 px-3">
                                        <li>
                                            <span 
                                                type="button" 
                                                onClick={ async () => { 
                                                    setRevenueRange('today'); 
                                                    await getRevenue(revenueRange); 
                                                }}
                                                className="dropdown-item">
                                                    Today
                                            </span>
                                        </li>
                                        <li>
                                            <span 
                                                type="button" 
                                                onClick={ async () => { 
                                                    setRevenueRange('this-week'); 
                                                    await getRevenue(revenueRange); 
                                                }}
                                                className="dropdown-item">
                                                    This Week
                                            </span>
                                        </li>
                                        <li>
                                            <span 
                                                type="button" 
                                                onClick={ async () => { 
                                                    setRevenueRange('this-month');
                                                    await getRevenue(revenueRange); 
                                                }}
                                                className="dropdown-item">
                                                    This Month
                                            </span>
                                        </li>
                                        <li>
                                            <span 
                                                type="button" 
                                                onClick={ async () => { 
                                                    setRevenueRange('this-year'); 
                                                    await getRevenue(revenueRange);  
                                                }}
                                                className="dropdown-item">
                                                    This Year
                                            </span>
                                        </li>
                                        <li>
                                            <span 
                                                type="button" 
                                                onClick={ async () => { 
                                                    setRevenueRange(''); 
                                                    await getRevenue(revenueRange); 
                                                }}
                                                className="dropdown-item">
                                                    All
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <span>Total Revenue</span>
                            <span className="fs-4 fw-semibold">{ (Number(revenue?.data?.total_medical_bills_amount) + Number(revenue?.data?.total_invoice_paid)) || '0.00' }<span className="fs-5">MUR</span></span>
                            <span className="bg-body-tertiary"><small>Updated&nbsp;{ dayjs(revenue?.data?.latest_update?.updated_at).format('MMMM D, YYYY') }</small></span>
                        </article>
                    ) }
                    
                    <article className="appointments border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start">
                        <div className="w-100 d-flex justify-content-between">
                            <span className="d-flex justify-content-center align-items-center border-radius-50 p-2"
                            style={{ backgroundColor: '#f2f2f2' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-event"
                                viewBox="0 0 16 16">
                                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                    <path
                                        d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                </svg>
                            </span>
                            <div className="dropdown">
                                <span type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                                    </svg>
                                </span>
                                <ul class="dropdown-menu border-radius-25 px-3">
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setAppointmentRange('today'); 
                                                await getAppointments(appointmentRange); 
                                            }}
                                            className="dropdown-item">
                                                Today
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setAppointmentRange('this-week'); 
                                                await getAppointments(appointmentRange); 
                                            }}
                                            className="dropdown-item">
                                                This Week
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setAppointmentRange('this-month');
                                                await getAppointments(appointmentRange); 
                                            }}
                                            className="dropdown-item">
                                                This Month
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setAppointmentRange('this-year'); 
                                                await getAppointments(appointmentRange);  
                                            }}
                                            className="dropdown-item">
                                                This Year
                                        </span>
                                    </li>
                                    <li>
                                        <span 
                                            type="button" 
                                            onClick={ async () => { 
                                                setAppointmentRange(''); 
                                                await getAppointments(appointmentRange); 
                                            }}
                                            className="dropdown-item">
                                                All
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <span>Total Appointments</span>
                        <span className="fs-4 fw-semibold">{ Number(appointments?.data?.appointments_count) || 0 }</span>
                        <span className="bg-body-tertiary"><small>Updated&nbsp;{ dayjs(appointments?.data?.latest_update?.updated_at).format('MMMM D, YYYY') }</small></span>
                    </article>
                    
                    { (user?.user?.role != 'patient') && (
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
                            <span className="bg-body-tertiary"><small>Updated&nbsp;{ dayjs(userCount?.data?.latest_update?.created_at).format('MMMM D, YYYY') }</small></span>
                        </article>
                    ) }
                    
                    { (user?.user?.role != 'patient') && (
                        <article className="patients border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start">
                            <div className="w-100 d-flex justify-content-between">
                                <span className="d-flex justify-content-center align-items-center border-radius-50 p-2"
                                style={{ backgroundColor: '#f2f2f2' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-standing"
                                    viewBox="0 0 16 16">
                                        <path
                                            d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M6 6.75v8.5a.75.75 0 0 0 1.5 0V10.5a.5.5 0 0 1 1 0v4.75a.75.75 0 0 0 1.5 0v-8.5a.25.25 0 1 1 .5 0v2.5a.75.75 0 0 0 1.5 0V6.5a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v2.75a.75.75 0 0 0 1.5 0v-2.5a.25.25 0 0 1 .5 0" />
                                    </svg>
                                </span>
                                <div className="dropdown">
                                    <span type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                                        </svg>
                                    </span>
                                    <ul class="dropdown-menu border-radius-25 px-3">
                                        <li>
                                            <span 
                                                type="button" 
                                                onClick={ async () => { 
                                                    setUserCountRange('today'); 
                                                    await getUserCount(userCountRange); 
                                                }}
                                                className="dropdown-item">
                                                    Today
                                            </span>
                                        </li>
                                        <li>
                                            <span 
                                                type="button" 
                                                onClick={ async () => { 
                                                    setUserCountRange('this-week'); 
                                                    await getUserCount(userCountRange); 
                                                }}
                                                className="dropdown-item">
                                                    This Week
                                            </span>
                                        </li>
                                        <li>
                                            <span 
                                                type="button" 
                                                onClick={ async () => { 
                                                    setUserCountRange('this-month');
                                                    await getUserCount(userCountRange); 
                                                }}
                                                className="dropdown-item">
                                                    This Month
                                            </span>
                                        </li>
                                        <li>
                                            <span 
                                                type="button" 
                                                onClick={ async () => { 
                                                    setUserCountRange('this-year'); 
                                                    await getUserCount(userCountRange);  
                                                }}
                                                className="dropdown-item">
                                                    This Year
                                            </span>
                                        </li>
                                        <li>
                                            <span 
                                                type="button" 
                                                onClick={ async () => { 
                                                    setUserCountRange(''); 
                                                    await getUserCount(userCountRange); 
                                                }}
                                                className="dropdown-item">
                                                    All
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <span>Total Patients</span>
                            <span className="fs-4 fw-semibold">
                                { Number(userCount?.data?.patients) || 0 }
                            </span>
                            <span className="bg-body-tertiary"><small>Updated&nbsp;{ dayjs(userCount?.data?.latest_update?.created_at).format('MMMM D, YYYY') }</small></span>
                        </article>
                    ) }
                </section>

                <section className="patient-meters align-items-center d-flex gap-3 flex-wrap pt-4">
                    { (widgets?.data?.widget?.length > 0) && (widgets?.data?.widget?.map((widget, index) => {
                        return (
                            <article key={ index } className={`widget border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start`} style={{ width: '253.5px' }}>
                                <div className="w-100 d-flex justify-content-between align-items-center">
                                    <span>{ (widget == 'heart_rate') ? 'Heart Rate' 
                                                : (widget == 'liquid_volume') ? 'Liquid Volume' 
                                                : (widget == 'rbc') ? 'Red Blood Cells' 
                                                : (widget == 'blood_glucose_level') ? 'Blood Glucose' 
                                                // : (widget == 'water_level') ? 'Water Level' 
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
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-moisture"
                                                                        viewBox="0 0 16 16">
                                                            <path
                                                                d="M13.5 0a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V7.5h-1.5a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V15h-1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5zM7 1.5l.364-.343a.5.5 0 0 0-.728 0l-.002.002-.006.007-.022.023-.08.088a29 29 0 0 0-1.274 1.517c-.769.983-1.714 2.325-2.385 3.727C2.368 7.564 2 8.682 2 9.733 2 12.614 4.212 15 7 15s5-2.386 5-5.267c0-1.05-.368-2.169-.867-3.212-.671-1.402-1.616-2.744-2.385-3.727a29 29 0 0 0-1.354-1.605l-.022-.023-.006-.007-.002-.001zm0 0-.364-.343zm-.016.766L7 2.247l.016.019c.24.274.572.667.944 1.144.611.781 1.32 1.776 1.901 2.827H4.14c.58-1.051 1.29-2.046 1.9-2.827.373-.477.706-.87.945-1.144zM3 9.733c0-.755.244-1.612.638-2.496h6.724c.395.884.638 1.741.638 2.496C11 12.117 9.182 14 7 14s-4-1.883-4-4.267" />
                                                        </svg>
                                                    ) : (widget == 'rbc') 
                                                        ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-droplet-fill" viewBox="0 0 16 16">
                                                                <path d="M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6M6.646 4.646l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448c.82-1.641 1.717-2.753 2.093-3.13"/>
                                                            </svg>
                                                        ) : (widget == 'blood_glucose_level') 
                                                            ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-boxes" viewBox="0 0 16 16">
                                                                    <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434zM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567zM7.5 9.933l-2.75 1.571v3.134l2.75-1.571zm1 3.134 2.75 1.571v-3.134L8.5 9.933zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567zm2.242-2.433V3.504L8.5 5.076V8.21zM7.5 8.21V5.076L4.75 3.504v3.134zM5.258 2.643 8 4.21l2.742-1.567L8 1.076zM15 9.933l-2.75 1.571v3.134L15 13.067zM3.75 14.638v-3.134L1 9.933v3.134z"/>
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
                                {/* { console.log(widgetValues?.data?.length > 0) && widgetValues?.data?.find(foundWidget => foundWidget?.blood_glucose_level?.result)} */}
                                <span className="fs-6 fw-semibold">
                                    { (widget == 'heart_rate') 
                                        ? <span>{ (widgetValues?.data?.heart_rate != null) ? ((widgetValues?.data?.heart_rate?.result)?.match(/\d+(\.\d+)?/)[0] + 'BPM') : 'N/A'}</span>
                                            : (widget == 'liquid_volume') 
                                            ? <span>{ (widgetValues?.data?.liquid_volumne != null) ? ((widgetValues?.data?.liquid_volumne?.result)?.match(/\d+(\.\d+)?/)[0] + '/L') : 'N/A'}</span> 
                                                : (widget == 'rbc') 
                                                ? <span>{ (widgetValues?.data?.rbc != null) ? ((widgetValues?.data?.rbc?.result)?.match(/\d+(\.\d+)?/)[0] + '/μL') : 'N/A'}</span>
                                                // ? <span>/<span className="micro">μ</span>L</span> 
                                                    : (widget == 'blood_glucose_level') 
                                                    ? <span>{ (widgetValues?.data?.blood_glucose_level != null) ? ((widgetValues?.data?.blood_glucose_level?.result)?.match(/\d+(\.\d+)?/)[0] + '/mL') : 'N/A'}</span>
                                                        : (widget == 'wbc') 
                                                        ? <span>{ (widgetValues?.data?.wbc != null) ? ((widgetValues?.data?.wbc?.result)?.match(/\d+(\.\d+)?/)[0] + '/μL') : 'N/A'}</span>
                                                        // ? <span>/<span className="micro">μ</span>L</span>  
                                        : '' }</span>
                                <span className="bg-body-tertiary">
                                    <small>Updated&nbsp;
                                        { (widget == 'heart_rate') 
                                        ? <span>{ (widgetValues?.data?.heart_rate != null) ? dayjs(widgetValues?.data?.heart_rate?.updated_at)?.format('MMM DD, YYYY, HH:mm') : '———'}</span>
                                            : (widget == 'liquid_volume') 
                                            ? <span>{ (widgetValues?.data?.liquid_volumne != null) ? dayjs(widgetValues?.data?.liquid_volumne?.updated_at)?.format('MMM DD, YYYY, HH:mm') : '———'}</span> 
                                                : (widget == 'rbc') 
                                                ? <span>{ (widgetValues?.data?.rbc != null) ? dayjs(widgetValues?.data?.rbc?.updated_at)?.format('MMM DD, YYYY, HH:mm') : '———'}</span>
                                                // ? <span>/<span className="micro">μ</span>L</span> 
                                                    : (widget == 'blood_glucose_level') 
                                                    ? <span>{ (widgetValues?.data?.blood_glucose_level != null) ? dayjs(widgetValues?.data?.blood_glucose_level?.updated_at)?.format('MMM DD, YYYY, HH:mm') : '———'}</span>
                                                        : (widget == 'wbc') 
                                                        ? <span>{ (widgetValues?.data?.wbc != null) ? dayjs(widgetValues?.data?.wbc?.updated_at)?.format('MMM DD, YYYY, HH:mm') : '———'}</span>
                                                        // ? <span>/<span className="micro">μ</span>L</span>  
                                        : '' }
                                    </small>
                                </span>
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
                                            <h4 className="fs-6 mt-2">Blood Glucose</h4>
                                            { (widgets?.data?.widget?.length > 0) && widgets?.data?.widget?.find(foundWidget => foundWidget == 'blood_glucose_level') 
                                                ? <button 
                                                    onClick={ async () => {
                                                        await deleteWidget('blood_glucose_level'); 
                                                        await getWidgets(); 
                                                    } } 
                                                    className="bg-transparent border-0">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill text-danger" viewBox="0 0 16 16">
                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                        </svg>
                                                    </button> 
                                                : <button 
                                                    onClick={ async () => {
                                                        await createWidget('blood_glucose_level'); 
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
                    { closestAppointment ? (
                        <>
                            <h2 className="fs-5">Upcoming appointment</h2>
                            <section className="doctor w-100 gap-3">
                                <div className="info d-flex flex-column align-items-start gap-1">
                                    {/* <span>Dr. Sasmita Ra&nbsp; */}
                                    <span className="d-flex flex-wrap row-gap-3 column-gap-4">
                                        <div className="d-flex flex-column align-items-start">
                                            <div>
                                                {/* Dr.{ appointments?.data?.upcoming_appointment?.patient?.first_name }&nbsp; */}
                                                <span>
                                                    { (user?.user?.role == 'patient') ? 'Dr. ' : '' }
                                                    {/* { (((user?.role == 'general_practitioner') || (user?.role == 'gynaecologist')) 
                                                            ? 'Dr. ' : '') } */}
                                                </span>
                                                <span>
                                                    { (user?.user?.role == 'patient') 
                                                        ? ((closestAppointment?.professional?.first_name)?.slice(0,1)?.toUpperCase() + (closestAppointment?.professional?.first_name)?.slice(1)) 
                                                            + ' ' 
                                                            + ((closestAppointment?.professional?.last_name)?.slice(0,1)?.toUpperCase() + (closestAppointment?.professional?.last_name)?.slice(1))
                                                        : ((closestAppointment?.patient?.first_name)?.slice(0,1)?.toUpperCase() + (closestAppointment?.patient?.first_name)?.slice(1)) 
                                                            + ' ' 
                                                            + ((closestAppointment?.patient?.last_name)?.slice(0,1)?.toUpperCase() + (closestAppointment?.patient?.last_name)?.slice(1)) }
                                                </span>
                                            </div>
                                            <span className="badge rounded-pill text-bg-info">
                                                { ((user?.user?.role == 'patient') && (closestAppointment?.professional?.role == 'general_practitioner')) 
                                                    ? 'General Practitioner' 
                                                        : ((user?.user?.role == 'patient') && (closestAppointment?.professional?.role == 'gynaecologist'))
                                                            ? 'Gynaecologist' 
                                                        : ((user?.user?.role == 'patient') && (closestAppointment?.professional?.role == 'laboratory_scientist'))
                                                            ? 'Laboratory Scientist' 
                                                        : ((user?.user?.role == 'patient') && (closestAppointment?.professional?.role == 'nurse'))
                                                            ? 'Nurse' 
                                                        : (user?.user?.role == 'patient')
                                                            ? 'Patient'
                                                        : ''
                                                }
                                            </span>
                                        </div>
                                        
                                        <span className="chat-with-doctor-patient justify-self-start">
                                            <span 
                                                type="button" 
                                                data-bs-toggle="modal" 
                                                data-bs-target={`#chatModal`}
                                                className="btn btn-sm btn-outline-warning border-radius-25 py-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-left-fill" viewBox="0 0 16 16">
                                                        <path d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                                    </svg>&nbsp;
                                                    <span>Chat</span>
                                            </span>
                                            <section className="modal fade" id={`chatModal`} tabIndex="-1" aria-labelledby={`chatModalLabel`}>
                                                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                    <div className="modal-content">
                                                        <div className="modal-header d-flex justify-content-between align-items-center">
                                                            <h3 className="fs-6" id={`chatModalLabel`}>Quick Message to&nbsp;
                                                                <span>
                                                                    { (user?.user?.role == 'patient') 
                                                                        ? ((closestAppointment?.professional?.first_name)?.slice(0,1)?.toUpperCase() + (closestAppointment?.professional?.first_name)?.slice(1)) 
                                                                            + ' ' 
                                                                            + ((closestAppointment?.professional?.last_name)?.slice(0,1)?.toUpperCase() + (closestAppointment?.professional?.last_name)?.slice(1))
                                                                        : ((closestAppointment?.patient?.first_name)?.slice(0,1)?.toUpperCase() + (closestAppointment?.patient?.first_name)?.slice(1)) 
                                                                            + ' ' 
                                                                            + ((closestAppointment?.patient?.last_name)?.slice(0,1)?.toUpperCase() + (closestAppointment?.patient?.last_name)?.slice(1)) }
                                                                </span>
                                                            </h3>
                                                            <button type="button" data-bs-dismiss="modal" aria-label="Close" className="border-0 bg-transparent" style={{ marginTop: '-0.25rem' }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <section className="modal-body gap-2 pt-3">
                                                            <form onSubmit={ handleChatSubmit } id="chat-form" className="chat-form">
                                                                <div className="row">
                                                                    <div className="form-floating mb-3">
                                                                        <textarea 
                                                                            // value={ blogCategory?.data?.description ?? '' }
                                                                            // id="description"
                                                                            className="form-control" 
                                                                            style={{ height: '100px' }}  
                                                                            // onChange={ e => blogCategory.setData({
                                                                            //     ...blogCategory?.data,
                                                                            //     description: e.target.value,
                                                                            // }) } 
                                                                            placeholder="Enter your message ..." 
                                                                            required></textarea>
                                                                        <label htmlFor="message">Message</label>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="d-flex justify-content-end pt-3">
                                                                        <button type="submit" className="btn btn-outline-secondary border-radius-25">Send</button>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </section>
                                                    </div>
                                                </div>
                                            </section>
                                        </span>
                                    </span>
                                    
                                </div>
                                <div className="image">
                                    <picture>
                                        <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" media="(orientation: portrait)" />
                                        <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" className="object-fit-cover border-radius-25" alt="" style={{ width: '100%'}} />
                                    </picture>
                                </div>
                            </section>
                            <section className="about-doctor-patient pt-3">
                                <p>
                                    { (user?.user?.role == 'patient') 
                                        ? (closestAppointment?.professional?.bio) 
                                        : (closestAppointment?.patient?.bio)}
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
                                        { dayjs(closestAppointment?.proposed_schedule_start)?.format('MMM. D YYYY, HH:mm') }&nbsp;
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
                                        { dayjs(closestAppointment?.proposed_schedule_end)?.diff(closestAppointment?.proposed_schedule_start, 'minute', true) }&nbsp;minute{ ((dayjs(closestAppointment?.proposed_schedule_end)?.diff(closestAppointment?.proposed_schedule_start, 'minute', true)) > 1) && 's' }
                                    </span>
                                </div>
                            </section>
                            <section className="w-100 d-flex justify-content-end pt-3">
                                <Link 
                                    to={ route('home.appointments.index') } 
                                    className="btn btn-sm btn-warning border-radius-35 text-decoration-none">Check Appointments</Link>
                            </section>
                        </>
                    ) : (
                        <div className="h-100 w-100 d-flex justify-content-center align-items-center">
                            <p>You have no upcoming appointment.</p>
                        </div>
                    ) }
                </section>

                <section className="latest border border-1 border-tertiary border-radius-25 px-3 py-4">
                    <div className="d-flex justify-content-between">
                        <h2 className="fs-5">Latest Appointments</h2>
                        <Link to={ route('home.appointments.create') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold h-100 d-flex align-items-center py-0 my-0">
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
                                                    <th scope="row">
                                                        <Link 
                                                            to={ route('home.appointments.show', { id: appointment?._id }) } 
                                                            className="text-decoration-none">
                                                                { index + 1 }
                                                        </Link>
                                                    </th>
                                                    <td>
                                                        <Link
                                                            to={ route('home.appointments.show', { id: appointment?._id }) } 
                                                            className="text-decoration-none">
                                                                { (appointment?.appointment_request) && (
                                                                    ((appointment?.appointment_request?.patient_first_name)?.slice(0,1)?.toUpperCase() + (appointment?.appointment_request?.patient_first_name)?.slice(1)) 
                                                                        + ' ' 
                                                                        + ((appointment?.appointment_request?.patient_last_name)?.slice(0,1)?.toUpperCase() + (appointment?.appointment_request?.patient_last_name)?.slice(1))
                                                                ) }

                                                                { ((!appointment?.appointment_request) && (user?.user?.role == 'patient')) 
                                                                    ? ((appointment?.professional?.first_name)?.slice(0,1)?.toUpperCase() + (appointment?.professional?.first_name)?.slice(1)) 
                                                                        + ' ' 
                                                                        + ((appointment?.professional?.last_name)?.slice(0,1)?.toUpperCase() + (appointment?.professional?.last_name)?.slice(1))
                                                                    : ((!appointment?.appointment_request) && (user?.user?.role != 'patient'))
                                                                        ? ((appointment?.patient?.first_name)?.slice(0,1)?.toUpperCase() + (appointment?.patient?.first_name)?.slice(1)) 
                                                                        + ' ' 
                                                                        + ((appointment?.patient?.last_name)?.slice(0,1)?.toUpperCase() + (appointment?.patient?.last_name)?.slice(1)) 
                                                                    : '' }
                                                        </Link>
                                                    </td>
                                                    <td className="d-none d-md-table-cell">
                                                        <Link 
                                                            to={ route('home.appointments.show', { id: appointment?._id }) } 
                                                            className="text-decoration-none">
                                                                { (appointment?.appointment_request) && (
                                                                    appointment?.appointment_request?.patient_phone ?? appointment?.appointment_request?.patient_email
                                                                ) }

                                                                { ((!appointment?.appointment_request) && (user?.user?.role == 'patient')) 
                                                                    ? (appointment?.professional?.phone ? appointment?.professional?.phone : appointment?.professional?.email) 
                                                                    : (appointment?.patient?.phone ? appointment?.patient?.phone : appointment?.patient?.email) }
                                                        </Link>
                                                    </td>
                                                    <td className="d-none d-md-table-cell">
                                                        <Link
                                                            to={ route('home.appointments.show', { id: appointment?._id }) } 
                                                            className="text-decoration-none">
                                                                { dayjs(appointment?.proposed_schedule_start)?.format('MMM. D, YYYY, HH:mm') }&nbsp;
                                                        </Link>
                                                    </td>
                                                    {/* { dayjs(diagnosisSegmentItem?.created_at).format('ddd, MMM D, YYYY h:mm A') } */}
                                                    <td>
                                                        <Link
                                                            to={ route('home.appointments.show', { id: appointment?._id }) } 
                                                            className="text-decoration-none">
                                                                { (appointment?.status == 'cancelled') 
                                                                    ? <span className="badge rounded-pill text-bg-danger">Cancelled</span> 
                                                                    : (appointment?.status == 'pending-approval') 
                                                                    ? <span className="badge rounded-pill text-bg-warning">Pending Approval</span> 
                                                                    : (appointment?.status == 'declined-approval') 
                                                                    ? <span className="badge rounded-pill text-bg-danger">Declined Approval</span> 
                                                                    : (appointment?.status == 'approved') 
                                                                    ? <span className="badge rounded-pill text-bg-warning">Scheduled</span> 
                                                                    : (appointment?.status == 'ongoing') 
                                                                    ? <span className="badge rounded-pill text-bg-success">Ongoing</span> 
                                                                    : (appointment?.status == 'took-place') 
                                                                    ? <span className="badge rounded-pill text-bg-secondary">Took place</span> 
                                                                    : '' }
                                                        </Link>
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
