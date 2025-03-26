import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import swal from 'sweetalert2'; 
import { useAppointmentRequests } from '@/hooks/useAppointmentRequests.jsx'; 
import { useAppointmentRequest } from '@/hooks/useAppointmentRequest.jsx'; 
import PaginationMeter from '@/components/PaginationMeter.jsx';
import PaginationLinks from '@/components/PaginationLinks.jsx';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const [appointmentRequestQuery, setAppointmentRequestQuery] = useState({
        range: 'all', 
        page: 1, 
        limit: 10, 
    }); 
    const { appointmentRequests, getAppointmentRequests, loading } = useAppointmentRequests(appointmentRequestQuery); 
    console.log(appointmentRequests); 

    const { approveAppointmentRequest, rejectAppointmentRequest, deleteAppointmentRequest } = useAppointmentRequest();


    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">Appointment Requests</h2>
            </div>

            <div className="d-flex justify-content-end pt-3">
                <span>
                    { (appointmentRequests?.data?.length > 0) 
                        && <PaginationMeter 
                                current_page={ appointmentRequests?.meta?.current_page } 
                                limit={ appointmentRequests?.meta?.limit } 
                                total_pages={ appointmentRequests?.meta?.total_pages } 
                                total_results={ appointmentRequests?.meta?.total_results } /> } 
                </span> 
            </div> 

            <section className="pt-3">
                { (loading == true) 
                    ?   <div className="py-4 d-flex justify-content-center align-items-center">
                            <div className="spinner-grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>  
                        </div>
                            : ((loading == false) && ((appointmentRequests?.data?.length < 1) || appointmentRequests?.length < 1)) 
                                ?   <div className="py-4 d-flex justify-content-center align-items-center">
                                        <span>There are no appointment requests yet.</span>
                                    </div> 
                                        : ((loading == false) && (appointmentRequests?.data?.length > 0)) 
                                            ?   <ul className="appointment-requests list-unstyled d-flex flex-column align-items-start gap-3">
                                                    { (appointmentRequests?.data
                                                                        ?.sort((a, b) => new Date(b.proposed_schedule_date_time) - new Date(a.proposed_schedule_date_time))
                                                                        ?.map((appointmentRequest, index) => {
                                                        return (
                                                            <li key={ appointmentRequest?._id } className="appointment-request w-100 border border-1 border-radius-25 d-flex flex-column px-3 py-4">
                                                                <section className="cta d-flex justify-content-end gap-3">
                                                                    { (appointmentRequest?.status != 'approved') && (
                                                                        <span 
                                                                            type="button" 
                                                                            onClick={ async () => {
                                                                                await approveAppointmentRequest(appointmentRequest?._id); 
                                                                                await getAppointmentRequests();
                                                                            }}
                                                                            className="btn btn-sm btn-outline-secondary border-radius-25 py-0">
                                                                                Approve
                                                                        </span>
                                                                    ) }
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
                                                                                    deleteAppointmentRequest(appointmentRequest?._id); 
                                                                                    // setAppointments([]);
                                                                                    getAppointmentRequests(appointmentRequestQuery); 
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
                                                                    <div className="d-flex flex-column">
                                                                        <span>
                                                                            <span className="d-flex flex-column">
                                                                                <span className="fw-semibold">{ ((appointmentRequest?.patient_first_name)?.slice(0,1)?.toUpperCase()+(appointmentRequest?.patient_first_name)?.slice(1)) + ' ' + ((appointmentRequest?.patient_last_name)?.slice(0,1)?.toUpperCase()+(appointmentRequest?.patient_last_name)?.slice(1)) }</span>
                                                                                <div>
                                                                                    <span className="fw-semibold"><small>{ appointmentRequest?.patient_email }</small></span>{ appointmentRequest?.patient_email && ', '}
                                                                                    <span className="fw-semibold"><small>{ appointmentRequest?.patient_phone }</small></span>
                                                                                </div>
                                                                                <span className="pt-2">Comments:&nbsp;<span className="fw-semibold">{ appointmentRequest?.comments ?? 'N/A' }</span></span>
                                                                            </span> 
                                                                        </span>
                                                                    </div>
                                                                </section>
                                                                <section className="schedule w-100 d-flex justify-content-end gap-4 row-gap-2 flex-wrap pt-3">
                                                                    <div className="appointment-date-time d-flex align-items-center gap-1">
                                                                        <span><small>Proposed Date/TIme:</small>&nbsp;</span>
                                                                        <span>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                                                className="bi bi-calendar-event" viewBox="0 0 16 16">
                                                                                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                                                                <path
                                                                                    d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                                                            </svg>
                                                                        </span>
                                                                        <span>
                                                                            { dayjs(appointmentRequest?.proposed_schedule_date_time).format('MMM D, YYYY, HH:mm') }
                                                                        </span>
                                                                    </div>
                                                                </section>
                                                            </li> 
                                                        )
                                                    })) }
                                                </ul>
                                                : <></> }
            </section>

            { (appointmentRequests?.data?.length > 0) 
                && <PaginationLinks 
                    items={ appointmentRequests } 
                    get_items={ getAppointmentRequests } 
                    query={ appointmentRequestQuery } 
                    set_query={ setAppointmentRequestQuery } /> } 
        </Layout>
    )
}
