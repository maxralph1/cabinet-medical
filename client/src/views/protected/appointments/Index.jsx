import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">Appointments</h2>
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
                <span>1 - 10 of 25 results</span>
            </div>

            <section className="pt-3">
                <ul className="appointments list-unstyled d-flex flex-column align-items-start gap-3">
                    <li className="appointment w-100 border border-1 border-radius-25 d-flex flex-column px-3 py-4">
                        <span>#1</span> 

                        <section className="doctor-patient d-flex justify-content-start gap-4 flex-wrap pt-3">
                            <picture>
                                <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" media="(orientation: portrait)" />
                                <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" className="object-fit-cover border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                            </picture>
                            <div className="d-flex flex-column">
                                <span className="fw-semibold">Dr. Nasri Alban</span>
                                <span>Gynaecologist</span>
                            </div>
                        </section>
                        <section className="schedule w-100 d-flex justify-content-end gap-4 flex-wrap pt-3">
                            <div className="appointment-date-time d-flex align-items-center gap-1">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        className="bi bi-calendar-event" viewBox="0 0 16 16">
                                        <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                        <path
                                            d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                    </svg>
                                </span>
                                <span>22 Nov 2025, 22:30</span>
                            </div>
                            <div className="appointment-length d-flex align-items-center gap-1">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        className="bi bi-stopwatch-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584l.013-.012.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354-.012.012A6.97 6.97 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0" />
                                    </svg>
                                </span>
                                <span>30 minutes</span>
                            </div>
                        </section>
                    </li>
                    <li className="appointment w-100 border border-1 border-radius-25 d-flex flex-column px-3 py-4">
                        <span>#2</span> 

                        <section className="doctor-patient d-flex justify-content-start gap-4 flex-wrap pt-3">
                            <picture>
                                <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" media="(orientation: portrait)" />
                                <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" className="object-fit-cover border-radius-50" style={{ width: '50px', height: '50px' }} alt="" />
                            </picture>
                            <div className="d-flex flex-column">
                                <span className="fw-semibold">Nasri Alban</span>
                                <span>Patient</span>
                                <span className="pt-2">Purpose:&nbsp;<span className="fw-semibold">Pregnancy first trimester investigation</span></span>
                            </div>
                        </section>
                        <section className="schedule w-100 d-flex justify-content-end gap-4 flex-wrap pt-3">
                            <div className="appointment-date-time d-flex align-items-center gap-1">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        className="bi bi-calendar-event" viewBox="0 0 16 16">
                                        <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                        <path
                                            d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                    </svg>
                                </span>
                                <span>22 Nov 2025, 22:30</span>
                            </div>
                            <div className="appointment-length d-flex align-items-center gap-1">
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        className="bi bi-stopwatch-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584l.013-.012.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354-.012.012A6.97 6.97 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0" />
                                    </svg>
                                </span>
                                <span>30 minutes</span>
                            </div>
                        </section>
                    </li>
                </ul>
            </section>

            <section className="pagination-links d-flex justify-content-end align-items-center gap-3 pt-4">
                <span className="btn btn-sm btn-outline-secondary border-radius-25">
                    1
                </span>
                <span className="btn btn-sm btn-outline-secondary border-radius-25">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-left" viewBox="0 0 16 16">
                        <path
                            d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753" />
                    </svg>
                </span>
                <span className="btn btn-sm btn-outline-secondary border-radius-25">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right" viewBox="0 0 16 16">
                        <path
                            d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753" />
                    </svg>
                </span>
                <span className="btn btn-sm btn-outline-secondary border-radius-25">
                    20
                </span>
            </section>
        </Layout>
    )
}
