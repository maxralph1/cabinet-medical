import { useState } from 'react'; 
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import swal from 'sweetalert2'; 
import { usePatients } from '@/hooks/usePatients.jsx'; 
import { useAppointment } from '@/hooks/useAppointment.jsx'; 
import { useAppointmentsSpecificDate } from '@/hooks/useAppointmentsSpecificDate.jsx'; 
import SelectedUserComponent from '@/components/protected/nested-components/SelectedUserComponent';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Create() {
    const { appointments, getAppointments, loading } = useAppointmentsSpecificDate(); 
    console.log(appointments);
    const { appointment, createAppointment } = useAppointment(); 

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

    /** Appointment Date, Time Scheduling */
    // const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date()); 
    console.log('selectedDate:', new Date(selectedDate)?.toISOString()?.split('T')[0]);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState(''); 

    const handleDateChange = async (date) => {
        setSelectedDate(date); 
        // await getAppointments(new Date(date)?.toISOString()?.split('T')[0]); 
        await getAppointments(new Date(date)?.toLocaleDateString('en-CA')); 
        console.log('specific date appointments:', appointments); 
    }; 
    console.log(appointments?.data);

    const constructDate = (date, time) => {
        const [hours, minutes] = time.split(':');
        const newDate = new Date(date);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        return newDate.toISOString();
    }; 

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        if (!selectedDate || !startTime || !endTime) {
            swal.fire({
                text: `Please fill all fields correctly.`, 
                color: '#900000', 
                width: 325, 
                position: 'top', 
                showConfirmButton: false
            });
            return;
        };

        const startDateTime = constructDate(selectedDate, startTime);
        const endDateTime = constructDate(selectedDate, endTime);
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

        if (selectedUserItem) {
            const formData = new FormData(); 
            selectedUserItem && formData.append('patient', selectedUserItem?._id); 
            proposed_schedule_start && formData.append('proposed_schedule_start', proposed_schedule_start); 
            proposed_schedule_end && formData.append('proposed_schedule_end', proposed_schedule_end); 
            // selectedDate && formData.append('proposed_schedule_date', new Date(selectedDate)?.toISOString()?.split('T')[0]); 
            selectedDate && formData.append('proposed_schedule_date', new Date(selectedDate)?.toLocaleDateString('en-CA')); 
            appointment?.data?.notes && formData.append('notes', appointment?.data?.notes); 
            appointment?.data?.purpose && formData.append('purpose', appointment?.data?.purpose); 

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
                    <span>Add Appointment</span>
                </h2>
            </div>

            <section className="pt-4">
                <SelectedUserComponent 
                    selectedUserItem={ selectedUserItem } 
                    setSelectedUserItem={ setSelectedUserItem } />

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
                        
                            <form onSubmit={handleSubmit} className='pt-1' style={{ maxWidth: '800px' }}>
                                <section className="schedule-appointment d-flex justify-content-between align-items-center flex-wrap gap-3 column-gap-5 p-3">
                                    {/* <h2>Schedule Appointment</h2> */}

                                    {/* Date Picker */}
                                    <div className="date-picker mb-3">
                                        {/* <label>Select Date:</label> */}
                                        <Calendar
                                            onChange={handleDateChange}
                                            value={selectedDate}
                                            minDate={new Date()} // Disable past dates
                                            // calendarType="US"
                                            className="border-radius-15"
                                        />
                                    </div>

                                    <section className="time-pickers d-flex flex-column align-items-md-end gap-3">
                                        <div className="form-floating mb-3">
                                            <input 
                                                type="time" 
                                                min="09:00" max="18:00" 
                                                id="proposed_schedule_start" 
                                                className="form-control" 
                                                value={startTime}
                                                onChange={(e) => {
                                                    setStartTime(e.target.value); 
                                                    console.log('start time:', startTime)
                                                }}
                                                style={{ maxWidth: '150px' }}
                                                placeholder="09:00" />
                                            <label htmlFor="proposed_schedule_start" style={{ marginLeft: '0' }}>Start Time</label>
                                        </div>
                                        <div className="form-floating mb-3">
                                            <input 
                                                type="time" 
                                                min="09:00" max="18:00" 
                                                id="proposed_schedule_end" 
                                                className="form-control" 
                                                value={endTime}
                                                onChange={(e) => setEndTime(e.target.value)}
                                                style={{ maxWidth: '150px' }}
                                                placeholder="09:00" />
                                            <label htmlFor="proposed_schedule_end" style={{ marginLeft: '0' }}>End Time</label>
                                        </div>
                                    </section>

                                    <div className="form-floating  mb-3 col-12">
                                        <textarea 
                                            id="purpose"
                                            className="form-control" 
                                            style={{ height: '100px' }}  
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
                                            className="form-control" 
                                            style={{ height: '100px' }}  
                                            onChange={ e => appointment.setData({
                                                ...appointment?.data,
                                                notes: e.target.value,
                                            }) } 
                                            placeholder="This is notes for the Appointment."></textarea>
                                        <label htmlFor="notes"  style={{ marginLeft: '0' }}>Notes</label>
                                    </div>
                                    
                                </section>
                                <div className="d-flex justify-content-end px-3">
                                    <button type="submit" className="btn btn-outline-secondary border-radius-25">Save</button>
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
                </section>
            </section>
        </Layout>
    )
}
