import { useEffect, useState } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import Constants from '@/utils/Constants.jsx'; 
import swal from 'sweetalert2'; 
import { usePatients } from '@/hooks/usePatients.jsx'; 
import { useAppointmentsSpecificDate } from '@/hooks/useAppointmentsSpecificDate.jsx'; 
import { useAppointment } from '@/hooks/useAppointment.jsx'; 
import { getDayOfWeek, getDaysOfMonth, getAllDatesOfYear } from '@/utils/ScheduleManager.js'; 
import SelectedUserComponent from '@/components/protected/nested-components/SelectedUserComponent';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Create() {
    const [currentYear, setCurrentYear] = useState();
    const [currentMonth, setCurrentMonth] = useState();
    const [currentDate, setCurrentDate] = useState(); 

    const [appointmentQuery, setAppointmentQuery] = useState({
        year: currentYear, 
        month: currentMonth, 
        date: currentDate, 
    }); 

    console.log(currentYear, currentMonth, currentDate); 

    const { appointments, getAppointments, loading } = useAppointmentsSpecificDate(); 
    const { appointment, createAppointment } = useAppointment(); 

    const [calendarSchedules, setCalendarSchedules] = useState(); 
    const [dateSchedules, setDateSchedules] = useState();  
    // console.log(dateSchedules); 

    // let calendarSchedules; 
    // console.log(calendarSchedules);

    const year = 2025;
    console.log(getAllDatesOfYear(2025));

    const [selectedPatient, setSelectedPatient] = useState(null); 
    console.log(selectedPatient); 
    const [searchKey, setSearchKey] = useState(''); 



    const [userQuery, setUserQuery] = useState({
        range: 'all', 
        page: 1, 
        limit: 10, 
        search_key: searchKey, 
    }); 
    const { patients, getPatients, setPatients } = usePatients(userQuery); 
    console.log(patients); 

    const [selectedUserItem, setSelectedUserItem] = useState(null); 

    const handleSubmit = async e => {
        e.preventDefault(); 

        // if ((selectedUserItem) && (selectedDiagnosisTypes?.length>0)) {
        if (selectedUserItem) {
            const formData = new FormData(); 
            selectedUserItem && formData.append('patient', selectedUserItem?._id); 
            currentYear && formData.append('proposed_year_start', currentYear); 
            currentMonth && formData.append('proposed_month_start', currentMonth); 
            currentDate && formData.append('proposed_date_start', currentDate); 
            appointment?.data?.proposed_time_start && formData.append('proposed_time_start', appointment?.data?.proposed_time_start); 
            appointment?.data?.proposed_time_end && formData.append('proposed_time_end', appointment?.data?.proposed_time_end); 

            await createAppointment(formData); 
            await appointment?.setData({}); 
        } else {
            swal.fire({
                text: `Please select a patient.`, 
                color: '#900000', 
                width: 325, 
                position: 'top', 
                showConfirmButton: false
            });
        }
    }

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">
                    <Link 
                        to={ route('home.appointments.index') } className="">Appointments</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>Add Appointment</span>
                </h2>
            </div>

                

            <section className="pt-4">
                <SelectedUserComponent 
                    selectedUserItem={ selectedUserItem } 
                    setSelectedUserItem={ setSelectedUserItem } />

                <section className="appointment-booking pt-5">
                    <span className="d-flex align-items-center justify-content-between">
                        <h3 className="border-bottom pb-1 fs-5">Appointment Booking</h3>
                        <a href="#add-new-appointment" className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
                            <span className="mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                                    className="bi bi-plus-lg" viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                                </svg>
                            </span>
                            <span>Add</span>
                        </a>
                    </span>

                    <section className="calendar pt-3">
                        <div className="years d-flex justify-content-start align-items-center flex-wrap gap-3">
                            <article 
                                onClick={ () => {
                                    setCalendarSchedules(getAllDatesOfYear(new Date().getFullYear())); 
                                    setCurrentYear(new Date().getFullYear()); 
                                    console.log(calendarSchedules); 
                                } }
                                className={`cursor-pointer ${(currentYear == (new Date().getFullYear())) && 'bg-secondary text-white'}`}>
                                    { new Date().getFullYear() }
                            </article>
                            <article 
                                onClick={ () => {
                                    setCalendarSchedules(getAllDatesOfYear(new Date().getFullYear() + 1)); 
                                    setCurrentYear((new Date().getFullYear() + 1)); 
                                    console.log(calendarSchedules); 
                                } }
                                className={`cursor-pointer ${(currentYear == (new Date().getFullYear() + 1)) && 'bg-secondary text-white'}`}>
                                    { new Date().getFullYear() + 1 }
                            </article>
                        </div>
                        <div className="months">
                            <div className="nav-scroller">
                                <nav className="months nav justify-content-between gap-2 py-3" style={{ width: '100vw', overflowY: 'hidden' }}>
                                    { (calendarSchedules?.length > 0) && calendarSchedules?.map((schedule, index) => {
                                        console.log('schedule', schedule)
                                        return (
                                            <article 
                                                key={ index } 
                                                onClick={ () => {
                                                    setDateSchedules(calendarSchedules[index]); 
                                                    setCurrentMonth(schedule?.month); 
                                                } } 
                                                className={`cursor-pointer ${((schedule?.month) == currentMonth) && 'bg-secondary text-white'}`}>
                                                { (schedule?.month == 1) 
                                                    ?  'January' 
                                                : (schedule?.month == 2) 
                                                    ? 'February' 
                                                : (schedule?.month == 3) 
                                                    ? 'March' 
                                                : (schedule?.month == 4) 
                                                    ? 'April' 
                                                : (schedule?.month == 5) 
                                                    ? 'May' 
                                                : (schedule?.month == 6) 
                                                    ? 'June' 
                                                : (schedule?.month == 7) 
                                                    ? 'July' 
                                                : (schedule?.month == 8) 
                                                    ? 'August' 
                                                : (schedule?.month == 9) 
                                                    ? 'September' 
                                                : (schedule?.month == 10) 
                                                    ? 'October' 
                                                : (schedule?.month == 11) 
                                                    ? 'November'
                                                : 'December'
                                                }
                                            </article>
                                        )
                                    }) }
                                </nav>
                            </div> 
                        </div>
                        <div className="dates">
                            <div className="nav-scroller">
                                <nav className="dates nav justify-content-between gap-2 py-3" style={{ width: '100vw', overflowY: 'hidden' }}>
                                    { (dateSchedules?.days?.length > 0) && dateSchedules?.days?.map((date, index) => {
                                        return (
                                            <article 
                                                key={ index } 
                                                onClick={ async () => {
                                                    await setCurrentDate(date?.date); 
                                                    await getAppointments(appointmentQuery);
                                                } } 
                                                className={`d-flex flex-column cursor-pointer ${((date?.date) == currentDate) && 'bg-secondary text-white'}`}>
                                                <span>{ date?.date }</span>
                                                <span className={`text-secondary ${((date?.date) == currentDate) && 'text-white'}`}><small>{ date?.dayOfWeek }</small></span>
                                            </article>
                                        )
                                    })}
                                </nav>
                            </div> 
                        </div>
                    </section>

                    <section className="new-appointment pt-5" id="add-new-appointment">
                        <div className="time-range">
                            <h4 className="border-bottom fw-semibold fs-6">
                                Proposed Time Slot&nbsp;
                                <span className='text-secondary'><small>(for new appointment)</small></span>
                            </h4>

                            <a href="#existing-appointments" className="text-secondary">
                                <small>Click to check already existing (conflicting) appointments on your selected date.</small>
                            </a>
                        
                            <div className='pt-3'>
                                <form onSubmit={ handleSubmit } id="appointment-form" className="appointment-form" encType="multipart/form-data">
                                    <div className="row">
                                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                                            <input 
                                                type="time" 
                                                min="09:00" max="18:00" 
                                                id="proposed_time_start" 
                                                className="form-control"  
                                                onChange={ e => appointment.setData({
                                                    ...appointment?.data,
                                                    proposed_time_start: e.target.value,
                                                }) }
                                                placeholder="09:00" />
                                            <label htmlFor="proposed_time_start">Proposed Start Time</label>
                                        </div>
                                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                                            <input 
                                                type="time" 
                                                min="09:00" max="18:00" 
                                                id="proposed_time_end" 
                                                className="form-control" 
                                                onChange={ e => appointment.setData({
                                                    ...appointment?.data,
                                                    proposed_time_end: e.target.value,
                                                }) }  
                                                placeholder="09:00" />
                                            <label htmlFor="proposed_time_end">Proposed End Time</label>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end pt-3">
                                        <button type="submit" className="btn btn-outline-secondary border-radius-25">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>

                    <section id="existing-appointments" className="existing-appointments d-flex flex-column gap-3 pt-5">
                        <h4 className="fw-semibold border-bottom fs-5">Appointments On Your Schedule</h4>


                        {/* <article className="border-radius-35 p-2 d-flex align-items-center gap-3" style={{ backgroundColor: '#f2f2f2', maxWidth: '500px' }}>
                            <picture>
                                <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                    media="(orientation: portrait)" />
                                <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                    className="object-fit-cover border border-1 border-secondary border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                            </picture>
                            <div className="d-flex flex-column">
                                <span className="fw-semibold">Meet with Dr. Smith</span>
                                <span>20:00 - 21:00</span>
                            </div>
                        </article> */} 

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
                                                                { (appointments?.data?.map((appointment, index) => {
                                                                    return (
                                                                        <li key={ appointment?._id } className="appointment w-100 border border-1 border-radius-25 d-flex flex-column px-3 py-4">
                                                                            {/* <span className="">#
                                                                                { (appointments?.meta?.current_page != 1) 
                                                                                    ? (((appointments?.meta?.current_page - 1) * results_limit) + (index + 1))
                                                                                    : appointments?.meta?.current_page * (index + 1) }
                                                                            </span> */}

                                                                            <section className="doctor-patient d-flex justify-content-start gap-4 flex-wrap pt-3">
                                                                                <picture>
                                                                                    <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" media="(orientation: portrait)" />
                                                                                    <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" className="object-fit-cover border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                                                                                </picture>
                                                                                <div className="d-flex flex-column">
                                                                                    <span>
                                                                                        { (appointment?.user == appointment?.patient?._id) 
                                                                                            ?   <span className="d-flex flex-column">
                                                                                                    <span className="fw-semibold">{ ((appointment?.professional?.first_name)?.slice(0,1)?.toUpperCase()+(appointment?.professional?.first_name)?.slice(1)) + ' ' + ((appointment?.professional?.last_name)?.slice(0,1)?.toUpperCase()+(appointment?.professional?.last_name)?.slice(1)) }</span>
                                                                                                    <span>{ appointment?.professional?.role }</span>
                                                                                                </span>
                                                                                                : (appointment?.user == appointment?.professional?._id) 
                                                                                                    ?   <span className="d-flex flex-column">
                                                                                                            <span className="fw-semibold">{ ((appointment?.patient?.first_name)?.slice(0,1)?.toUpperCase()+(appointment?.patient?.first_name)?.slice(1)) + ' ' + ((appointment?.patient?.last_name)?.slice(0,1)?.toUpperCase()+(appointment?.patient?.last_name)?.slice(1)) }</span>
                                                                                                            <span>Patient</span>
                                                                                                            <span className="pt-2">Purpose:&nbsp;<span className="fw-semibold">Pregnancy first trimester investigation</span></span>
                                                                                                        </span> 
                                                                                                            : 'N/A' 
                                                                                        }
                                                                                    </span>
                                                                                    
                                                                                    
                                                                                </div>
                                                                            </section>
                                                                            <section className="schedule w-100 d-flex justify-content-end gap-4 flex-wrap pt-3">
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
                                                                                        { dayjs(appointment?.proposed_year_start+'-'+appointment?.proposed_month_start+'-'+appointment?.proposed_date_start).format('MMM D, YYYY') }, { appointment?.proposed_time_start }
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
                                                                                        {/* 30 minutes
                                                                                        const date1 = dayjs('2019-01-25')
                                                                                        date1.diff('2018-06-05', 'month', true) */}
                                                                                        { dayjs(appointment?.proposed_time_end)?.diff(appointment?.proposed_time_start, 'minute', true) || '30 minutes' }
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
                </section>
            </section>
        </Layout>
    )
}
