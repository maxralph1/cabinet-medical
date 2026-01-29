import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import swal from 'sweetalert2'; 
import { useNotifications } from '@/hooks/useNotifications.jsx';
import { useNotification } from '@/hooks/useNotification.jsx';
import PaginationMeter from '@/components/PaginationMeter.jsx';
import PaginationLinks from '@/components/PaginationLinks.jsx';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const [notificationQuery, setNotificationQuery] = useState({
        range: 'all', 
        page: 1, 
        limit: 10, 
    }); 

    const { notifications, getNotifications, loading } = useNotifications(notificationQuery);
    const { deleteNotification } = useNotification(); 

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">Notifications</h2>
            </div>

            <div className="d-flex justify-content-end pt-3">
                <span>
                    { (notifications?.data?.length > 0) 
                        && <PaginationMeter 
                                current_page={ notifications?.meta?.current_page } 
                                limit={ notifications?.meta?.limit } 
                                total_pages={ notifications?.meta?.total_pages } 
                                total_results={ notifications?.meta?.total_results } /> } 
                </span> 
            </div> 

            <section className="pt-3">
                { (loading == true) 
                    ?   <div className="py-4 d-flex justify-content-center align-items-center">
                            <div className="spinner-grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>  
                        </div>
                            : ((loading == false) && ((notifications?.data?.length < 1) || notifications?.length < 1)) 
                                ?   <div className="py-4 d-flex justify-content-center align-items-center">
                                        <span>You have no notifications yet.</span>
                                    </div> 
                                        : ((loading == false) && (notifications?.data?.length > 0)) 
                                            ?   <ul className="contact-us-requests list-unstyled d-flex flex-column align-items-start gap-3">
                                                    { (notifications?.data
                                                                    ?.sort((a, b) => new Date(b.ctreated_at) - new Date(a.ctreated_at))
                                                                    ?.map((notification, index) => {
                                                        return (
                                                            <li key={ notification?._id } className="contact-us-request w-100 border border-1 border-radius-25 d-flex flex-column px-3 py-4">
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
                                                                                    deleteNotification(notification?._id); 
                                                                                    // setContact-uss([]);
                                                                                    getNotifications(notificationQuery); 
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
                                                                    <div>
                                                                        { (notification?.type == 'appointment-new') 
                                                                            ? <span>You have a new appointment.&nbsp;
                                                                                <Link 
                                                                                    to={ route('home.appointments.show', { id: notification?.appointment })}
                                                                                    className="">View</Link>
                                                                            </span> 
                                                                        : (notification?.type == 'appointment-cancel') 
                                                                            ? <span>Your appointment has been cancelled.&nbsp;
                                                                                <Link 
                                                                                    to={ route('home.appointments.show', { id: notification?.appointment })}
                                                                                    className="">View</Link>
                                                                            </span> 
                                                                        : (notification?.type == 'appointment-modified') 
                                                                            ? <span>Your appointment has been modified.&nbsp;
                                                                                <Link 
                                                                                    to={ route('home.appointments.show', { id: notification?.appointment })}
                                                                                    className="">View</Link>
                                                                            </span> 
                                                                        : (notification?.type == 'chat-message') 
                                                                            ? <span>You have received a new message.&nbsp;
                                                                                <Link 
                                                                                    to={ route('home.appointments.show', { id: notification?.chat_message?.chat?._id })}
                                                                                    className="">View</Link>
                                                                            </span> 
                                                                        : (notification?.type == 'diagnosis-result') 
                                                                            ? <span>Test result out.&nbsp;
                                                                                <Link 
                                                                                    to={ route('home.diagnosis.show', { id: notification?.diagnosis_segment?.diagnosis?._id })}
                                                                                    className="">View</Link>
                                                                            </span> 
                                                                        : (notification?.type == 'invoice-new') 
                                                                            ? <span>You have a new invoice unpaid.&nbsp;
                                                                                <Link 
                                                                                    to={ route('home.inventory.invoices.show', { id: notification?.inventory_invoice })}
                                                                                    className="">View/Pay</Link>
                                                                            </span> 
                                                                        : (notification?.type == 'invoice-payment') 
                                                                            ? <span>You have made a new invoice payment.&nbsp;
                                                                                <Link 
                                                                                    to={ route('home.inventory.invoices.pay', { id: notification?.inventory_invoice })}
                                                                                    className="">View/Pay</Link>
                                                                            </span> 
                                                                        : (notification?.type == 'medical-bill-new') 
                                                                            ? <span>You have a new medical bill unpaid.&nbsp;
                                                                                <Link 
                                                                                    to={ route('home.medical-bills.show', { id: notification?.medical_bill })}
                                                                                    className="">View/Pay</Link>
                                                                            </span> 
                                                                        : (notification?.type == 'medical-bill-payment') 
                                                                            ? <span>You have a new medical bill unpaid.&nbsp;
                                                                                <Link 
                                                                                    to={ route('home.medical-bills.show', { id: notification?.medical_bill })}
                                                                                    className="">View/Pay</Link>
                                                                            </span> 
                                                                        : (notification?.type == 'regimen') 
                                                                            ? <span>You have made a new pending regimen.&nbsp;
                                                                                <Link 
                                                                                    to={ route('home.regimenss.show', { id: notification?.regimen })}
                                                                                    className="">View</Link>
                                                                            </span> 
                                                                        : ''
                                                                        }
                                                                    </div>
                                                                </section>
                                                            </li> 
                                                        )
                                                    })) }
                                                </ul>
                                                : <></> }
            </section>

            { (notifications?.data?.length > 0) 
                && <PaginationLinks 
                    items={ notifications } 
                    get_items={ getNotifications } 
                    query={ notificationQuery } 
                    set_query={ setNotificationQuery } /> } 
        </Layout>
    )
}
