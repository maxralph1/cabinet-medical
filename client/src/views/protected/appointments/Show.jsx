import { useParams } from 'react-router-dom'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useAppointment } from '@/hooks/useAppointment.jsx';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Show() {
    const { id } = useParams(); 
    const { appointment, getAppointment } = useAppointment(id);

    return (
        <Layout>
            <section className="pt-3">
                {/* <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content"> */}
                        {/* <div className="modal-header d-flex justify-content-between align-items-center pb-2">
                            <h3 className="fs-6" id={`appointment${appointment?.data?._id}ModalLabel`}>
                                <span>Appointment with </span>
                                { (appointment?.data?.user == appointment?.data?.patient?._id) 
                                    ?   <span className="">
                                            <span className="fw-semibold">{ ((appointment?.data?.professional?.first_name)?.slice(0,1)?.toUpperCase()+(appointment?.data?.professional?.first_name)?.slice(1)) + ' ' + ((appointment?.data?.professional?.last_name)?.slice(0,1)?.toUpperCase()+(appointment?.data?.professional?.last_name)?.slice(1)) }</span>
                                        </span>
                                        : (appointment?.data?.user == appointment?.data?.professional?._id) 
                                            ?   <span className="">
                                                    <span className="fw-semibold">{ ((appointment?.data?.patient?.first_name)?.slice(0,1)?.toUpperCase()+(appointment?.data?.patient?.first_name)?.slice(1)) + ' ' + ((appointment?.data?.patient?.last_name)?.slice(0,1)?.toUpperCase()+(appointment?.data?.patient?.last_name)?.slice(1)) }</span>
                                                </span> 
                                                    : 'N/A' 
                                }
                            </h3>
                            <button type="button" data-bs-dismiss="modal" aria-label="Close" className="border-0 bg-transparent" style={{ marginTop: '-0.75rem' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                </svg>
                            </button>
                        </div> */}
                        {/* <div className="pt-3"> */}
                            <h4 className="fs-6">
                                <span>
                                    { (appointment?.data?.user == appointment?.data?.patient?._id) 
                                        ?   <span className="d-flex flex-column">
                                                <span className="fw-semibold">{ ((appointment?.data?.professional?.first_name)?.slice(0,1)?.toUpperCase()+(appointment?.data?.professional?.first_name)?.slice(1)) + ' ' + ((appointment?.data?.professional?.last_name)?.slice(0,1)?.toUpperCase()+(appointment?.data?.professional?.last_name)?.slice(1)) }</span>
                                                <span>{ appointment?.data?.professional?.role }</span>
                                            </span>
                                            : (appointment?.data?.user == appointment?.data?.professional?._id) 
                                                ?   <div className="d-flex flex-column">
                                                        <p className="pt-0 d-flex flex-column">
                                                            <span className="fw-semibold ">
                                                                { ((appointment?.data?.patient?.first_name)?.slice(0,1)?.toUpperCase()+(appointment?.data?.patient?.first_name)?.slice(1)) + ' ' + ((appointment?.data?.patient?.last_name)?.slice(0,1)?.toUpperCase()+(appointment?.data?.patient?.last_name)?.slice(1)) }
                                                            </span>
                                                            <span className="fw-light">Patient</span>
                                                        </p>
                                                        <p className="pt-2 py-0">Schedule:&nbsp;
                                                            <span className="fw-semibold">
                                                                { dayjs(appointment?.data?.proposed_schedule_start).format('MMM D, YYYY (HH:mm') + ' - ' + dayjs(appointment?.data?.proposed_schedule_end).format('HH:mm)') }
                                                            </span>
                                                        </p>
                                                        <p className="pt-2 py-0">Status:&nbsp;
                                                            <span className="">
                                                                { (appointment?.data?.status == 'cancelled') 
                                                                    ? <span className="badge rounded-pill text-bg-danger">Cancelled</span> 
                                                                    : (appointment?.data?.status == 'ongoing') 
                                                                    ? <span className="badge rounded-pill text-bg-success">Ongoing</span> 
                                                                    : (appointment?.data?.status == 'pending') 
                                                                    ? <span className="badge rounded-pill text-bg-warning">Pending</span> 
                                                                    : (appointment?.data?.status == 'took-place') 
                                                                    ? <span className="badge rounded-pill text-bg-secondary">Took place</span> 
                                                                    : '' }
                                                            </span>
                                                        </p>
                                                        <p className="pt-2 py-0">Purpose:&nbsp;<span className="fw-semibold">{ appointment?.data?.purpose ?? 'N/A' }</span></p>
                                                        <p className="pt-2 py-0">Notes:&nbsp;<span className="fw-semibold">{ appointment?.data?.notes ?? 'N/A' }</span></p>
                                                    </div> 
                                                        : 'N/A' 
                                    }
                                </span>
                            </h4>
                                
                        {/* </div> */}
                    {/* </div>
                </div> */}
            </section>
        </Layout>
    )
}
