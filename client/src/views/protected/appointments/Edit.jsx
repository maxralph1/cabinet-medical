import { useEffect, useState } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import swal from 'sweetalert2'; 
import { usePatients } from '@/hooks/usePatients.jsx'; 
import { useAppointment } from '@/hooks/useAppointment.jsx'; 
import { useAppointmentsSpecificDate } from '@/hooks/useAppointmentsSpecificDate.jsx'; 
// import SelectedUserComponent from '@/components/protected/nested-components/SelectedUserComponent';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Edit() {
    const params = useParams();
    const { id } = useParams(); 
    console.log(id); 
    const { appointment, updateAppointment } = useAppointment(params?.id); 
    console.log(appointment); 

    const [selectedPatient, setSelectedPatient] = useState(appointment?.data?.patient); 
    console.log(selectedPatient); 
    console.log(appointment?.data?.data?.patient); 

    const [searchKey, setSearchKey] = useState(''); 

    const [userQuery, setUserQuery] = useState({
        range: 'all', 
        page: 1, 
        limit: 10, 
        search_key: searchKey, 
    }); 
    const { patients, getPatients, setPatients } = usePatients(userQuery); 
    console.log(patients); 

    const [selectedUserItem, setSelectedUserItem] = useState(appointment?.data?.patient); 

    /** Appointment Date, Time Scheduling */
    const { appointments, getAppointments, loading } = useAppointmentsSpecificDate(appointment?.data?.proposed_schedule_date); 
    console.log(appointments); 

    const handleDateChange = async (date) => {
        setSelectedDate(date); 
        // await getAppointments(new Date(date)?.toISOString()?.split('T')[0]); 
        await getAppointments(new Date(date)?.toLocaleDateString('en-CA')); 
        // console.log('specific date appointments:', appointments); 
    }; 
    // console.log(appointments?.data);

    const constructDate = (date, time) => {
        const [hours, minutes] = time.split(':');
        const newDate = new Date(date);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        return newDate.toISOString();
    }; 

    const extractTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0'); 
        const minutes = date.getMinutes().toString().padStart(2, '0'); 
        
        return `${hours}:${minutes}`; // Return time in HH:mm format 
    }; 

    const [selectedDate, setSelectedDate] = useState(appointment?.data?.proposed_schedule_date); 
    const [startTime, setStartTime] = useState(extractTime(appointment?.data?.proposed_schedule_start)); 
    const [endTime, setEndTime] = useState(extractTime(appointment?.data?.proposed_schedule_end)); 

    useEffect(() => {
        if (appointment?.data?.proposed_schedule_start) {
            setStartTime(extractTime(appointment?.data?.proposed_schedule_start));
        }

        if (appointment?.data?.proposed_schedule_end) {
            setEndTime(extractTime(appointment?.data?.proposed_schedule_end));
        }

        if (appointment?.data?.proposed_schedule_date) {
            setSelectedDate(appointment?.data?.proposed_schedule_date);
        } 
    }, [appointment?.data?.proposed_schedule_start, appointment?.data?.proposed_schedule_end, appointment?.data?.proposed_schedule_date]);

    const handleUpdate = async (e) => {
        e.preventDefault(); 

        if (!selectedDate) {
            setSelectedDate(appointment?.data?.proposed_schedule_date);
        } 

        console.log(selectedDate);

        // const startDateTime = constructDate(selectedDate, e.target.proposed_schedule_start.value);
        const startDateTime = constructDate(selectedDate, (startTime || e.target.proposed_schedule_start.value));
        // const endDateTime = constructDate(selectedDate, e.target.proposed_schedule_end.value);
        const endDateTime = constructDate(selectedDate, (endTime || e.target.proposed_schedule_end.value));
        if (new Date(endDateTime) <= new Date(startDateTime)) {
            // console.log("End time must be after start time."); 
            swal.fire({
                text: `End time must be after start time.`, 
                color: '#900000', 
                width: 325, 
                position: 'top', 
                showConfirmButton: false
            });
            return;
        };

        const proposed_schedule_start = startDateTime;
        const proposed_schedule_end = endDateTime;

        console.log('keys:', proposed_schedule_start, proposed_schedule_end);

        const formData = new FormData(); 
        startTime && formData.append('proposed_schedule_start', proposed_schedule_start); 
        endTime && formData.append('proposed_schedule_end', proposed_schedule_end); 
        selectedDate && formData.append('proposed_schedule_date', new Date(selectedDate)?.toLocaleDateString('en-CA')); 
        appointment?.data?.notes && formData.append('notes', appointment?.data?.notes); 
        appointment?.data?.purpose && formData.append('purpose', appointment?.data?.purpose); 
        appointment?.data?.status && formData.append('status', appointment?.data?.status); 

        await updateAppointment(formData); 
        await appointment?.setData({}); 

        // console.log(proposed_schedule_start, proposed_schedule_end, selectedDate, appointment?.data?.notes, appointment?.data?.purpose, appointment?.data?.status);

    };
    /** End of Appointment Date, Time Scheduling */

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
                    <span>Edit Appointment</span>
                </h2>
            </div>

                

            <section className="pt-4">
                {/* <SelectedUserComponent 
                    selectedUserItem={ selectedPatient } 
                    setSelectedUserItem={ setSelectedUserItem } /> */} 

                { (appointment?.data?.patient) && (
                    <section className="selected-user pt-2 pb-4 px-3">
                        <article className="d-flex align-items-center gap-3">
                            <div className="patient-doctor d-flex justify-content-start align-items-center gap-3 pt-2">
                                <picture>
                                    <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                        media="(orientation: portrait)" />
                                    <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                        className="object-fit-cover border border-1 border-secondary border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                                </picture>
                                <div className="d-flex flex-column">
                                    <span className="fw-semibold">{ ((appointment?.data?.patient?.first_name)?.slice(0,1)?.toUpperCase() + appointment?.data?.patient?.first_name?.slice(1))
                                                                    + ' ' 
                                                                    + ((appointment?.data?.patient?.last_name)?.slice(0,1)?.toUpperCase() + appointment?.data?.patient?.last_name?.slice(1)) }
                                    </span>
                                    <span>Patient has a history of diabetes in lineage.</span>
                                </div>
                            </div>
                        </article>
                    </section>
                ) }

                <section className="appointment-booking pt-3">
                    <section className="new-appointment" id="add-new-appointment">
                        {/* <div className="time-range"> */}
                            <h4 className="fw-semibold fs-6 px-3">
                                Proposed Slot&nbsp;
                                <span className='text-secondary'><small>(for new appointment)</small></span>
                            </h4>

                            { (appointments?.data?.length > 0) && (
                                <p className="py-0 px-3">
                                    <a href="#existing-appointments" className="text-warning">
                                        <small>View already existing appointments on selected date.</small>
                                    </a>
                                </p>
                            ) }
                        
                            <form onSubmit={handleUpdate} className='pt-1' style={{ maxWidth: '800px' }}>
                                <section className="schedule-appointment d-flex justify-content-between align-items-center flex-wrap gap-3 column-gap-5 p-3">
                                    {/* <h2>Schedule Appointment</h2> */}

                                    {/* Date Picker */}
                                    <div className="date-picker mb-3">
                                        {/* <label>Select Date:</label> */}
                                        <Calendar
                                            onChange={handleDateChange}
                                            value={ appointment?.data?.proposed_schedule_date ?? new Date() }
                                            minDate={new Date()} // Disable past dates
                                            // calendarType="US"
                                            className="border-radius-15"
                                        />
                                    </div>

                                    <section className="time-pickers d-flex flex-column align-items-md-end gap-3">
                                        <div className="form-floating mb-3">
                                            <select 
                                                id="status" 
                                                name="status" 
                                                className="form-select" 
                                                value={ appointment?.data?.status ?? '' }
                                                onChange={ e => appointment.setData({
                                                    ...appointment?.data,
                                                    status: e.target.value,
                                                }) }
                                                placeholder="pending">
                                                    <option value="" disabled={appointment?.data?.status !== ''}>Choose one ...</option>
                                                    <option value="cancelled">Cancelled</option>
                                                    <option value="ongoing">Ongoing</option> 
                                                    <option value="pending">Pending</option> 
                                                    <option value="took-place">Took Place</option> 
                                            </select>
                                            <label htmlFor="status" style={{ marginLeft: '0' }}>Status</label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input 
                                                type="time" 
                                                min="09:00" max="18:00" 
                                                id="proposed_schedule_start" 
                                                name="proposed_schedule_start" 
                                                className="form-control" 
                                                value={ startTime }
                                                onChange={(e) => { setStartTime(e.target.value) }}
                                                style={{ maxWidth: '150px' }}
                                                placeholder="09:00" />
                                            <label htmlFor="proposed_schedule_start" style={{ marginLeft: '0' }}>Start Time</label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input 
                                                type="time" 
                                                min="09:00" max="18:00" 
                                                id="proposed_schedule_end" 
                                                name="proposed_schedule_end" 
                                                className="form-control" 
                                                value={ endTime }
                                                onChange={(e) => setEndTime(e.target.value)}
                                                style={{ maxWidth: '150px' }}
                                                placeholder="09:00" />
                                            <label htmlFor="proposed_schedule_end" style={{ marginLeft: '0' }}>End Time</label>
                                        </div>
                                    </section>

                                    <div className="form-floating  mb-3 col-12">
                                        <textarea 
                                            id="purpose"
                                            name="purpose"
                                            className="form-control" 
                                            style={{ height: '100px' }} 
                                            value={ appointment?.data?.purpose ?? '' }
                                            onChange={ e => appointment.setData({
                                                ...appointment?.data,
                                                purpose: e.target.value,
                                            }) } 
                                            placeholder="This is the purpose for the Appointment."></textarea>
                                        <label htmlFor="purpose"  style={{ marginLeft: '0' }}>Purpose</label>
                                    </div>

                                    <div className="form-floating  mb-3 col-12">
                                        <textarea 
                                            id="notes" 
                                            name="notes" 
                                            className="form-control" 
                                            style={{ height: '100px' }} 
                                            value={ appointment?.data?.notes ?? '' }
                                            onChange={ e => appointment.setData({
                                                ...appointment?.data,
                                                notes: e.target.value,
                                            }) } 
                                            placeholder="This is notes for the Appointment."></textarea>
                                        <label htmlFor="notes"  style={{ marginLeft: '0' }}>Notes</label>
                                    </div>
                                    
                                </section>
                                <div className="d-flex justify-content-end px-3">
                                    <button type="submit" className="btn btn-outline-secondary border-radius-25">Update</button>
                                </div>
                            </form>
                        {/* </div> */}
                    </section>

                    { (appointments?.data?.length > 0) && (
                        <section id="existing-appointments" className="existing-appointments d-flex flex-column gap-3 pt-5">
                            <h4 className="fw-semibold border-bottom pb-1 fs-5">Appointments On Your Schedule</h4>

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

                        </section> 
                    ) }
                </section>
            </section>
        </Layout>
    )
}
