import { useState } from 'react'; 
// import { Link } from 'react-router-dom'; 
// import { route } from '@/routes'; 
import { usePatients } from '@/hooks/usePatients.jsx'; 
// import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import PaginationMeter from '@/components/PaginationMeter.jsx';
import PaginationLinks from '@/components/PaginationLinks.jsx';
import Layout from '@/components/protected/Layout.jsx'; 
import UserComponent from '@/components/protected/nested-components/UserComponent.jsx'; 


export default function Index() {
    const [userQuery, setUserQuery] = useState({
        range: 'all', 
        page: 1, 
        limit: 10, 
    }); 
    const { patients, getPatients, loading } = usePatients(userQuery); 
    console.log(patients); 
    console.log(loading);

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">Patients</h2>
                {/* <Link to={ route('home.patients.create') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
                    <span className="mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor"
                            className="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                        </svg>
                    </span>
                    <span>Add</span>
                </Link> */}
            </div>

            <div className="d-flex justify-content-end pt-3">
                <span>
                    { (patients?.data?.length > 0) 
                        && <PaginationMeter 
                                current_page={ patients?.meta?.current_page } 
                                limit={ patients?.meta?.limit } 
                                total_pages={ patients?.meta?.total_pages } 
                                total_results={ patients?.meta?.total_results } /> } 
                </span> 
            </div> 

            <section className="pt-3">
                { (loading == true) 
                    ?   <div className="py-4 d-flex justify-content-center align-items-center">
                            <div className="spinner-grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>  
                        </div>
                            : ((loading == false) && ((patients?.data?.length < 1) || patients?.length < 1)) 
                                ?   <div className="py-4 d-flex justify-content-center align-items-center">
                                        <span>There are no patients for the specified criteria.</span>
                                    </div> 
                                        : ((loading == false) && (patients?.data?.length > 0)) 
                                            ?   <ul className="patients list-unstyled d-flex flex-column align-items-start gap-3">
                                                    { (patients?.data?.map((patient, index) => {
                                                        return (
                                                            <UserComponent 
                                                                index={ index } 
                                                                key={ patient?._id } 
                                                                users={ patients } 
                                                                user={ patient } /> 
                                                        )
                                                    })) }
                                                </ul>
                                                : <></> }
            </section>

            { (patients?.data?.length > 0) 
                && <PaginationLinks 
                    items={ patients } 
                    get_items={ getPatients } 
                    query={ userQuery } 
                    set_query={ setUserQuery } /> } 
        </Layout>
    )
}
