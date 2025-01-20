import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { usePatients } from '@/hooks/usePatients.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import PaginationMeter from '@/components/PaginationMeter.jsx';
import PaginationLinks from '@/components/PaginationLinks.jsx';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const [userQuery, setUserQuery] = useState({
        range: 'all', 
        role: 'general_practitioner', 
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
                <Link to={ route('home.appointments.create') } className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
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

            <div className="d-flex justify-content-end pt-4">
                {/* <span>1 - 10 of 25 results</span> */}
                <span>
                    { (patients?.data?.length > 0) 
                        && <PaginationMeter 
                                current_page={ patients?.meta?.current_page } 
                                limit={ patients?.meta?.limit } 
                                total_pages={ patients?.meta?.total_pages } 
                                total_results={ patients?.meta?.total_results } /> } 
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
                        await getPatients(userQuery?.role); 
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
                        await getPatients(userQuery?.role); 
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
                        await getPatients(userQuery?.role); 
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
                        await getPatients(userQuery?.role); 
                    } }
                    className="d-flex flex-wrap column-gap-3 row-gap-2 pt-2 pb-3">
                    <span className="btn btn-sm btn-outline-secondary border-radius-35 py-0">
                        Nurses
                    </span>
                </span>
            </div>

            <section className="pt-3">
                { (loading == true) 
                    ? <></> 
                        : ((loading == false) && (patients?.data?.length == 0)) 
                            ? <></> 
                                : ((loading == false) && (patients?.data?.length > 0)) 
                                    ?   <ul className="patients list-unstyled d-flex flex-column align-items-start gap-3">
                                            { (patients?.data?.map((patient, index) => {
                                                return (
                                                    <li key={ patient?._id } className="patient w-100 border border-1 border-radius-25 d-flex flex-column px-3 py-4">
                                                        {/* <span>#1</span>  */}
                                                        <span className="">#
                                                            { (patients?.meta?.current_page != 1) 
                                                                ? (((patients?.meta?.current_page - 1) * limit) + (index + 1))
                                                                : patients?.meta?.current_page * (index + 1) }
                                                        </span>

                                                        <section className="doctor-patient d-flex justify-content-start gap-4 flex-wrap pt-3">
                                                            <picture>
                                                                <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" media="(orientation: portrait)" />
                                                                <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" className="object-fit-cover border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                                                            </picture>
                                                            <div className="d-flex flex-column">
                                                                <span className="fw-semibold">
                                                                    { patient.first_name + ' ' + patient?.last_name }</span>
                                                            </div>
                                                        </section>
                                                        <section className="schedule w-100 d-flex justify-content-end align-items-center gap-1 flex-wrap pt-3">
                                                            <small className="text-secondary">Account created:&nbsp;</small><span>{ dayjs.utc(patient?.created_at).fromNow() }</span>
                                                        </section>
                                                    </li>
                                                )
                                            })) }
                                        </ul>
                                        : <></> }
            </section>

            <PaginationLinks />
        </Layout>
    )
}
