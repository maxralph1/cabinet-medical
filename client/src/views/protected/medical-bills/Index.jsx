import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useMedicalBills } from '@/hooks/useMedicalBills.jsx'; 
import PaginationMeter from '@/components/PaginationMeter.jsx';
import PaginationLinks from '@/components/PaginationLinks.jsx';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const [medicalBillQuery, setMedicalBillQuery] = useState({
        range: 'all', 
        page: 1, 
        limit: 10, 
    }); 
    const { medicalBills, getMedicalBills, loading } = useMedicalBills(medicalBillQuery); 
    console.log(medicalBills); 

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">Medical Bills</h2>
                <Link to={ route('home.medical-bills.create') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center py-0">
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
                    { (medicalBills?.data?.length > 0) 
                        && <PaginationMeter 
                                current_page={ medicalBills?.meta?.current_page } 
                                limit={ medicalBills?.meta?.limit } 
                                total_pages={ medicalBills?.meta?.total_pages } 
                                total_results={ medicalBills?.meta?.total_results } /> } 
                </span> 
            </div> 

            <section className="pt-3">
                { (loading == true) 
                    ?   <div className="py-4 d-flex justify-content-center align-items-center">
                            <div className="spinner-grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>  
                        </div> 
                            : ((loading == false) && ((medicalBills?.data?.length < 1) || medicalBills?.length < 1)) 
                                ?   <div className="py-4 d-flex justify-content-center align-items-center">
                                        <span>There are no medical bill items yet.</span>
                                    </div> 
                                        : ((loading == false) && (medicalBills?.data?.length > 0)) 
                                            &&  <ul className="list-unstyled d-flex flex-column align-items-start gap-3">
                                                    { (medicalBills?.data
                                                                    ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                                                    ?.map((medicalBill, index) => {
                                                        return (
                                                            <li key={index} className="w-100 border border-1 border-radius-25 px-3 py-4">
                                                                <div className="d-flex justify-content-between align-items-start">
                                                                    <Link 
                                                                        to={ route('home.patients.show', { id: medicalBill?.patient?._id }) } 
                                                                        className="d-flex justify-content-start align-items-center gap-2 flex-wrap">
                                                                        <div className="patient-image">
                                                                            { (medicalBill?.patient?.image_path?.url?.length > 0) 
                                                                                ?   <picture>
                                                                                        <source srcSet={ medicalBill?.patient?.image_path?.url } />
                                                                                        <img src={ medicalBill?.patient?.image_path?.url }
                                                                                            className="object-fit-cover border border-1 border-secondary border-radius-15" style={{ width: '50px', height: '50px' }} alt="" />
                                                                                    </picture>
                                                                                :   <span>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="#414141" className="bi bi-image" viewBox="0 0 16 16">
                                                                                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                                                                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                                                                                        </svg>
                                                                                    </span> }
                                                                        </div>
                                                                        <div className="patient-name">
                                                                            { medicalBill?.patient ? ((medicalBill?.patient?.first_name)?.slice(0,1)?.toUpperCase()+(medicalBill?.patient?.first_name)?.slice(1)) + ' ' + ((medicalBill?.patient?.last_name)?.slice(0,1)?.toUpperCase()+(medicalBill?.patient?.last_name)?.slice(1)) : 'N/A' }
                                                                        </div>
                                                                    </Link>
                                                                    <div>
                                                                        <span>
                                                                            <Link to={ route('home.medical-bills.show', { id: medicalBill?._id }) } className="btn btn-sm btn-outline-secondary border-radius-25 fw-semibold py-0">Details</Link>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="w-100 pt-2">
                                                                    <span><span className="text-secondary">Ref #:</span>&nbsp;<span>{ (medicalBill?._id)?.toUpperCase() }</span></span>
                                                                    <div className="d-flex flex-column column-gap-4">
                                                                        <span className="text-secondary">Purpose:&nbsp;<span className="fw-semibold">{ medicalBill?.purpose ? medicalBill?.purpose : 'N/A' }</span></span>
                                                                        <span className="text-secondary">Notes:&nbsp;<span className="fw-semibold">{ medicalBill?.notes ? medicalBill?.notes : 'N/A' }</span></span>
                                                                        <span className="text-secondary">Comments:&nbsp;<span className="fw-semibold">{ medicalBill?.comments ? medicalBill?.comments : 'N/A' }</span></span>
                                                                        <span className="text-secondary">Amount:&nbsp;<span className="fw-semibold">{ medicalBill?.amount ? medicalBill?.amount : '0' }MUR</span></span>
                                                                        <span className="text-secondary">Fully Paid:&nbsp;<span className="fw-semibold">{ (medicalBill?.fully_paid == true) ? 'Yes' : 'No' }</span></span>
                                                                        <span className="text-secondary">Fully Paid On:&nbsp;<span className="fw-semibold">{ (medicalBill?.fully_paid_on) ? dayjs(medicalBill?.fully_paid_on).format('ddd, MMM D, YYYY h:mm A') : 'N/A' }</span></span>
                                                                    </div>
                                                                </div>

                                                                <div className="d-flex justify-content-end pt-2">
                                                                    <Link 
                                                                        to={ route('home.medical-bills.edit', { id: medicalBill?._id }) }
                                                                        className="btn btn-sm btn-outline-secondary border-radius-35 py-0">
                                                                        Update Bill
                                                                    </Link>
                                                                </div>

                                                                <div className="medical-bill w-100 d-flex justify-content-end gap-1 flex-wrap pt-3">
                                                                    <div>
                                                                        <small className="text-secondary">Last activity:&nbsp;</small>
                                                                    </div>
                                                                    <div className="medical-bill-date-time d-flex align-items-center gap-1">
                                                                        <span>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                                                className="bi bi-calendar-event" viewBox="0 0 16 16">
                                                                                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                                                                <path
                                                                                    d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                                                            </svg>
                                                                        </span>
                                                                        <span>
                                                                            { dayjs(medicalBill?.updated_at).format('ddd, MMM D, YYYY h:mm A') }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        )
                                                    }))}
                                                </ul> }                
            </section>

            { (medicalBills?.data?.length > 0) 
                && <PaginationLinks 
                    items={ medicalBills } 
                    get_items={ getMedicalBills } 
                    query={ medicalBillQuery } 
                    set_query={ setMedicalBillQuery } /> } 
        </Layout>
    )
}
