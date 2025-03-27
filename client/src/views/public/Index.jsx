import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { route } from '@/routes';
import swal from 'sweetalert2';
import { useBlogPublications } from '@/hooks/blog/useBlogPublications.jsx';
import Layout from '@/components/public/Layout.jsx';
import NazimTransparent from '@/assets/images/nazim-transparent.png';
import NazimWide from '@/assets/images/nazim-wide-background.jpg';
import NazimNormal from '@/assets/images/nazim-normal.jpg';
import ServicesImage from '@/assets/images/medicine-services.svg';
import BackgroundImageComponent from '../../components/BgImgContainer';
import Services from './Services';

export default function Index() {
    const date = new Date();
    const hour = date.getHours();

    function submitConsultationForm(e) {
        e.preventDefault();

        swal.fire({
            text: `Request received. You would be contacted shortly via the contact detail(s) you have provided as soon as an available slot is booked. Thanks!`,
            color: '#f2f2f20',
            width: 325,
            position: 'top',
            showConfirmButton: false
        });
    };

    function submitContactForm(e) {
        e.preventDefault();

        swal.fire({
            text: `Request received. You would be contacted shortly via the contact detail(s) you have provided.`,
            color: '#f2f2f20',
            width: 325,
            position: 'top',
            showConfirmButton: false
        });
    };

    const [blogPublicationQuery, setBlogPublicationQuery] = useState({
        range: 'all',
        page: 1,
        limit: 4,
    });

    const { blogPublications, getBlogPublications, setBlogPublications, loading } = useBlogPublications(blogPublicationQuery);
    console.log(blogPublications);

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Create an Intersection Observer to watch for images entering the viewport
        const images = document.querySelectorAll(".slide-in");

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Set visible to true when the image is in view
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target); // Stop observing after it enters the viewport
                }
            });
        }, { threshold: 0.5 });

        images.forEach(image => observer.observe(image));

        // Cleanup the observer on component unmount
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <Layout>
            <>
                <BackgroundImageComponent imageUrl={NazimWide} height='650px'>
                    <section className="hero h-100 px-3 row j d-flex flex-column pt-4 pb-3">
                        {/* <div className="col-12 col-md-6"> */}
                        <div className="col-sm-12 col-md-6">
                            <h2 className="text-center pr-3 pl-3 mt-5 text-md-start fs-1">
                                {/* <span className="fw-light">Good&nbsp;
                                { hour < 12 
                                    ? 'morning' 
                                        : hour < 16 
                                        ? 'afternoon' 
                                            : hour >= 16 
                                            ? 'evening' 
                                                : '' }
                            !</span>&nbsp; */}

                                <span className='brand-text'>Cabinet Medical Clinic.</span>
                            </h2>
                            <div className='align-self-center sub-dark-bg  mt-5 white-text card transparent  p-3'>
                                <p className="text-center  ready-text text-md-start fs-3 fw-semibold d-flex flex-column gap-0">
                                    <span>Ready to enhance your health and wellness? We help.</span>
                                    {/* <span>We can be of help.</span> */}
                                </p>
                                {/* <p className="text-center text-md-start">
                                    <a href="#book-appointment" className="btn btn-outline-info border-radius-35">Book an appointment</a>
                                </p> */}

                                <p className="justify-content-center justify-content-md-start align-items-center d-flex flex-wrap gap-3">
                                    <a href="#book-appointment" className="btn btn-outline-info border-radius-35">Book an appointment</a>
                                    <a href="#contact-us" className="btn btn-outline-danger border-radius-35 ms-2">Contact Us</a>
                                </p>
                                {/* <p>Providing personalized, compassionate and professional care to meet your medical needs. We combine medical expertise with a patient-centered approach to ensure you receive the best care possible, ever step of the way.</p> */}
                            </div>
                        </div>

                        {/* <div className="d-none d-md-block col-md-6"> */}

                    </section>

                </BackgroundImageComponent>

                {/* <section className="hero-2 row align-items-center pt-5">
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
                        <p className="justify-content-center justify-content-md-start align-items-center d-flex flex-wrap gap-3">
                            <a href="#book-appointment" className="btn btn-outline-info border-radius-35">Book an appointment</a>
                            <a href="#contact-us" className="btn btn-outline-danger border-radius-35 ms-2">Contact Us</a>
                        </p>
                    </div>
                </section> */}

                <section className="services pt-4">
                <h2 className="text-uppercase text-center mt-3 pb-4 fs-4 fw-bold pt-3">Our Services</h2>
                    <div className="row  row-gap-4">
                        <div className="col-sm-12 col-md-4 px-3">
                            <img src={ServicesImage} className="w-100 slide-in" alt="" />
                        </div>
                        <div className='col-sm-12 col-md-8'>

                            <div className="bg-light py-1">
                                <Services></Services>
                            </div>
                        </div>
                       
                        {/* <ul className="list-unstyled col-sm-12 col-md-6">
                            <li className="border-bottom border-top pt-3">
                                <h3 className="fs-5">General Consultation and Follow-Up</h3>
                                <p>Get comprehensive medical care for all your health concerns. Our general consultations cover a wide range of health issues, from common illnesses to chronic conditions. We offer expert advice and thororugh follow-ups to ensure your health goals are met.</p>
                            </li>
                            <li className="border-bottom pt-3">
                                <h3 className="fs-5">Point of Care Blood Tests</h3>
                                <p>On-the-spot testing for anemia, cholesterol, gout, and diabetes.</p>
                            </li>
                            <li className="border-bottom pt-3">
                                <h3 className="fs-5">Home Visit</h3>
                                <p>Convenient care at the comfort of your home for patients unable to visit the clinic.</p>
                            </li>
                            <li className="border-bottom pt-3">
                                <h3 className="fs-5">Elderly Care</h3>
                                <p>Specialized services to support the health and wellbeing of elderly patients.</p>
                            </li>
                            <li className="border-bottom pt-3">
                                <h3 className="fs-5">Prescriptions and Administrations Tracking</h3>
                                <p>Accurate and prompt medical documentation.</p>
                            </li>
                            <li className="border-bottom pt-3">
                                <h3 className="fs-5">Medical and Fitness Certificates</h3>
                                <p>Issuance of certificates for work, travel, or fitness.</p>
                            </li>
                            <li className="border-bottom pt-3">
                                <h3 className="fs-5">Death Certificates</h3>
                                <p>Compassionate and timely assistance with medical documentation.</p>
                            </li>
                        </ul> */}
                    </div>
                </section>

                <section id="book-appointment" className="book-consultation py-4 text-center bg-body-tertiary">
                    <div className="card p-3 mx-2 mx-md-3 mx-lg-5">
                        <h2 className="text-uppercase fs-4 fw-bold pt-3">Book Consultation</h2>
                        <form onSubmit={submitConsultationForm} className="form pt-3">
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
                                    <button type="submit" className="btn btn-outline-info border-radius-35">Book an appointment</button>
                                </p>
                            </div>
                        </form>
                    </div>
                </section>

                <section id="doctors" className="doctors text-center p-5 pt-5">
                    <h2 className="fw-bold pb-2">Our Qualified Doctors</h2>
                    <div>
                        <span>The aim of medicine is to prevent disease and prolong life; the idea of medicine is to eliminate the need for a physician.</span>
                    </div>
                    <section className="nav-scroller mt-2">
                        <ul className="doctors-list nav justify-content-between gap-6 py-3" style={{ width: '100vw', overflowY: 'hidden' }}>
                            <li className="d-flex flex-column align-items-center mb-3 slide-in" style={{ maxWidth: '310px' }}>
                                <img src={NazimTransparent} alt="" className="border-radius-15"
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
                            <li className="d-flex flex-column align-items-center mb-3 slide-in" style={{ maxWidth: '310px' }}>
                                <img src={NazimTransparent} alt="" className="border-radius-15"
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
                            <li className="d-flex flex-column align-items-center mb-3 slide-in" style={{ maxWidth: '310px' }}>
                                <img src={NazimTransparent} alt="" className="border-radius-15"
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
                            <li className="d-flex flex-column align-items-center mb-3 slide-in" style={{ maxWidth: '310px' }}>
                                <img src={NazimTransparent} alt="" className="border-radius-15"
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
                            <li className="d-flex flex-column align-items-center mb-3 slide-in" style={{ maxWidth: '310px' }}>
                                <img src={NazimTransparent} alt="" className="border-radius-15"
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

                <section className="stats pt-4 p-4">
                    {/* <BackgroundImageComponent imageUrl={NazimWide} height='500px'> */}
                    <section className="row align-items-center ">
                        <div className=" col-sm-12 col-md-6 text-center text-md-start">
                            <p>Over 5,100 patients trust us.</p>
                            <p className="">
                                <a href="#book-appointment" className="btn btn-outline-info border-radius-35">Book an Appointment</a>
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
                    {/* </BackgroundImageComponent> */}
                </section>

                {(blogPublications?.data?.length > 0) &&
                    <section className="blog text-center pt-4">
                        <h2>Health Tips</h2>
                        <p>Important tips about your health and fitness</p>

                        <section className="articles">
                            <ul className="articles-list row justify-content-center align-items-center gap-5 py-3" style={{ width: '100vw', overflowY: 'hidden', paddingInlineStart: '0px' }}>
                                {(blogPublications?.data?.map((publication, index) => {
                                    return (
                                        <li key={publication?._id} className="vw-100 col-sm-12 col-lg-4 d-flex flex-column align-items-center mb-3" style={{ maxWidth: '300px' }}>
                                            <img src={publication?.image_path?.url || NazimTransparent} alt="" className="border-radius-15 object-fit-cover"
                                                style={{ width: '250px', height: '250px' }} />
                                            <div className="pt-3 d-flex flex-column align-items-center">
                                                <div className="d-flex flex-column-reverse">
                                                    <h3 className="fs-5 text-wrap">{publication?.title}</h3>
                                                    <p className="fw-bold" style={{ fontSize: 'smaller' }}>
                                                        <span className="text-secondary">Jan. 2, 2025&nbsp;
                                                            <span style={{ fontSize: 'x-small' }}>by</span>
                                                        </span>&nbsp;
                                                        <span className="text-info">
                                                            {((publication?.user?.role == 'general_practitioner')
                                                                ? ' Dr.'
                                                                : (publication?.user?.role == 'gynaecologist')
                                                                    ? ' Dr.'
                                                                    : (publication?.user?.role == 'laboratory_scientist')
                                                                        ? ' '
                                                                        : (publication?.user?.role == 'nurse')
                                                                            ? ' '
                                                                            : '')}
                                                            &nbsp;
                                                            {publication?.user?.first_name +
                                                                ' ' +
                                                                publication?.user?.last_name}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div
                                                    className="preview text-wrap"
                                                    style={{ maxWidth: '310px' }}
                                                    dangerouslySetInnerHTML={{ __html: (publication?.content?.slice(0, 100)) + (publication?.content?.length > 99 ? '...' : '') }}
                                                />
                                                <p className="">
                                                    <Link
                                                        to={route('blog.publications.show', { id: publication?._id })}
                                                        className="btn btn-outline-info border-radius-35">Read more</Link>
                                                </p>
                                            </div>
                                        </li>
                                    )
                                }))}
                            </ul>
                        </section>
                    </section>
                }

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
                        <div className="col-sm-12 col-md-6 order-1 order-md-0 border-radius-25 slide-in">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d159635.9642232964!2d57.426036514845116!3d-20.063555572287292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x217d01fe2adfbccd%3A0x215a4812b184b707!2sCabinet%20M%C3%A9dical%20-%20Dr.%20Nazim%20Subrottee%2C%20Robin%20Plaza%2C%20Royal%20road%2C%20Goodlands!3m2!1d-20.037483899999998!2d57.6496802!4m5!1s0x217d01fe2adfbccd%3A0x215a4812b184b707!2sCabinet%20M%C3%A9dical%20-%20Dr.%20Nazim%20Subrottee%2C%20Robin%20Plaza%2C%20Royal%20road%2C%20Goodlands!3m2!1d-20.037483899999998!2d57.6496802!5e0!3m2!1sen!2smu!4v1738771791134!5m2!1sen!2smu"
                                width="100%" height="100%" style={{ border: '0', borderRadius: '25px', minWidth: '300px', minHeight: '275px' }} allowFullScreen="" loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                        <form onSubmit={submitContactForm} className="col-sm-12 col-md-6 order-0 order-md-1 form pt-3">
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
                                    <button type="submit" className="btn btn-outline-info border-radius-35">Send Message</button>
                                </p>
                            </div>
                        </form>
                    </section>
                </section>
            </>
        </Layout>
    )
}
