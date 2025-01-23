import { useState } from 'react'; 
// import { Link } from 'react-router-dom'; 
// import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useProfessionals } from '@/hooks/useProfessionals.jsx'; 
// import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import PaginationMeter from '@/components/PaginationMeter.jsx';
import PaginationLinks from '@/components/PaginationLinks.jsx';
import UserComponent from '@/components/protected/nested-components/UserComponent.jsx';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const [userQuery, setUserQuery] = useState({
        range: 'all', 
        role: 'general_practitioner', 
        page: 1, 
        limit: 10, 
    }); 
    const { professionals, getProfessionals, loading } = useProfessionals(userQuery); 
    console.log(professionals); 
    console.log(loading);

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">Professionals</h2>
                {/* <Link to={ route('home.professionals.create') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
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
                    { (professionals?.data?.length > 0) 
                        && <PaginationMeter 
                                current_page={ professionals?.meta?.current_page } 
                                limit={ professionals?.meta?.limit } 
                                total_pages={ professionals?.meta?.total_pages } 
                                total_results={ professionals?.meta?.total_results } /> } 
                </span> 
            </div> 

            <div className="fs-6 d-flex align-items-center row-gap-1 column-gap-2 flex-wrap">
                <span 
                    type="button" 
                    onClick={ async () => {
                        await setUserQuery(prevState => ({
                            ...prevState,
                            role: 'all', 
                            page: 1
                        })); 
                        await getProfessionals(userQuery?.role); 
                    } }
                    className="d-flex flex-wrap column-gap-3 row-gap-2 pt-2 pb-3">
                    <span className="btn btn-sm btn-outline-secondary border-radius-35 py-0">
                        All
                    </span>
                </span>
                <span 
                    type="button" 
                    onClick={ async () => {
                        await setUserQuery(prevState => ({
                            ...prevState,
                            role: 'general_practitioner', 
                            page: 1
                        })); 
                        await getProfessionals(userQuery?.role); 
                    } }
                    className="d-flex flex-wrap column-gap-3 row-gap-2 pt-2 pb-3">
                    <span className="btn btn-sm btn-outline-secondary border-radius-35 py-0">
                        General Practitioners
                    </span>
                </span>
                <span 
                    type="button" 
                    onClick={ async () => {
                        await setUserQuery(prevState => ({
                            ...prevState,
                            role: 'gynaecologist', 
                            page: 1
                        })); 
                        await getProfessionals(userQuery?.role); 
                    } }
                    className="d-flex flex-wrap column-gap-3 row-gap-2 pt-2 pb-3">
                    <span className="btn btn-sm btn-outline-secondary border-radius-35 py-0">
                        Gynaecologists
                    </span>
                </span>
                <span 
                    type="button" 
                    onClick={ async () => {
                        await setUserQuery(prevState => ({
                            ...prevState,
                            role: 'nurse', 
                            page: 1
                        })); 
                        await getProfessionals(userQuery?.role); 
                    } }
                    className="d-flex flex-wrap column-gap-3 row-gap-2 pt-2 pb-3">
                    <span className="btn btn-sm btn-outline-secondary border-radius-35 py-0">
                        Nurses
                    </span>
                </span>
            </div>

            <section className="pt-3">
                { (loading == true) 
                    ?   <div className="py-4 d-flex justify-content-center align-items-center">
                            <div className="spinner-grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>  
                        </div>
                            : ((loading == false) && ((professionals?.data?.length < 1) || professionals?.length < 1)) 
                                ?   <div className="py-4 d-flex justify-content-center align-items-center">
                                        <span>There are no professionals for the specified criteria.</span>
                                    </div> 
                                        : ((loading == false) && (professionals?.data?.length > 0)) 
                                            ?   <ul className="professionals list-unstyled d-flex flex-column align-items-start gap-3">
                                                    { (professionals?.data?.map((professional, index) => {
                                                        return (
                                                            <UserComponent 
                                                                index={ index } 
                                                                key={ professional?._id } 
                                                                users={ professionals } 
                                                                user={ professional } /> 
                                                        )
                                                    })) }
                                                </ul>
                                                : <></> }
            </section>

            { (professionals?.data?.length > 0) 
                && <PaginationLinks 
                    items={ professionals } 
                    get_items={ getProfessionals } 
                    set_query={ setUserQuery } /> } 
        </Layout>
    )
}
