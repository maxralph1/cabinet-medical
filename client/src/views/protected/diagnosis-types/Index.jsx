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


export default function Index() {
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
                <Link to={ route('home.diagnosis-types.create') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center py-0">
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

                                                                <section className="doctor-patient d-flex justify-content-start gap-4 flex-wrap pt-3">
                                                                    <div className="d-flex flex-column">
                                                                        <span>
                                                                            <span className="d-flex flex-column">
                                                                                <span className="fw-semibold">{ diagnosisType?.title }</span>
                                                                                <span>{ diagnosisType?.description }</span>
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

            { (diagnosisTypes?.data?.length > 0) 
                && <PaginationLinks 
                    items={ diagnosisTypes } 
                    get_items={ getDiagnosisTypes } 
                    set_query={ setDiagnosisTypeQuery } /> } 
        </Layout>
    )
}
