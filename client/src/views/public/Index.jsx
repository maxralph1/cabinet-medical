import Layout from '@/components/public/Layout.jsx'; 
import NazimImage from '@/assets/images/nazim-transparent.png'; 


export default function Index() {
    const date = new Date();
    const hour = date.getHours(); 

    return (
        <Layout>
            <>
                <section className="hero row align-items-center pt-4">
                    <div className="col-12 col-md-6">
                        <h2 className="text-center text-md-start fs-1">
                            <span className="fw-light">Good&nbsp;
                                { hour < 12 
                                    ? 'morning' 
                                        : hour < 16 
                                        ? 'afternoon' 
                                            : hour >= 16 
                                            ? 'evening' 
                                                : '' }
                            !</span>&nbsp;
                            <span>Welcome to Cabinet Medical Clinic.</span>
                        </h2>
                        <p className="text-center text-md-start fs-3 fw-semibold d-flex flex-column gap-0">
                            <span>Ready to enhance your health and wellness?</span>
                            <span>We can be of help.</span></p>
                        <p>Providing personalized, compassionate and professional care to meet your medical needs. We combine medical expertise with a patient-centered approach to ensure you receive the best care possible, ever step of the way.</p>
                        <p className="text-center text-md-start">
                            <a href="#" className="btn btn-outline-info border-radius-35">Book an appointment</a>
                        </p>
                    </div>

                    <div className="d-none d-md-block col-md-6">
                        <img src={ NazimImage } alt="Dr. Nazim Subrottee" className="img-fluid border-radius-25" />
                    </div>
                </section>

                <section className="hero-2 row align-items-center pt-5">
                    <div className="col-sm-12 col-md-6">
                        <img src="#" alt="" className="img-fluid" />
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <h2 className="text-center text-md-start text-uppercase fs-3">
                            <span className="text-info">Cabinet Medical:&nbsp;</span>
                            <span>Your Health, Our Priority</span>
                        </h2>
                        <p className="text-center text-md-start">Experience compassionate, top-tier care at Cabinet Médical, where your well-being comes first. Under the expert guidance of <a href="#">Dr. Nazim Subrottee</a>, a committed and dynamic General Practitioner, we provide personalized medical services for all
                        ages. From consultations and home visits to specialized care, we are dedicated to delivering exceptional treatment
                        tailored to your needs.</p>
                        <p className="text-center text-md-start">
                            <a href="#" className="btn btn-outline-info border-radius-35">Book an appointment</a>
                            <a href="#" className="btn btn-outline-danger border-radius-35 ms-2">Contact Us</a>
                        </p>
                    </div>
                </section>

                <section className="services pt-4">
                    <h2>Our Services</h2>
                    <div>
                        <ol>
                            <li>
                                <h3 className="fs-5">General Consultation and Follow-Up</h3>
                                <p>Get comprehensive medical care for all your health concerns. Our general consultations cover a wide range of health issues, from common illnesses to chronic conditions. We offer expert advice and thororugh follow-ups to ensure your health goals are met.</p>
                            </li>
                            <li>
                                <h3 className="fs-5">Point of Care Blood Tests</h3>
                                <p>On-the-spot testing for anemia, cholesterol, gout, and diabetes.</p>
                            </li>
                            <li>
                                <h3 className="fs-5">Home Visit</h3>
                                <p>Convenient care at the comfort of your home for patients unable to visit the clinic.</p>
                            </li>
                            <li>
                                <h3 className="fs-5">Elderly Care</h3>
                                <p>Specialized services to support the health and wellbeing of elderly patients.</p>
                            </li>
                            <li>
                                <h3 className="fs-5">Prescriptions and Administrations Tracking</h3>
                                <p>Accurate and prompt medical documentation.</p>
                            </li>
                            <li>
                                <h3 className="fs-5">Medical and Fitness Certificates</h3>
                                <p>Issuance of certificates for work, travel, or fitness.</p>
                            </li>
                            <li>
                                <h3 className="fs-5">Death Certificates</h3>
                                <p>Compassionate and timely assistance with medical documentation.</p>
                            </li>
                        </ol>

                        <div>
                            <img src="#" alt="" />
                        </div>
                    </div>
                </section>

                <section id="book-appointment" className="book-consultation py-4 text-center bg-body-tertiary">
                    <div className="card p-3 mx-2 mx-md-3 mx-lg-5">
                        <h2 className="text-uppercase fs-4 fw-bold pt-3">Book Consultation</h2>
                        <form className="form pt-3">
                            <div className="row g-2">
                                <div className="col-md">
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="first_name" placeholder="John" />
                                        <label htmlFor="first_name">First Name</label>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="last_name" placeholder="Doe" />
                                        <label htmlFor="last_name">Last Name</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="col-md mb-3">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="phone" placeholder="54818339" />
                                        <label htmlFor="phone">Phone</label>
                                    </div>
                                </div>
                                <div className="col-md mb-3">
                                    <div className="form-floating">
                                        <input type="email" className="form-control" id="floatingInputGrid" placeholder="name@example.com" />
                                        <label htmlFor="floatingInputGrid">Email address</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="col-md mb-3">
                                    <div className="form-floating">
                                        <input type="date" className="form-control" id="date" placeholder="54818339" />
                                        <label htmlFor="date">Date</label>
                                    </div>
                                </div>
                                <div className="col-md mb-3">
                                    <div className="form-floating">
                                        <input type="time" className="form-control" id="time" placeholder="name@example.com" />
                                        <label htmlFor="time">Time</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="col-md mb-3">
                                    <div className="form-floating">
                                        <select className="form-select" id="floatingSelectGrid">
                                            <option>Select services ...</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </select>
                                        <label htmlFor="floatingSelectGrid">Services</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="mb-3">
                                    <div className="form-floating">
                                        <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2"
                                            style={{ height: '100px' }}></textarea>
                                        <label htmlFor="floatingTextarea2">Comments</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2 my-3">
                                <p className="text-center text-md-start">
                                    <a href="#" className="btn btn-outline-info border-radius-35">Book an appointment</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </section>

                <section id="doctors" className="doctors text-center pt-5">
                    <h2 className="fw-bold">Our Qualified Doctors</h2>
                    <div>
                        <span>The aim of medicine is to prevent disease and prolong life; the idea of medicine is to eliminate the need for a physician.</span>
                    </div>
                    <section className="nav-scroller">
                        <ul className="doctors-list nav justify-content-between gap-5 py-3" style={{ width: '100vw', overflowY: 'hidden' }}>
                            <li className="d-flex flex-column align-items-center mb-3" style={{ maxWidth: '310px' }}>
                                <img src={ NazimImage } alt="" className="border-radius-15"
                                    style={{ minWidth: '150px', maxWidth: '300px', minHeight: '150px', maxHeight: '300px' }} />
                                <div className="pt-3 d-flex flex-column align-items-center">
                                    <h3 className="fs-5">Dr. Nazim Subrottee</h3>
                                    <p className="text-uppercase text-info fw-bold" style={{ fontSize: 'smaller' }}>General Practitioner</p>
                                    <p className="text-wrap" style={{ maxWidth: '310px' }}>General practitioner who studied at UCT (Cape Town, South Africa) and obtained clinical experience in
                                        Mauritius.</p>
                                    <p className="">
                                        <a href="#" className="btn btn-outline-info border-radius-35">Book now</a>
                                    </p>
                                </div>
                            </li>
                            <li className="d-flex flex-column align-items-center mb-3" style={{ maxWidth: '310px' }}>
                                <img src={ NazimImage } alt="" className="border-radius-15"
                                    style={{ minWidth: '150px', maxWidth: '300px', minHeight: '150px', maxHeight: '300px' }} />
                                <div className="pt-3 d-flex flex-column align-items-center">
                                    <h3 className="fs-5">Dr. Nazim Subrottee</h3>
                                    <p className="text-uppercase text-info fw-bold" style={{ fontSize: 'smaller' }}>General Practitioner</p>
                                    <p className="text-wrap" style={{ maxWidth: '310px' }}>General practitioner who studied at UCT (Cape Town, South Africa) and obtained clinical experience in
                                        Mauritius.</p>
                                    <p className="">
                                        <a href="#" className="btn btn-outline-info border-radius-35">Book now</a>
                                    </p>
                                </div>
                            </li>
                            <li className="d-flex flex-column align-items-center mb-3" style={{ maxWidth: '310px' }}>
                                <img src={ NazimImage } alt="" className="border-radius-15"
                                    style={{ minWidth: '150px', maxWidth: '300px', minHeight: '150px', maxHeight: '300px' }} />
                                <div className="pt-3 d-flex flex-column align-items-center">
                                    <h3 className="fs-5">Dr. Nazim Subrottee</h3>
                                    <p className="text-uppercase text-info fw-bold" style={{ fontSize: 'smaller' }}>General Practitioner</p>
                                    <p className="text-wrap" style={{ maxWidth: '310px' }}>General practitioner who studied at UCT (Cape Town, South Africa) and obtained clinical experience in
                                        Mauritius.</p>
                                    <p className="">
                                        <a href="#" className="btn btn-outline-info border-radius-35">Book now</a>
                                    </p>
                                </div>
                            </li>
                            <li className="d-flex flex-column align-items-center mb-3" style={{ maxWidth: '310px' }}>
                                <img src={ NazimImage } alt="" className="border-radius-15"
                                    style={{ minWidth: '150px', maxWidth: '300px', minHeight: '150px', maxHeight: '300px' }} />
                                <div className="pt-3 d-flex flex-column align-items-center">
                                    <h3 className="fs-5">Dr. Nazim Subrottee</h3>
                                    <p className="text-uppercase text-info fw-bold" style={{ fontSize: 'smaller' }}>General Practitioner</p>
                                    <p className="text-wrap" style={{ maxWidth: '310px' }}>General practitioner who studied at UCT (Cape Town, South Africa) and obtained clinical experience in
                                        Mauritius.</p>
                                    <p className="">
                                        <a href="#" className="btn btn-outline-info border-radius-35">Book now</a>
                                    </p>
                                </div>
                            </li>
                            <li className="d-flex flex-column align-items-center mb-3" style={{ maxWidth: '310px' }}>
                                <img src={ NazimImage } alt="" className="border-radius-15"
                                    style={{ minWidth: '150px', maxWidth: '300px', minHeight: '150px', maxHeight: '300px' }} />
                                <div className="pt-3 d-flex flex-column align-items-center">
                                    <h3 className="fs-5">Dr. Nazim Subrottee</h3>
                                    <p className="text-uppercase text-info fw-bold" style={{ fontSize: 'smaller' }}>General Practitioner</p>
                                    <p className="text-wrap" style={{ maxWidth: '310px' }}>General practitioner who studied at UCT (Cape Town, South Africa) and obtained clinical experience in
                                        Mauritius.</p>
                                    <p className="">
                                        <a href="#" className="btn btn-outline-info border-radius-35">Book now</a>
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </section>
                </section>

                <section className="stats pt-4">
                    <h2 className="text-uppercase fs-6 fw-bold">Fun Facts</h2>
                    <section className="row align-items-center">
                        <div className="col-sm-12 col-md-6 text-center text-md-start">
                            <p>Over 5,100 patients trust us.</p>
                            <p className="">
                                <a href="#" className="btn btn-outline-info border-radius-35">Book an Appointment</a>
                            </p>
                        </div>
                        <div className="col-sm-12 col-md-6">
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <div className="border-bottom pt-3 d-flex flex-column align-items-center align-items-md-start">
                                        <h3>5,100</h3>
                                        <p>Patients</p>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <div className="border-bottom pt-3 d-flex flex-column align-items-center align-items-md-start">
                                        <h3>5,100</h3>
                                        <p>Patients</p>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <div className="border-bottom pt-3 d-flex flex-column align-items-center align-items-md-start">
                                        <h3>5,100</h3>
                                        <p>Patients</p>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <div className="border-bottom pt-3 d-flex flex-column align-items-center align-items-md-start">
                                        <h3>5,100</h3>
                                        <p>Patients</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>

                <section className="blog text-center pt-4">
                    <h2>Health Tips</h2>
                    <p>Important tips about your health and fitness</p>

                    <section className="articles">
                        <ul className="articles-list row justify-content-center gap-5 py-3" style={{ width: '100vw', overflowY: 'hidden' }}>
                            <li className="col-sm-12 col-lg-4 d-flex flex-column align-items-center mb-3" style={{ maxWidth: '310px' }}>
                                <img src={ NazimImage } alt="" className="border-radius-15"
                                    style={{ minWidth: '150px', maxWidth: '300px', minHeight: '150px', maxHeight: '300px' }} />
                                <div className="pt-3 d-flex flex-column align-items-center">
                                    <div className="d-flex flex-column-reverse">
                                        <h3 className="fs-5 text-wrap">The Importance of Personalized Healthcare at Home</h3>
                                        <p className="fw-bold" style={{ fontSize: 'smaller' }}>
                                            <span className="text-secondary">Jan. 2, 2025&nbsp;
                                                <span style={{ fontSize: 'x-small' }}>by</span>
                                            </span>&nbsp;
                                            <span className="text-info">Nazim Subrottee</span>
                                        </p>
                                    </div>
                                    <p className="text-wrap" style={{ maxWidth: '310px' }}>
                                        In recent years, there has been a growing need for personalized healthcare services that cater to patients in the
                                        comfort of their homes.
                                    </p>
                                    <p className="">
                                        <a href="#" className="btn btn-outline-info border-radius-35">Read more</a>
                                    </p>
                                </div>
                            </li>
                            <li className="col-sm-12 col-lg-4 d-flex flex-column align-items-center mb-3" style={{ maxWidth: '310px' }}>
                                <img src={ NazimImage } alt="" className="border-radius-15"
                                    style={{ minWidth: '150px', maxWidth: '300px', minHeight: '150px', maxHeight: '300px' }} />
                                <div className="pt-3 d-flex flex-column align-items-center">
                                    <div className="d-flex flex-column-reverse">
                                        <h3 className="fs-5 text-wrap">The Importance of Personalized Healthcare at Home</h3>
                                        <p className="fw-bold" style={{ fontSize: 'smaller' }}>
                                            <span className="text-secondary">Jan. 2, 2025&nbsp;
                                                <span style={{ fontSize: 'x-small' }}>by</span>
                                            </span>&nbsp;
                                            <span className="text-info">Nazim Subrottee</span>
                                        </p>
                                    </div>
                                    <p className="text-wrap" style={{ maxWidth: '310px' }}>
                                        In recent years, there has been a growing need for personalized healthcare services that cater to patients in the
                                        comfort of their homes.
                                    </p>
                                    <p className="">
                                        <a href="#" className="btn btn-outline-info border-radius-35">Read more</a>
                                    </p>
                                </div>
                            </li>
                            <li className="col-sm-12 col-lg-4 d-flex flex-column align-items-center mb-3" style={{ maxWidth: '310px' }}>
                                <img src={ NazimImage } alt="" className="border-radius-15"
                                    style={{ minWidth: '150px', maxWidth: '300px', minHeight: '150px', maxHeight: '300px' }} />
                                <div className="pt-3 d-flex flex-column align-items-center">
                                    <div className="d-flex flex-column-reverse">
                                        <h3 className="fs-5 text-wrap">The Importance of Personalized Healthcare at Home</h3>
                                        <p className="fw-bold" style={{ fontSize: 'smaller' }}>
                                            <span className="text-secondary">Jan. 2, 2025&nbsp;
                                                <span style={{ fontSize: 'x-small' }}>by</span>
                                            </span>&nbsp;
                                            <span className="text-info">Nazim Subrottee</span>
                                        </p>
                                    </div>
                                    <p className="text-wrap" style={{ maxWidth: '310px' }}>
                                        In recent years, there has been a growing need for personalized healthcare services that cater to patients in the
                                        comfort of their homes.
                                    </p>
                                    <p className="">
                                        <a href="#" className="btn btn-outline-info border-radius-35">Read more</a>
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </section>
                </section>

                <section className="testimonials text-center pt-4">
                    <h2 className="text-uppercase fs-6">Testimonials</h2>

                    <section className="w-100 row justify-content-md-between align-items-md-center row-gap-3 pt-3">
                        <div className="col-sm-12 col-md-6 text-center text-md-start">
                            <p className="fs-3">Our Clients Say</p>
                        </div>
                        <div id="carouselExampleAutoplaying" className="col-sm-12 col-md-6 carousel slide" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <p className="text-center text-md-end">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid debitis laboriosam corporis laborum odit, ullam perferendis vel! Culpa explicabo quaerat soluta tempora numquam odio fuga!</p>
                                    <p className="text-end">-&nbsp;<span className="fst-italic">John Doe</span></p>
                                </div>
                                <div className="carousel-item">
                                    <p className="text-center text-md-end">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid debitis laboriosam corporis laborum odit, ullam perferendis vel! Culpa explicabo quaerat soluta tempora numquam odio fuga!</p>
                                    <p className="text-end">-&nbsp;<span className="fst-italic">John Doe</span></p>
                                </div>
                                <div className="carousel-item">
                                    <p className="text-center text-md-end">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid debitis laboriosam corporis laborum odit, ullam perferendis vel! Culpa explicabo quaerat soluta tempora numquam odio fuga!</p>
                                    <p className="text-end">-&nbsp;<span className="fst-italic">John Doe</span></p>
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying"
                                data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying"
                                data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </section>
                </section>

                <section id="contact-us" className="contact pt-5">
                    <h2 className="text-center">Contact Us</h2>

                    <section className="row justify-content-center align-items-center gap-3 pt-3">
                        <article className="bg-body-tertiary border-radius-25 col-sm-12 col-lg-4 d-flex flex-column align-items-center justify-content-center gap-3 p-3" style={{ width: '250px', height: '225px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill"
                                viewBox="0 0 16 16">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                            </svg>
                            <span className="text-center">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa quibusdam adipisci voluptas. Et, quae vero.</span>
                        </article>
                        <article className="bg-body-tertiary border-radius-25 col-sm-12 col-lg-4 d-flex flex-column align-items-center justify-content-center gap-3 p-3" style={{ width: '250px', height: '225px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-phone-fill"
                                viewBox="0 0 16 16">
                                <path d="M3 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm6 11a1 1 0 1 0-2 0 1 1 0 0 0 2 0" />
                            </svg>
                            <a href="tel:+23054818339">+230 5481 8339</a>
                        </article>
                        <article className="bg-body-tertiary border-radius-25 col-sm-12 col-lg-4 d-flex flex-column align-items-center justify-content-center gap-3 p-3" style={{ width: '250px', height: '225px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-at-fill"
                                viewBox="0 0 16 16">
                                <path
                                    d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2zm-2 9.8V4.698l5.803 3.546zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586zM16 9.671V4.697l-5.803 3.546.338.208A4.5 4.5 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671" />
                                <path
                                    d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791" />
                            </svg>
                            <a
                                href="mailto:drnazim.subrottee@gmail.com?subject=Hello%20there&body=I%20would%20like%20to%20&nbsp;...">drnazim.subrottee@gmail.com</a>
                        </article>
                    </section>

                    <section className="row row-gap-5 pt-4">
                        <div className="col-sm-12 col-md-6 order-1 order-md-0 border-radius-25">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d159635.9642232964!2d57.426036514845116!3d-20.063555572287292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x217d01fe2adfbccd%3A0x215a4812b184b707!2sCabinet%20M%C3%A9dical%20-%20Dr.%20Nazim%20Subrottee%2C%20Robin%20Plaza%2C%20Royal%20road%2C%20Goodlands!3m2!1d-20.037483899999998!2d57.6496802!4m5!1s0x217d01fe2adfbccd%3A0x215a4812b184b707!2sCabinet%20M%C3%A9dical%20-%20Dr.%20Nazim%20Subrottee%2C%20Robin%20Plaza%2C%20Royal%20road%2C%20Goodlands!3m2!1d-20.037483899999998!2d57.6496802!5e0!3m2!1sen!2smu!4v1738771791134!5m2!1sen!2smu"
                                width="100%" height="100%" style={{ border: '0', borderRadius: '25px', minWidth: '300px', minHeight: '275px' }} allowFullScreen="" loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                        <form className="col-sm-12 col-md-6 order-0 order-md-1 form pt-3">
                            <div className="row g-2">
                                <div className="col-md">
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="name" placeholder="John" />
                                        <label htmlFor="name">Name</label>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="form-floating mb-3">
                                        <input type="text" className="form-control" id="last_name" placeholder="Doe" />
                                        <label htmlFor="last_name">Last Name</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="col-md mb-3">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="phone" placeholder="54818339" />
                                        <label htmlFor="phone">Phone</label>
                                    </div>
                                </div>
                                <div className="col-md mb-3">
                                    <div className="form-floating">
                                        <input type="email" className="form-control" id="floatingInputGrid" placeholder="name@example.com" />
                                        <label htmlFor="floatingInputGrid">Email address</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="col-md mb-3">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="subject" placeholder="This is the subject" />
                                        <label htmlFor="subject">Subject</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="mb-3">
                                    <div className="form-floating">
                                        <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2"
                                            style={{ height: '100px' }}></textarea>
                                        <label htmlFor="floatingTextarea2">Comments</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2 my-3">
                                <p className="text-center text-md-start">
                                    <a href="#" className="btn btn-outline-info border-radius-35">Send Message</a>
                                </p>
                            </div>
                        </form>
                    </section>
                </section>
            </>
        </Layout>
    )
}
