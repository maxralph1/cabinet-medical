import { useEffect, useState, useRef } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import swal from 'sweetalert2'; 
import { useAppointmentsSpecificDate } from '@/hooks/useAppointmentsSpecificDate.jsx'; 
import { useAppointments } from '@/hooks/useAppointments.jsx'; 
import { useAppointment } from '@/hooks/useAppointment.jsx'; 
import PaginationMeter from '@/components/PaginationMeter.jsx';
import PaginationLinks from '@/components/PaginationLinks.jsx';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const scrollToElement = useRef(null);

    const [selectedDate, setSelectedDate] = useState(new Date()); 
    const [alreadyScrolled, setAlreadyScrolled] = useState(false);

    const handleDateChange = async (date) => {
        setSelectedDate(date); 
        // await getAppointments(new Date(date)?.toISOString()?.split('T')[0]); 
        await getAppointments(new Date(date)?.toLocaleDateString('en-CA')); 
        // console.log('specific date appointments:', appointments); 
        // if (scrollToElement.current) {
        //     scrollToElement.current.scrollIntoView({ behavior: 'smooth' }); 
        // }
        // window.scrollBy({ top: 1500, left: 0, behavior: 'smooth' }); 

        setTimeout(() => {
            if (alreadyScrolled) {
                return;
            }
            window.scrollBy({ top: 200, left: 0, behavior: 'smooth' }); 
            setAlreadyScrolled(true);
            // if (scrollToElement.current) {
            //     scrollToElement.current.scrollIntoView({ behavior: 'smooth' }); 
            // }
        }, 2000); 
    }; 

    const [appointmentView, setAppointmentView] = useState('calendar');
    const [appointmentQuery, setAppointmentQuery] = useState({
        range: 'all', 
        page: 1, 
        limit: 10, 
    }); 

    let appointments, getAppointments, loading; 

    if (appointmentView === 'list') {
        ({ appointments, getAppointments, loading } = useAppointments(appointmentQuery));
    } else {
        ({ appointments, getAppointments, loading } = useAppointmentsSpecificDate());
    }
    console.log(appointments); 

    useEffect(() => {
        if (appointmentView) {
            console.log('Appointments have changed:', appointmentView);
            // You can perform additional actions when appointments change
        }
    }, [appointmentView, appointments]);

    // const { appointments, getAppointments, loading } =
    //     appointmentView === 'calendar'
    //         ? useAppointment() // Use the 'useAppointment' hook
    //         : useAppointmentsSpecificDate(); // Use the 'useAppointmentsSpecificDate' hook

    // useEffect(() => {
    //     if (appointments) {
    //         console.log('Appointments have changed:', appointments);
    //         // Handle any side effects related to appointments change
    //     }
    // }, [appointments]);

    const { deleteAppointment } = useAppointment(); 


    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">Appointments</h2>
                <Link to={ route('home.appointments.create') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center py-0">
                    <span className="mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                            className="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                        </svg>
                    </span>
                    <span>Add</span>
                </Link>
            </div>

            <div className="d-flex justify-content-end pt-3">
                <span>
                    { ((appointmentView == 'list') && (appointments?.data?.length > 0)) 
                        && <PaginationMeter 
                                current_page={ appointments?.meta?.current_page } 
                                limit={ appointments?.meta?.limit } 
                                total_pages={ appointments?.meta?.total_pages } 
                                total_results={ appointments?.meta?.total_results } /> } 
                </span> 
            </div>

            <div className="fs-6 d-flex align-items-center row-gap-1 column-gap-2 flex-wrap">
                <span 
                    type="button" 
                    onClick={ async () => {
                        await setAppointmentView('calendar')
                        await getAppointments(); 
                    } }
                    className="d-flex flex-wrap column-gap-3 row-gap-2 pt-2 pb-3">
                    <span className="btn btn-sm btn-outline-secondary border-radius-35 py-0">
                        Calendar View
                    </span>
                </span>
                <span 
                    type="button" 
                    onClick={ async () => {
                        await setAppointmentView('list')
                        await getAppointments(appointmentQuery);
                    } }
                    className="d-flex flex-wrap column-gap-3 row-gap-2 pt-2 pb-3">
                    <span className="btn btn-sm btn-outline-secondary border-radius-35 py-0">
                        List View
                    </span>
                </span>
            </div> 

            <div className="view-options">
                { (appointmentView == 'list') 
                    ? (
                        <>
                        <section className="pt-3">
                            { (loading == true) 
                                ?   <div className="py-4 d-flex justify-content-center align-items-center">
                                        <div className="spinner-grow" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>  
                                    </div>
                                        : ((loading == false) && ((appointments?.data?.length < 1) || appointments?.length < 1)) 
                                            ?   <div className="py-4 d-flex justify-content-center align-items-center">
                                                    <span>There are no appointments for the specified criteria.</span>
                                                </div> 
                                                    : ((loading == false) && (appointments?.data?.length > 0)) 
                                                        ?   <ul className="appointments list-unstyled d-flex flex-column align-items-start gap-3">
                                                                { (appointments?.data
                                                                                ?.sort((a, b) => new Date(b.proposed_schedule_start) - new Date(a.proposed_schedule_start))
                                                                                ?.map((appointmentUnit, index) => {
                                                                    return (
                                                                        <li key={ appointmentUnit?._id } className="appointment w-100 border border-1 border-radius-25 d-flex flex-column px-3 py-4">
                                                                            <section className="cta d-flex justify-content-end gap-2">
                                                                                <div>
                                                                                    <span 
                                                                                        type="button" 
                                                                                        data-bs-toggle="modal" data-bs-target={`#appointmentUnit${appointmentUnit?._id}Modal`}>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-view-list text-info" viewBox="0 0 16 16">
                                                                                            <path d="M3 4.5h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM1 2a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 2m0 12a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 14"/>
                                                                                        </svg>
                                                                                    </span>

                                                                                    <section className="modal fade" id={`appointmentUnit${appointmentUnit?._id}Modal`} tabIndex="-1" aria-labelledby={`appointmentUnit${appointmentUnit?._id}ModalLabel`}>
                                                                                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                                                            <div className="modal-content">
                                                                                                <div className="modal-header d-flex justify-content-between align-items-center pb-2">
                                                                                                    <h3 className="fs-6" id={`appointmentUnit${appointmentUnit?._id}ModalLabel`}>
                                                                                                        <span>Appointment with </span>
                                                                                                        { (appointmentUnit?.user == appointmentUnit?.patient?._id) 
                                                                                                            ?   <span className="">
                                                                                                                    <span className="fw-semibold">{ ((appointmentUnit?.professional?.first_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.professional?.first_name)?.slice(1)) + ' ' + ((appointmentUnit?.professional?.last_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.professional?.last_name)?.slice(1)) }</span>
                                                                                                                </span>
                                                                                                                : (appointmentUnit?.user == appointmentUnit?.professional?._id) 
                                                                                                                    ?   <span className="">
                                                                                                                            <span className="fw-semibold">{ ((appointmentUnit?.patient?.first_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.patient?.first_name)?.slice(1)) + ' ' + ((appointmentUnit?.patient?.last_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.patient?.last_name)?.slice(1)) }</span>
                                                                                                                        </span> 
                                                                                                                            : 'N/A' 
                                                                                                        }
                                                                                                    </h3>
                                                                                                    <button type="button" data-bs-dismiss="modal" aria-label="Close" className="border-0 bg-transparent" style={{ marginTop: '-0.75rem' }}>
                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                                                        </svg>
                                                                                                    </button>
                                                                                                </div>
                                                                                                <div className="modal-body pt-3">
                                                                                                    <h4 className="fs-6">
                                                                                                        <span>
                                                                                                            { (appointmentUnit?.user == appointmentUnit?.patient?._id) 
                                                                                                                ?   <span className="d-flex flex-column">
                                                                                                                        <span className="fw-semibold">{ ((appointmentUnit?.professional?.first_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.professional?.first_name)?.slice(1)) + ' ' + ((appointmentUnit?.professional?.last_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.professional?.last_name)?.slice(1)) }</span>
                                                                                                                        <span>{ appointmentUnit?.professional?.role }</span>
                                                                                                                    </span>
                                                                                                                    : (appointmentUnit?.user == appointmentUnit?.professional?._id) 
                                                                                                                        ?   <div className="d-flex flex-column">
                                                                                                                                <p className="pt-0 d-flex flex-column">
                                                                                                                                    <span className="fw-semibold ">
                                                                                                                                        { ((appointmentUnit?.patient?.first_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.patient?.first_name)?.slice(1)) + ' ' + ((appointmentUnit?.patient?.last_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.patient?.last_name)?.slice(1)) }
                                                                                                                                    </span>
                                                                                                                                    <span className="fw-light">Patient</span>
                                                                                                                                </p>
                                                                                                                                <p className="pt-2 py-0">Schedule:&nbsp;
                                                                                                                                    <span className="fw-semibold">
                                                                                                                                        { dayjs(appointmentUnit?.proposed_schedule_start).format('MMM D, YYYY (HH:mm') + ' - ' + dayjs(appointmentUnit?.proposed_schedule_end).format('HH:mm)') }
                                                                                                                                    </span>
                                                                                                                                </p>
                                                                                                                                <p className="pt-2 py-0">Status:&nbsp;
                                                                                                                                    <span className="">
                                                                                                                                        { (appointmentUnit?.status == 'cancelled') 
                                                                                                                                            ? <span className="badge rounded-pill text-bg-danger">Cancelled</span> 
                                                                                                                                            : (appointmentUnit?.status == 'ongoing') 
                                                                                                                                            ? <span className="badge rounded-pill text-bg-success">Ongoing</span> 
                                                                                                                                            : (appointmentUnit?.status == 'pending') 
                                                                                                                                            ? <span className="badge rounded-pill text-bg-warning">Pending</span> 
                                                                                                                                            : (appointmentUnit?.status == 'took-place') 
                                                                                                                                            ? <span className="badge rounded-pill text-bg-secondary">Took place</span> 
                                                                                                                                            : '' }
                                                                                                                                    </span>
                                                                                                                                </p>
                                                                                                                                <p className="pt-2 py-0">Purpose:&nbsp;<span className="fw-semibold">{ appointmentUnit?.purpose ?? 'N/A' }</span></p>
                                                                                                                                <p className="pt-2 py-0">Notes:&nbsp;<span className="fw-semibold">{ appointmentUnit?.notes ?? 'N/A' }</span></p>
                                                                                                                            </div> 
                                                                                                                                : 'N/A' 
                                                                                                            }
                                                                                                        </span>
                                                                                                    </h4>
                                                                                                        
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </section>
                                                                                </div>
                                                                                <span>
                                                                                    <Link to={ route('home.appointments.edit', { id: appointmentUnit?._id }) }>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill text-warning" viewBox="0 0 16 16">
                                                                                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                                                                        </svg>
                                                                                    </Link>
                                                                                </span>
                                                                                <span 
                                                                                    onClick={ () => {
                                                                                        swal.fire({
                                                                                            text: "Are you sure you want to delete this?", 
                                                                                            showCancelButton: true,
                                                                                            confirmButtonColor: "#FF0000",
                                                                                            cancelButtonColor: "#414741",
                                                                                            confirmButtonText: "Yes!", 
                                                                                            cancelButtonText: "No!", 
                                                                                            customClass: {
                                                                                                confirmButton: 'swal2-confirm-button', 
                                                                                                cancelButton: 'swal2-cancel-button'
                                                                                            }, 
                                                                                        }).then((result) => {
                                                                                            if (result.isConfirmed) {
                                                                                                deleteAppointment(appointmentUnit?._id); 
                                                                                                // setAppointments([]);
                                                                                                getAppointments(appointmentQuery); 
                                                                                            }
                                                                                        });
                                                                                    }} 
                                                                                    className="cursor-pointer">
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill text-danger" viewBox="0 0 16 16">
                                                                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                                        </svg>
                                                                                </span>
                                                                            </section>
                                                                            <section className="doctor-patient d-flex justify-content-start gap-4 flex-wrap pt-3">
                                                                                <picture>
                                                                                    <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" media="(orientation: portrait)" />
                                                                                    <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" className="object-fit-cover border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                                                                                </picture>
                                                                                <div className="d-flex flex-column">
                                                                                    { (appointmentUnit?.type == 'external')
                                                                                        ? 
                                                                                            (
                                                                                                <span>
                                                                                                    { ((appointmentUnit?.patient_first_name) && (appointmentUnit?.patient_last_name))
                                                                                                        ? (
                                                                                                            <span>
                                                                                                            { ((appointmentUnit?.patient_first_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.patient_first_name)?.slice(1)) + ' ' + ((appointmentUnit?.patient_last_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.patient_last_name)?.slice(1)) }
                                                                                                        </span>
                                                                                                        ) : <span>(External Client)</span> }
                                                                                                </span>
                                                                                                
                                                                                            )
                                                                                        : (
                                                                                            <span>
                                                                                                { (appointmentUnit?.user == appointmentUnit?.patient?._id) 
                                                                                                    ?   <span className="d-flex flex-column">
                                                                                                            <span className="fw-semibold">{ ((appointmentUnit?.professional?.first_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.professional?.first_name)?.slice(1)) + ' ' + ((appointmentUnit?.professional?.last_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.professional?.last_name)?.slice(1)) }</span>
                                                                                                            <span>{ appointmentUnit?.professional?.role }</span>
                                                                                                        </span>
                                                                                                        : (appointmentUnit?.user == appointmentUnit?.professional?._id) 
                                                                                                            ?   <span className="d-flex flex-column">
                                                                                                                    <span className="fw-semibold">{ ((appointmentUnit?.patient?.first_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.patient?.first_name)?.slice(1)) + ' ' + ((appointmentUnit?.patient?.last_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.patient?.last_name)?.slice(1)) }</span>
                                                                                                                    <span>Patient</span>
                                                                                                                    <span className="pt-2">Purpose:&nbsp;<span className="fw-semibold">{ appointmentUnit?.purpose ?? 'N/A' }</span></span>
                                                                                                                </span> 
                                                                                                                    : 'N/A' 
                                                                                                }
                                                                                            </span>
                                                                                        ) }                                                                                  
                                                                                </div>
                                                                            </section>
                                                                            <section className="schedule w-100 d-flex justify-content-end gap-4 row-gap-2 flex-wrap pt-3">
                                                                                <div className="appointment-date-time d-flex align-items-center gap-1">
                                                                                    <span>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                                                            className="bi bi-calendar-event" viewBox="0 0 16 16">
                                                                                            <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                                                                            <path
                                                                                                d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                                                                        </svg>
                                                                                    </span>
                                                                                    <span>
                                                                                        { dayjs(appointmentUnit?.proposed_schedule_start).format('MMM D, YYYY, HH:mm') }
                                                                                    </span>
                                                                                </div>
                                                                                <div className="appointment-length d-flex align-items-center gap-1">
                                                                                    <span>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                                                            className="bi bi-stopwatch-fill" viewBox="0 0 16 16">
                                                                                            <path
                                                                                                d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584l.013-.012.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354-.012.012A6.97 6.97 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0" />
                                                                                        </svg>
                                                                                    </span>
                                                                                    <span>
                                                                                        { dayjs(appointmentUnit?.proposed_schedule_end)?.diff(appointmentUnit?.proposed_schedule_start, 'minute', true) +
                                                                                            dayjs(appointmentUnit?.proposed_schedule_end)?.diff(appointmentUnit?.proposed_schedule_start, 'minute', true) !== null 
                                                                                                ? dayjs(appointmentUnit?.proposed_schedule_end)?.diff(appointmentUnit?.proposed_schedule_start, 'minute', true) 
                                                                                                : '0' }&nbsp;minute{ (dayjs(appointmentUnit?.proposed_schedule_end)?.diff(appointmentUnit?.proposed_schedule_start, 'minute', true) < 2) ? '' : 's'
                                                                                            || '30 minutes' }
                                                                                    </span>
                                                                                </div>
                                                                            </section>
                                                                        </li> 
                                                                    )
                                                                })) }
                                                            </ul>
                                                            : <></> }
                        </section>

                        { (appointments?.data?.length > 0) 
                            && <PaginationLinks 
                                items={ appointments } 
                                get_items={ getAppointments } 
                                query={ appointmentQuery } 
                                set_query={ setAppointmentQuery } /> } 
                                
                        </>
                    )
                    : 
                        (
                            <>
                            <section className="schedule-appointment d-flex justify-content-between align-items-center flex-wrap gap-3 column-gap-5 p-3">
                                    {/* Date Picker */}
                                    <div className="date-picker mb-3">
                                        {/* <label>Select Date:</label> */}
                                        <Calendar
                                            onChange={handleDateChange}
                                            value={selectedDate}
                                            minDate={new Date()} // Disable past dates
                                            // calendarType="US"
                                            className="border-radius-15" 
                                            style={{ width: '100% !important' }}
                                        />
                                    </div>

                                    
                                </section>

                                { (appointments?.data?.length > 0) && (
                                    <section id="existing-appointments" className="existing-appointments d-flex flex-column gap-3 pt-5">
                                        <h4 className="fw-semibold border-bottom pb-1 fs-5">{ appointments?.data?.length } Appointment{(appointments?.data?.length > 1) && 's'} On Your Schedule</h4>
            
                                        <section className="pt-1">
                                            { (loading == true) 
                                                ?   <div className="py-4 d-flex justify-content-center align-items-center">
                                                        <div className="spinner-grow" role="status">
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>  
                                                    </div>
                                                        : ((loading == false) && ((appointments?.data?.length < 1) || appointments?.length < 1)) 
                                                            ?   <div className="py-4 d-flex justify-content-center align-items-center">
                                                                    <span>There are no appointments for the specified criteria.</span>
                                                                </div> 
                                                                    : ((loading == false) && (appointments?.data?.length > 0)) 
                                                                        ?   <ul className="appointments list-unstyled d-flex flex-column align-items-start gap-3">
                                                                                { (appointments?.data
                                                                                                ?.sort((a, b) => new Date(b.proposed_schedule_start) - new Date(a.proposed_schedule_start))
                                                                                                ?.map((appointmentUnit, index) => {
                                                                                    return (
                                                                                        <li key={ appointmentUnit?._id } className="appointment w-100 border border-1 border-radius-25 d-flex flex-column px-3 py-4">    
                                                                                            <section className="doctor-patient d-flex justify-content-start gap-4 flex-wrap pt-3">
                                                                                                <picture>
                                                                                                    <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" media="(orientation: portrait)" />
                                                                                                    <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" className="object-fit-cover border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                                                                                                </picture>
                                                                                                <div className="d-flex flex-column">
                                                                                                    <span>
                                                                                                        { (appointmentUnit?.user == appointmentUnit?.patient?._id) 
                                                                                                            ?   <span className="d-flex flex-column">
                                                                                                                    <span className="fw-semibold">{ ((appointmentUnit?.professional?.first_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.professional?.first_name)?.slice(1)) + ' ' + ((appointmentUnit?.professional?.last_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.professional?.last_name)?.slice(1)) }</span>
                                                                                                                    <span>{ appointmentUnit?.professional?.role }</span>
                                                                                                                </span>
                                                                                                                : (appointmentUnit?.user == appointmentUnit?.professional?._id) 
                                                                                                                    ?   <span className="d-flex flex-column">
                                                                                                                            <span className="fw-semibold">{ ((appointmentUnit?.patient?.first_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.patient?.first_name)?.slice(1)) + ' ' + ((appointmentUnit?.patient?.last_name)?.slice(0,1)?.toUpperCase()+(appointmentUnit?.patient?.last_name)?.slice(1)) }</span>
                                                                                                                            <span>Patient</span>
                                                                                                                            <span className="pt-2">Purpose:&nbsp;<span className="fw-semibold">{ appointmentUnit?.purpose ?? 'N/A' }</span></span>
                                                                                                                        </span> 
                                                                                                                            : 'N/A' 
                                                                                                        }
                                                                                                    </span>
                                                                                                    
                                                                                                    
                                                                                                </div>
                                                                                            </section>
                                                                                            <section className="schedule w-100 d-flex justify-content-end gap-4 row-gap-2 flex-wrap pt-3">
                                                                                                <div className="appointment-date-time d-flex align-items-center gap-1">
                                                                                                    <span>
                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                                                                            className="bi bi-calendar-event" viewBox="0 0 16 16">
                                                                                                            <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                                                                                            <path
                                                                                                                d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                                                                                        </svg>
                                                                                                    </span>
                                                                                                    <span>
                                                                                                        { dayjs(appointmentUnit?.proposed_schedule_start).format('MMM D, YYYY, HH:mm') }
                                                                                                    </span>
                                                                                                </div>
                                                                                                <div className="appointment-length d-flex align-items-center gap-1">
                                                                                                    <span>
                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                                                                            className="bi bi-stopwatch-fill" viewBox="0 0 16 16">
                                                                                                            <path
                                                                                                                d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584l.013-.012.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354-.012.012A6.97 6.97 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0" />
                                                                                                        </svg>
                                                                                                    </span>
                                                                                                    <span>
                                                                                                        { dayjs(appointmentUnit?.proposed_schedule_end)?.diff(appointmentUnit?.proposed_schedule_start, 'minute', true) +
                                                                                                        dayjs(appointmentUnit?.proposed_schedule_end)?.diff(appointmentUnit?.proposed_schedule_start, 'minute', true) !== null 
                                                                                                            ? dayjs(appointmentUnit?.proposed_schedule_end)?.diff(appointmentUnit?.proposed_schedule_start, 'minute', true) 
                                                                                                            : '0' }&nbsp;minute{ (dayjs(appointmentUnit?.proposed_schedule_end)?.diff(appointmentUnit?.proposed_schedule_start, 'minute', true) < 2) ? '' : 's'
                                                                                                        || '30 minutes' }
                                                                                                    </span>
                                                                                                </div>
                                                                                            </section>
                                                                                        </li> 
                                                                                    )
                                                                                })) }
                                                                            </ul>
                                                                            : <></> }
                                        </section>
            
                                    </section> 
                                ) }

                                {/* <span ref={scrollToElement}></span> */}
                            </>
                        )
                    }
            </div>
        </Layout>
    )
}
