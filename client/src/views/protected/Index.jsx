import { useContext } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Index() {
    const { user } = useContext(AuthContext); 
    const date = new Date();
    const hour = date.getHours(); 
    
    return (
        <Layout>
            <div className="salutation d-flex flex-column">
                <span className="text-secondary fs-5">Hi { user?.user?.first_name + ' ' + user?.user?.last_name},</span>
                <span className="fs-1 fw-light">Good&nbsp;
                    { hour < 12 
                        ? 'morning' 
                            : hour < 16 
                            ? 'afternoon' 
                                : hour >= 16 
                                ? 'evening' 
                                    : '' }
                </span>
                <div className="d-flex flex-column gap-2 pt-2 align-items-end">
                    <span>You have&nbsp;<a href="#" className="fw-semibold text-warning">1 appointment&nbsp;</a>today in the next <span className="fw-semibold">30 minutes</span>.</span>
                    <span>You have&nbsp;<a href="#" className="fw-semibold text-warning">1 ongoing regimen&nbsp;</a>. Ensure to take your medication.</span>
                </div>
            </div>
            
            <section className="dashboard-meters w-100">
                <section className="admin-meters gap-3 pt-4">
                    <article className="revenue border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start">
                        <span className="d-flex justify-content-center align-items-center border-radius-50 p-2"
                            style={{ backgroundColor: '#f2f2f2' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-dollar"
                                viewBox="0 0 16 16">
                                <path
                                    d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z" />
                            </svg>
                        </span>
                        <span>Total Revenue</span>
                        <span className="fs-4 fw-semibold">$100,675</span>
                        <span className="bg-body-tertiary"><small>Updated January 9, 2025</small></span>
                    </article>
                    
                    <article className="appointments border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start">
                        <span className="d-flex justify-content-center align-items-center border-radius-50 p-2"
                            style={{ backgroundColor: '#f2f2f2' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-event"
                                viewBox="0 0 16 16">
                                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                <path
                                    d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                            </svg>
                        </span>
                        <span>Total Appointments</span>
                        <span className="fs-4 fw-semibold">13,675</span>
                        <span className="bg-body-tertiary"><small>Updated January 9, 2025</small></span>
                    </article>
                    
                    <article className="doctors border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start">
                        <span className="d-flex justify-content-center align-items-center border-radius-50 p-2"
                            style={{ backgroundColor: '#f2f2f2' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-dollar"
                                viewBox="0 0 16 16">
                                <path
                                    d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z" />
                            </svg>
                        </span>
                        <span>Total Doctors</span>
                        <span className="fs-4 fw-semibold">13,675</span>
                        <span className="bg-body-tertiary"><small>Updated January 9, 2025</small></span>
                    </article>
                    
                    <article className="patients border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start">
                        <span className="d-flex justify-content-center align-items-center border-radius-50 p-2"
                            style={{ backgroundColor: '#f2f2f2' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-standing"
                                viewBox="0 0 16 16">
                                <path
                                    d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M6 6.75v8.5a.75.75 0 0 0 1.5 0V10.5a.5.5 0 0 1 1 0v4.75a.75.75 0 0 0 1.5 0v-8.5a.25.25 0 1 1 .5 0v2.5a.75.75 0 0 0 1.5 0V6.5a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v2.75a.75.75 0 0 0 1.5 0v-2.5a.25.25 0 0 1 .5 0" />
                            </svg>
                        </span>
                        <span>Total Patients</span>
                        <span className="fs-4 fw-semibold">13,675</span>
                        <span className="bg-body-tertiary"><small>Updated January 9, 2025</small></span>
                    </article>
                </section>

                <section className="patient-meters align-items-center d-flex gap-3 flex-wrap pt-4">
                    <article className="heart-rate border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start">
                        <div className="w-100 d-flex justify-content-between align-items-center">
                            <span>Heart Rate</span>
                            <span className="d-flex justify-content-center align-items-center border-radius-50 p-2"
                                style={{ backgroundColor: '#f2f2f2' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-pulse"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053.918 3.995.78 5.323 1.508 7H.43c-2.128-5.697 4.165-8.83 7.394-5.857q.09.083.176.171a3 3 0 0 1 .176-.17c3.23-2.974 9.522.159 7.394 5.856h-1.078c.728-1.677.59-3.005.108-3.947C13.486.878 10.4.28 8.717 2.01zM2.212 10h1.315C4.593 11.183 6.05 12.458 8 13.795c1.949-1.337 3.407-2.612 4.473-3.795h1.315c-1.265 1.566-3.14 3.25-5.788 5-2.648-1.75-4.523-3.434-5.788-5" />
                                    <path
                                        d="M10.464 3.314a.5.5 0 0 0-.945.049L7.921 8.956 6.464 5.314a.5.5 0 0 0-.88-.091L3.732 8H.5a.5.5 0 0 0 0 1H4a.5.5 0 0 0 .416-.223l1.473-2.209 1.647 4.118a.5.5 0 0 0 .945-.049l1.598-5.593 1.457 3.642A.5.5 0 0 0 12 9h3.5a.5.5 0 0 0 0-1h-3.162z" />
                                </svg>
                            </span>
                        </div>
                        <span className="fs-6 fw-semibold">120BPM</span>
                        <span className="bg-body-tertiary"><small>Updated January 9, 2025</small></span>
                    </article>
                    <article className="white-blood-cell border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start">
                        <div className="w-100 d-flex justify-content-between align-items-center">
                            <span>White Blood Cells</span>
                            <span className="d-flex justify-content-center align-items-center border-radius-50 p-2" style={{ backgroundColor: '#f2f2f2' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-droplet" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M7.21.8C7.69.295 8 0 8 0q.164.544.371 1.038c.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8m.413 1.021A31 31 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/>
                                    <path fill-rule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87z"/>
                                </svg>
                            </span>
                        </div>
                        <span className="fs-6 fw-semibold">5,000/<span className="micro">μ</span>L</span>
                        <span className="bg-body-tertiary"><small>Updated January 9, 2025</small></span>
                    </article>
                    <article className="red-blood-cell border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start">
                        <div className="w-100 d-flex justify-content-between align-items-center">
                            <span>Red Blood Cells</span>
                            <span className="d-flex justify-content-center align-items-center border-radius-50 p-2" style={{ backgroundColor: '#f2f2f2' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-droplet-fill" viewBox="0 0 16 16">
                                    <path d="M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6M6.646 4.646l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448c.82-1.641 1.717-2.753 2.093-3.13"/>
                                </svg>
                            </span>
                        </div>
                        <span className="fs-6 fw-semibold">5,000,000/<span className="micro">μ</span>L</span>
                        <span className="bg-body-tertiary"><small>Updated January 9, 2025</small></span>
                    </article>
                    <article className="red-blood-cell border border-1 border-tertiary border-radius-25 p-3 d-flex flex-column gap-2 align-items-start">
                        <div className="w-100 d-flex justify-content-between align-items-center">
                            <span>Liquid Volume</span>
                            <span className="d-flex justify-content-center align-items-center border-radius-50 p-2" style={{ backgroundColor: '#f2f2f2' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-moisture"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M13.5 0a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V7.5h-1.5a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V15h-1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5zM7 1.5l.364-.343a.5.5 0 0 0-.728 0l-.002.002-.006.007-.022.023-.08.088a29 29 0 0 0-1.274 1.517c-.769.983-1.714 2.325-2.385 3.727C2.368 7.564 2 8.682 2 9.733 2 12.614 4.212 15 7 15s5-2.386 5-5.267c0-1.05-.368-2.169-.867-3.212-.671-1.402-1.616-2.744-2.385-3.727a29 29 0 0 0-1.354-1.605l-.022-.023-.006-.007-.002-.001zm0 0-.364-.343zm-.016.766L7 2.247l.016.019c.24.274.572.667.944 1.144.611.781 1.32 1.776 1.901 2.827H4.14c.58-1.051 1.29-2.046 1.9-2.827.373-.477.706-.87.945-1.144zM3 9.733c0-.755.244-1.612.638-2.496h6.724c.395.884.638 1.741.638 2.496C11 12.117 9.182 14 7 14s-4-1.883-4-4.267" />
                                </svg>
                            </span>
                        </div>
                        <span className="fs-6 fw-semibold">4L</span>
                        <span className="bg-body-tertiary"><small>Updated January 9, 2025</small></span>
                    </article>
                    <span className="d-flex flex-column align-items-center justify-content-center gap-2 border-radius-25 border-1 p-2" style={{ width: '100px', height: '100px', borderStyle: 'dashed' }}>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-plus-circle-fill"
                                viewBox="0 0 16 16">
                                <path
                                    d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                            </svg>
                        </span>
                        <span><small>Add Widget</small></span>
                    </span>
                </section>
            </section>

            <section className="appointments pt-4 gap-3">
                <section className="upcoming border border-1 border-tertiary border-radius-25 px-3 py-4 d-flex flex-column gap-2 align-items-start">
                    <h2 className="fs-5">Upcoming appointment</h2>
                    <section className="doctor w-100 gap-3">
                        <div className="info d-flex flex-column align-items-start gap-1">
                            <span>Dr. Sasmita Ra&nbsp;
                                <span className="chat-with-doctor">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat-left-text"
                                        viewBox="0 0 16 16">
                                        <path
                                            d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                        <path
                                            d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                                    </svg>
                                </span>
                            </span>
                            <span className="badge rounded-pill text-bg-info">Gynaecologist</span>
                        </div>
                        <div className="image">
                            <picture>
                                <source srcSet="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" media="(orientation: portrait)" />
                                <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain" className="object-fit-cover border-radius-25" alt="" />
                            </picture>
                        </div>
                    </section>
                    <section className="about-doctor-patient pt-3">
                        <p>Dr. Sasmita is a seasoned gynaecologist with 10 years experience working at busy wards. He is a graduate of the Cambridge University, UK.</p>
                    </section> 
                    <section className="appointment-schedule w-100 d-flex justify-content-between">
                        <div className="appointment-date-time d-flex align-items-center gap-1">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-event"
                                viewBox="0 0 16 16">
                                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                    <path
                                        d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                </svg>
                            </span>
                            <span>22 Nov, 22:30</span>
                        </div>
                        <div className="appointment-length d-flex align-items-center gap-1">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-stopwatch-fill"
                                    viewBox="0 0 16 16">
                                    <path
                                        d="M6.5 0a.5.5 0 0 0 0 1H7v1.07A7.001 7.001 0 0 0 8 16a7 7 0 0 0 5.29-11.584l.013-.012.354-.354.353.354a.5.5 0 1 0 .707-.707l-1.414-1.415a.5.5 0 1 0-.707.707l.354.354-.354.354-.012.012A6.97 6.97 0 0 0 9 2.071V1h.5a.5.5 0 0 0 0-1zm2 5.6V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 1 1 1 0" />
                                </svg>
                            </span>
                            <span>30 minutes</span>
                        </div>
                    </section>
                    <section className="w-100 d-flex justify-content-end pt-3">
                        <button className="btn btn-sm btn-warning border-radius-35">Check Appointments</button>
                    </section>
                </section>

                <section className="latest border border-1 border-tertiary border-radius-25 px-3 py-4">
                    <div className="d-flex justify-content-between">
                        <h2 className="fs-5">Latest Appointments</h2>
                        <span className="btn btn-sm btn-outline-secondary border-radius-35 fw-semibold d-flex align-items-center">
                            <span className="mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-plus-lg"
                                    viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                                </svg>
                            </span>
                            <span>Schedule</span>
                        </span>
                    </div>
                    <small className="text-secondary">Stay updated on your recent healthcare visits</small>
                    <section className="table-responsive pt-3 w-100">
                        <table className="table table-borderless">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Patient/Doctor Name</th>
                                    <th scope="col" className="d-none d-md-table-cell">Phone</th>
                                    <th scope="col" className="d-none d-md-table-cell">Date, Time</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Mark Twain</td>
                                    <td className="d-none d-md-table-cell">+230579687</td>
                                    <td className="d-none d-md-table-cell">22 Nov. 2025, 12:35</td>
                                    <td><span className="badge rounded-pill text-bg-warning">Pending</span></td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Somto Somzi</td>
                                    <td className="d-none d-md-table-cell">579687</td>
                                    <td className="d-none d-md-table-cell">22 Nov 2026, 12:34</td>
                                    <td><span className="badge rounded-pill text-bg-danger">Cancelled</span></td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>Somto Somzi</td>
                                    <td className="d-none d-md-table-cell">579687</td>
                                    <td className="d-none d-md-table-cell">22 Nov 2026, 10:10</td>
                                    <td><span className="badge rounded-pill text-bg-success">Ongoing</span></td> 
                                </tr>
                                <tr>
                                    <th scope="row">4</th>
                                    <td>Somto Somzi</td>
                                    <td className="d-none d-md-table-cell">579687</td>
                                    <td className="d-none d-md-table-cell">22 Nov 2026, 10:10</td>
                                    <td><span className="badge rounded-pill text-bg-secondary">Took place</span></td> 
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </section>
            </section>
        </Layout>
    )
}
