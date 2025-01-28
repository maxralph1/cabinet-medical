import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useDiagnosisTypes } from '@/hooks/useDiagnosisTypes.jsx'; 
import PaginationMeter from '@/components/PaginationMeter.jsx';
import PaginationLinks from '@/components/PaginationLinks.jsx';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Show() {
    const [diagnosisTypeQuery, setDiagnosisTypeQuery] = useState({
        range: 'all', 
        page: 1, 
        limit: 10, 
    }); 
    const { diagnosisTypes, getDiagnosisTypes, loading } = useDiagnosisTypes(diagnosisTypeQuery); 
    console.log(diagnosisTypes); 

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">Diagnosis Types</h2>
                <Link to={ route('home.diagnosis-types.create') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
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
                    { (diagnosisTypes?.data?.length > 0) 
                        && <PaginationMeter 
                                current_page={ diagnosisTypes?.meta?.current_page } 
                                limit={ diagnosisTypes?.meta?.limit } 
                                total_pages={ diagnosisTypes?.meta?.total_pages } 
                                total_results={ diagnosisTypes?.meta?.total_results } /> } 
                </span> 
            </div> 

            <section className="pt-3">
                { (loading == true) 
                    ?   <div className="py-4 d-flex justify-content-center align-items-center">
                            <div className="spinner-grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>  
                        </div>
                            : ((loading == false) && ((diagnosisTypes?.data?.length < 1) || diagnosisTypes?.length < 1)) 
                                ?   <div className="py-4 d-flex justify-content-center align-items-center">
                                        <span>There are no diagnosis types yet.</span>
                                    </div> 
                                        : ((loading == false) && (diagnosisTypes?.data?.length > 0)) 
                                            ?   <ul className="diagnosis-types list-unstyled d-flex flex-column align-items-start gap-3">
                                                    { (diagnosisTypes?.data?.map((diagnosisType, index) => {
                                                        return (
                                                            <li key={ diagnosisType?._id } className="diagnosis-type w-100 border border-1 border-radius-25 d-flex flex-column px-3 py-4">
                                                                {/* <span className="">#
                                                                    { (diagnosisTypes?.meta?.current_page != 1) 
                                                                        ? (((diagnosisTypes?.meta?.current_page - 1) * results_limit) + (index + 1))
                                                                        : diagnosisTypes?.meta?.current_page * (index + 1) }
                                                                </span> */}

                                                                <section className="doctor-patient d-flex justify-content-start gap-4 flex-wrap pt-3">
                                                                    <picture>
                                                                        <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" media="(orientation: portrait)" />
                                                                        <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" className="object-fit-cover border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                                                                    </picture>
                                                                    <div className="d-flex flex-column">
                                                                        <span>
                                                                            { (diagnosisType?.user == diagnosisType?.patient?._id) 
                                                                                ?   <span className="d-flex flex-column">
                                                                                        <span className="fw-semibold">{ diagnosisType?.professional?.first_name + ' ' + diagnosisType?.professional?.last_name }</span>
                                                                                        <span>{ diagnosisType?.professional?.role }</span>
                                                                                    </span>
                                                                                    : (diagnosisType?.user == diagnosisType?.professional?._id) 
                                                                                        ?   <span className="d-flex flex-column">
                                                                                                <span className="fw-semibold">{ diagnosisType?.patient?.first_name + ' ' + diagnosisType?.patient?.last_name }</span>
                                                                                                <span>Patient</span>
                                                                                                <span className="pt-2">Purpose:&nbsp;<span className="fw-semibold">Pregnancy first trimester investigation</span></span>
                                                                                            </span> 
                                                                                                : 'N/A' 
                                                                            }
                                                                        </span>
                                                                        
                                                                        
                                                                    </div>
                                                                </section>
                                                                <section className="schedule w-100 d-flex justify-content-end gap-4 flex-wrap pt-3">
                                                                    <div className="diagnosis-type-date-time d-flex align-items-center gap-1">
                                                                        <span>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                                                className="bi bi-calendar-event" viewBox="0 0 16 16">
                                                                                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                                                                <path
                                                                                    d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                                                            </svg>
                                                                        </span>
                                                                        <span>
                                                                            { dayjs(diagnosisType?.proposed_year_start+'-'+diagnosisType?.proposed_month_start+'-'+diagnosisType?.proposed_date_start).format('MMM D, YYYY') }, { diagnosisType?.proposed_time_start }
                                                                        </span>
                                                                    </div>
                                                                    <div className="diagnosis-type-length d-flex align-items-center gap-1">
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
                                                                            { dayjs(diagnosisType?.proposed_time_end)?.diff(diagnosisType?.proposed_time_start, 'minute', true) || '30 minutes' }
                                                                        </span>
                                                                    </div>
                                                                </section>
                                                            </li> 
                                                        )
                                                    })) }
                                                </ul>
                                                : <></> }
            </section>

            { (diagnosisTypes?.data?.length > 0) 
                && <PaginationLinks 
                    items={ diagnosisTypes } 
                    get_items={ getDiagnosisTypes } 
                    set_query={ setDiagnosisTypeQuery } /> } 
        </Layout>
    )
}
