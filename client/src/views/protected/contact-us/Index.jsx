import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import swal from 'sweetalert2'; 
import { useContactUsRecords } from '@/hooks/useContactUsRecords.jsx'; 
import { useContactUs } from '@/hooks/useContactUs.jsx'; 
import PaginationMeter from '@/components/PaginationMeter.jsx';
import PaginationLinks from '@/components/PaginationLinks.jsx';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const [contactUsQuery, setContactUsQuery] = useState({
        range: 'all', 
        page: 1, 
        limit: 10, 
    }); 
    const { contactUsRecords, getContactUsRecords, loading } = useContactUsRecords(contactUsQuery); 
    console.log(contactUsRecords); 

    const { deleteContactUs } = useContactUs();


    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">Contact Us Requests</h2>
            </div>

            <div className="d-flex justify-content-end pt-3">
                <span>
                    { (contactUsRecords?.data?.length > 0) 
                        && <PaginationMeter 
                                current_page={ contactUsRecords?.meta?.current_page } 
                                limit={ contactUsRecords?.meta?.limit } 
                                total_pages={ contactUsRecords?.meta?.total_pages } 
                                total_results={ contactUsRecords?.meta?.total_results } /> } 
                </span> 
            </div> 

            <section className="pt-3">
                { (loading == true) 
                    ?   <div className="py-4 d-flex justify-content-center align-items-center">
                            <div className="spinner-grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>  
                        </div>
                            : ((loading == false) && ((contactUsRecords?.data?.length < 1) || contactUsRecords?.length < 1)) 
                                ?   <div className="py-4 d-flex justify-content-center align-items-center">
                                        <span>There are no contact-us requests yet.</span>
                                    </div> 
                                        : ((loading == false) && (contactUsRecords?.data?.length > 0)) 
                                            ?   <ul className="contact-us-requests list-unstyled d-flex flex-column align-items-start gap-3">
                                                    { (contactUsRecords?.data
                                                                        ?.sort((a, b) => new Date(b.proposed_schedule_date_time) - new Date(a.proposed_schedule_date_time))
                                                                        ?.map((contactUs, index) => {
                                                        return (
                                                            <li key={ contactUs?._id } className="contact-us-request w-100 border border-1 border-radius-25 d-flex flex-column px-3 py-4">
                                                                <section className="cta d-flex justify-content-end gap-3">
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
                                                                                    deleteContactUs(contactUs?._id); 
                                                                                    // setContact-uss([]);
                                                                                    getContactUsRecords(contactUsQuery); 
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
                                                                                <span className="fw-semibold">{ ((contactUs?.patient_first_name)?.slice(0,1)?.toUpperCase()+(contactUs?.patient_first_name)?.slice(1)) + ' ' + ((contactUs?.patient_last_name)?.slice(0,1)?.toUpperCase()+(contactUs?.patient_last_name)?.slice(1)) }</span>
                                                                                <div>
                                                                                    <span className="fw-semibold"><small>{ contactUs?.patient_email }</small></span>{ contactUs?.patient_email && ', '}
                                                                                    <span className="fw-semibold"><small>{ contactUs?.patient_phone }</small></span>
                                                                                </div>
                                                                                <span className="pt-2">Subject:&nbsp;<span className="fw-semibold">{ contactUs?.subject ?? 'N/A' }</span></span>
                                                                                <span className="pt-2">Comments:&nbsp;<span className="fw-semibold">{ contactUs?.comments ?? 'N/A' }</span></span>
                                                                            </span> 
                                                                        </span>
                                                                    </div>
                                                                </section>
                                                            </li> 
                                                        )
                                                    })) }
                                                </ul>
                                                : <></> }
            </section>

            { (contactUsRecords?.data?.length > 0) 
                && <PaginationLinks 
                    items={ contactUsRecords } 
                    get_items={ getContactUsRecords } 
                    query={ contactUsQuery } 
                    set_query={ setContactUsQuery } /> } 
        </Layout>
    )
}
