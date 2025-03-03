import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import swal from 'sweetalert2'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useRegimen } from '@/hooks/useRegimen.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Show() {
    const { id } = useParams(); 
    const { regimen, getRegimen } = useRegimen(id); 
    console.log(regimen); 

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">
                    <Link 
                        to={ route('home.regimens.index') } className="">Regimens</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    {/* <span className="text-uppercase">{ (regimen?.data?._id) }</span> */}
                    <span className="">View Regimen</span>
                </h2>
            </div>

            <section className="regimen-details pt-3">
                <h3 className="d-flex flex-column gap-2">
                    <div className="fs-6">
                        <span className="fw-light">Patient:&nbsp;</span>
                        <span>{ ((regimen?.data?.patient?.first_name)?.slice(0,1)?.toUpperCase() + regimen?.data?.patient?.first_name?.slice(1))
                                + ' ' 
                                + ((regimen?.data?.patient?.last_name)?.slice(0,1)?.toUpperCase() + regimen?.data?.patient?.last_name?.slice(1)) }</span>
                    </div>
                    <div className="fs-6">
                        <span className="fw-light">Issued by (Professional):&nbsp;</span>
                        <span>{ ((regimen?.data?.authorizing_professional?.first_name)?.slice(0,1)?.toUpperCase() + regimen?.data?.authorizing_professional?.first_name?.slice(1))
                                + ' ' 
                                + ((regimen?.data?.authorizing_professional?.last_name)?.slice(0,1)?.toUpperCase() + regimen?.data?.authorizing_professional?.last_name?.slice(1)) }</span>
                    </div>
                </h3>

                <p className="pt-2 text-secondary">
                    <small>added&nbsp;
                        <span>{ dayjs.utc(regimen?.data?.created_at).fromNow() }</span>
                    </small>
                </p>

                { (regimen?.data?.notes?.length>0) && (
                    <section className="notes pt-3">
                        <h4 className="fs-5">Notes:</h4>
                        <div 
                            className="preview fs-5" 
                            dangerouslySetInnerHTML={{ __html: (regimen?.data?.notes) }} />
                    </section>
                ) }

                { (regimen?.data?.comments?.length>0) && (
                    <section className="comments pt-3">
                        <h4 className="fs-5">Comments:</h4>
                        <div 
                            className="preview fs-5" 
                            dangerouslySetInnerHTML={{ __html: (regimen?.data?.comments) }} />
                    </section>
                ) }
                

                { (regimen?.data?.regimen_administrations?.length>0) && (
                    <section className="product-units pt-4">
                        <h4 className="fs-5">Schedule:&nbsp;&nbsp;</h4>
                        <ul className="list-unstyled pt-1">
                            { regimen?.data?.regimen_administrations?.map((item, index) => (
                                <li key={index} className="product-unit pb-2 d-flex">
                                    <span>{ index+1 }.&nbsp;</span>

                                    <div className="d-flex flex-column">
                                        <span>Administration Date & Time:&nbsp;<span className="fw-semibold">{ dayjs(item?.proposed_administration_date_time).format('ddd, MMM D, YYYY h:mm A') }</span></span>
                                    </div>

                                    <div className="ms-2">
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
                                                        deleteRegimenUnit(item?._id); 
                                                        // setRegimens([]);
                                                        getRegimen(id); 
                                                    }
                                                });
                                            }} 
                                            className="cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill text-danger" viewBox="0 0 16 16">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                </svg>
                                        </span>
                                    </div>
                                </li>
                            )) }
                        </ul>
                    </section>
                )}
            </section>
        </Layout>
    )
}
