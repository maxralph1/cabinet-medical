import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Create() {
    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">
                    <Link 
                        to={ route('home.appointments.index') } className="">Appointments</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>Add Appointment</span>
                </h2>
            </div>

            <section className="pt-3">
                <div className="search">
                    <div className="search-container border border-secondary" style={{ minWidth: '250px', maxWidth: '300px' }}>
                        <span className="voice-icon cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                className="bi bi-mic-fill" viewBox="0 0 16 16">
                                <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z"></path>
                                <path
                                    d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5">
                                </path>
                            </svg>
                        </span>
                        <input type="text" placeholder="Search patient ..." className="text-end" />
                        <span className="search-icon cursor-pointer">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z"
                                    stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </span>
                    </div>
                </div> 

                <section className="user-results">
                    <ul className="list-unstyled d-flex flex-column gap-3 pt-3">
                        <li className="border border-1 border-secondary border-radius-25 p-3" style={{ maxWidth: '700px' }}>
                            <div className="d-flex justify-content-end">
                                <div className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
                                    <span className="mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-plus-lg"
                                            viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                                        </svg>
                                    </span>
                                    <span>Select</span>
                                </div>
                            </div>
                            <div className="patient-doctor d-flex justify-content-start align-items-center gap-3 pt-2">
                                <picture>
                                    <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                        media="(orientation: portrait)" />
                                    <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                        className="object-fit-cover border border-1 border-secondary border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                                </picture>
                                <div className="d-flex flex-column">
                                    <span className="fw-semibold">Anita Joseph</span>
                                    <span>Patient has a history of diabetes in lineage.</span>
                                </div>
                            </div>
                        </li>
                        <li className="border border-1 border-secondary border-radius-25 p-3" style={{ maxWidth: '700px' }}>
                            <div className="d-flex justify-content-end">
                                <div className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
                                    <span className="mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-plus-lg"
                                            viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                                        </svg>
                                    </span>
                                    <span>Select</span>
                                </div>
                            </div>
                            <div className="patient-doctor d-flex justify-content-start align-items-center gap-3 pt-2">
                                <picture>
                                    <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                        media="(orientation: portrait)" />
                                    <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                        className="object-fit-cover border border-1 border-secondary border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                                </picture>
                                <div className="d-flex flex-column">
                                    <span className="fw-semibold">Maria Joseph</span>
                                    <span>Patient has a history of diabetes in lineage.</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </section> 

                <section className="selected-user pt-4">
                    <div className="patient-doctor d-flex justify-content-start align-items-center gap-3 pt-2">
                        <picture>
                            <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                media="(orientation: portrait)" />
                            <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                className="object-fit-cover border border-1 border-secondary border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                        </picture>
                        <div className="d-flex flex-column">
                            <span className="fw-semibold">Anita Joseph</span>
                            <span>Patient has a history of diabetes in lineage.</span>
                        </div>
                    </div>
                </section>

                <section className="appointment-booking pt-4">
                    <h3 className="border-bottom pb-1 fs-5">Appointment Booking</h3> 

                    <section>
                        
                    </section>
                </section>
            </section>
        </Layout>
    )
}
