import { useContext, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import swal from 'sweetalert2'; 
import { useDiagnoses } from '@/hooks/useDiagnoses.jsx'; 
import { useDiagnosis } from '@/hooks/useDiagnosis.jsx'; 
import PaginationMeter from '@/components/PaginationMeter.jsx';
import PaginationLinks from '@/components/PaginationLinks.jsx';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const { user } = useContext(AuthContext); 
    // console.log(user);

    const [diagnosisQuery, setDiagnosisQuery] = useState({
        range: 'all', 
        page: 1, 
        limit: 10, 
    }); 
    const { diagnoses, getDiagnoses, loading } = useDiagnoses(diagnosisQuery); 
    console.log(diagnoses); 

    const { deleteDiagnosis } = useDiagnosis(); 

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">Diagnoses</h2>
                <Link to={ route('home.diagnoses.create') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center py-0">
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
                    { (diagnoses?.data?.length > 0) 
                        && <PaginationMeter 
                                current_page={ diagnoses?.meta?.current_page } 
                                limit={ diagnoses?.meta?.limit } 
                                total_pages={ diagnoses?.meta?.total_pages } 
                                total_results={ diagnoses?.meta?.total_results } /> } 
                </span> 
            </div> 

            <section className="pt-3">
                { (loading == true) 
                    ?   <div className="py-4 d-flex justify-content-center align-items-center">
                            <div className="spinner-grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>  
                        </div>
                            : ((loading == false) && ((diagnoses?.data?.length < 1) || diagnoses?.length < 1)) 
                                ?   <div className="py-4 d-flex justify-content-center align-items-center">
                                        <span>There are no diagnoses yet.</span>
                                    </div> 
                                        : ((loading == false) && (diagnoses?.data?.length > 0)) 
                                            ?   <ul className="diagnoses list-unstyled d-flex flex-column align-items-start gap-3">
                                                    { (diagnoses?.data
                                                                ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                                                ?.map((diagnosis, index) => {
                                                        // console.log('diagnosis:', diagnosis)
                                                        return (
                                                            <li key={ diagnosis?._id } className="diagnosis w-100 border border-1 border-radius-25 d-flex flex-column px-3 py-4">
                                                                <div className="d-flex justify-content-between">
                                                                    <section className="doctor-patient d-flex justify-content-start gap-4 flex-wrap pt-3">
                                                                        <picture>
                                                                            <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" media="(orientation: portrait)" />
                                                                            <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" className="object-fit-cover border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                                                                        </picture>
                                                                        <div className="d-flex flex-column">
                                                                            <span>
                                                                                { (user?.user?.user_id == diagnosis?.patient?._id) 
                                                                                    ?   <span className="d-flex flex-column">
                                                                                            <span>By:&nbsp;
                                                                                                <span className="fw-semibold">
                                                                                                    { diagnosis?.authorizing_professional ? ((diagnosis?.authorizing_professional?.first_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.authorizing_professional?.first_name)?.slice(1)) + ' ' + ((diagnosis?.authorizing_professional?.last_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.authorizing_professional?.last_name)?.slice(1)) : 'N/A' }
                                                                                                </span>
                                                                                            </span>
                                                                                            <span>{ (diagnosis?.authorizing_professional && (diagnosis?.authorizing_professional?.role == 'general_practitioner') 
                                                                                                    ? 'General Practitioner' 
                                                                                                    : diagnosis?.authorizing_professional && (diagnosis?.authorizing_professional?.role == 'laboratory_scientist') 
                                                                                                    ? 'Laboratory Scientist' 
                                                                                                    : diagnosis?.authorizing_professional && (diagnosis?.authorizing_professional?.role == 'nurse')
                                                                                                    ? 'Nurse' 
                                                                                                    : 'N/A') }</span>
                                                                                        </span>
                                                                                        : (user?.user?.user_id == diagnosis?.authorizing_professional?._id) 
                                                                                            ?   <span className="d-flex flex-column">
                                                                                                    <span>Patient:&nbsp;
                                                                                                        <span className="fw-semibold">
                                                                                                            { diagnosis?.patient ? ((diagnosis?.patient?.first_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.patient?.first_name)?.slice(1)) + ' ' + ((diagnosis?.patient?.last_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.patient?.last_name)?.slice(1)) : 'N/A' }
                                                                                                        </span>
                                                                                                    </span>
                                                                                                    <span className="pt-2">Notes:&nbsp;
                                                                                                        <span className="fw-semibold">{ diagnosis?.notes ? diagnosis?.notes : 'N/A' }</span>
                                                                                                    </span>
                                                                                                </span> 
                                                                                                    : 'N/A' 
                                                                                }
                                                                            </span>
                                                                            
                                                                            
                                                                        </div>
                                                                    </section>
                                                                    <div className="d-flex gap-2">
                                                                        <div>
                                                                            <span 
                                                                                type="button" 
                                                                                data-bs-toggle="modal" data-bs-target={`#diagnosis${diagnosis?._id}Modal`}>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-view-list text-info" viewBox="0 0 16 16">
                                                                                    <path d="M3 4.5h10a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2m0 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM1 2a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 2m0 12a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 14"/>
                                                                                </svg>
                                                                            </span>

                                                                            <section className="modal fade" id={`diagnosis${diagnosis?._id}Modal`} tabIndex="-1" aria-labelledby={`diagnosis${diagnosis?._id}ModalLabel`} aria-hidden="true">
                                                                                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                                                                                    <div className="modal-content">
                                                                                        <div className="modal-header d-flex justify-content-end">
                                                                                            <h3 className="visually-hidden" id={`diagnosis${diagnosis?._id}ModalLabel`}>Diagnosis { diagnosis?._id }</h3>
                                                                                            <button type="button" data-bs-dismiss="modal" aria-label="Close" className="border-0 bg-transparent">
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                                                </svg>
                                                                                            </button>
                                                                                        </div>
                                                                                        <div className="modal-body">
                                                                                            <span className="d-flex justify-content-end pb-3">
                                                                                                <a href={ route('home.diagnoses.show', { id: diagnosis?._id }) }>
                                                                                                    <small>Go to printable version</small>
                                                                                                </a>
                                                                                            </span>
                                                                                            <p>Patient:&nbsp;
                                                                                                <span className="fw-semibold">
                                                                                                    { diagnosis?.patient ? ((diagnosis?.patient?.first_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.patient?.first_name)?.slice(1)) + ' ' + ((diagnosis?.patient?.last_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.patient?.last_name)?.slice(1)) : 'N/A' }
                                                                                                </span>
                                                                                            </p>
                                                                                            <p>Authorizing Professional:&nbsp;
                                                                                                <span className="fw-semibold">
                                                                                                    { diagnosis?.authorizing_professional ? ((diagnosis?.authorizing_professional?.first_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.authorizing_professional?.first_name)?.slice(1)) + ' ' + ((diagnosis?.authorizing_professional?.last_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.authorizing_professional?.last_name)?.slice(1)) : 'N/A' }
                                                                                                </span>
                                                                                            </p>
                                                                                            <p>Examiner:&nbsp;
                                                                                                <span className="fw-semibold">
                                                                                                    { diagnosis?.examiner ? ((diagnosis?.examiner?.first_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.examiner?.first_name)?.slice(1)) + ' ' + ((diagnosis?.examiner?.last_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.examiner?.last_name)?.slice(1)) : 'N/A' }
                                                                                                </span>
                                                                                            </p>

                                                                                            { (diagnosis?.diagnosis_segments?.length > 0) && (
                                                                                                <section className="diagnosis-segments pt-2">
                                                                                                    <h3 className="border-bottom fs-6">Tests</h3>
                                                                                                    <div className="table-responsive">
                                                                                                        <table className="table">
                                                                                                            <thead>
                                                                                                                <tr>
                                                                                                                <th scope="col">#</th>
                                                                                                                <th scope="col">Type</th>
                                                                                                                <th scope="col">Result</th>
                                                                                                                </tr>
                                                                                                            </thead>
                                                                                                            <tbody className="table-group-divider">
                                                                                                                { diagnosis?.diagnosis_segments?.map((segment, index) => {
                                                                                                                    return (
                                                                                                                        <tr key={ segment?._id } className="diagnosis-segment">
                                                                                                                            <th scope="row">{ index+1}</th>
                                                                                                                            <td>{ segment?.diagnosis_type?.title }</td>
                                                                                                                            <td>{ segment?.result ? segment?.result : 'N/A' }</td>
                                                                                                                        </tr>
                                                                                                                    )
                                                                                                                }) }
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </div>
                                                                                                </section>
                                                                                            ) }

                                                                                            <section className="notes pt-3">
                                                                                                <h3 className="border-bottom fs-6 fst-italic">Notes by Authorizing Professional</h3>
                                                                                                <p>{ diagnosis?.notes ? diagnosis?.notes : 'N/A' }</p>
                                                                                            </section>

                                                                                            <section className="comments pt-3">
                                                                                                <h3 className="border-bottom fs-6 fst-italic">Comments by Examiner(Lab. Scientist):</h3>
                                                                                                <p>{ diagnosis?.comments ? diagnosis?.comments : 'N/A' }</p>
                                                                                            </section>

                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </section>
                                                                        </div>
                                                                        <span>
                                                                            <Link to={ route('home.diagnoses.edit', { id: diagnosis?._id }) }>
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
                                                                                        deleteDiagnosis(diagnosis?._id); 
                                                                                        // setDiagnosiss([]);
                                                                                        getDiagnoses(diagnosisQuery); 
                                                                                    }
                                                                                });
                                                                            }} 
                                                                            className="cursor-pointer">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill text-danger" viewBox="0 0 16 16">
                                                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                                                </svg>
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <section className="diagnosis w-100 d-flex justify-content-end gap-4 flex-wrap pt-3">
                                                                    <div className="diagnosis-date-time d-flex align-items-center gap-1">
                                                                        <span>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                                                className="bi bi-calendar-event" viewBox="0 0 16 16">
                                                                                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                                                                <path
                                                                                    d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                                                            </svg>
                                                                        </span>
                                                                        <span>
                                                                            { dayjs(diagnosis?.updated_at||diagnosis?.created_at).format('ddd, MMM D, YYYY h:mm A') }
                                                                        </span>
                                                                    </div>
                                                                </section>
                                                            </li> 
                                                        )
                                                    })) }
                                                </ul>
                                                : <></> }
            </section>

            { (diagnoses?.data?.length > 0) 
                && <PaginationLinks 
                    items={ diagnoses } 
                    get_items={ getDiagnoses } 
                    query={ diagnosisQuery } 
                    set_query={ setDiagnosisQuery } /> } 
        </Layout>
    )
}
