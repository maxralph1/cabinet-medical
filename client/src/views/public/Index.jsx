import { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import swal from 'sweetalert2'; 
import { useBlogPublications } from '@/hooks/blog/useBlogPublications.jsx'; 
import { useAppointmentRequest } from '@/hooks/useAppointmentRequest.jsx'; 
import { useContactUs } from '@/hooks/useContactUs.jsx'; 
import Layout from '@/components/public/Layout.jsx'; 
import NazimTransparent from '@/assets/images/nazim-transparent.png'; 
import NazimWide from '@/assets/images/nazim-wide-background.jpg'; 
import NazimNormal from '@/assets/images/nazim-normal.jpg'; 
import ServicesImage from '@/assets/images/medicine-services.svg'; 
import ServicesImage1 from '@/assets/images/service_1.jpg'; 
import ServicesImage2 from '@/assets/images/service_2.jpg'; 


export default function Index() {
    const { appointmentRequest, createAppointmentRequest } = useAppointmentRequest(); 
    const { contactUs, createContactUs } = useContactUs(); 

    // const date = new Date();
    // const hour = date.getHours(); 

    // const [startTime, setStartTime] = useState(''); 

    const constructDate = (date, time) => {
        const [hours, minutes] = time.split(':');
        const newDate = new Date(date);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        return newDate.toISOString();
    }; 

    async function submitConsultationForm (e) {
        e.preventDefault(); 

        const proposedDateTime = constructDate(appointmentRequest?.data?.date, appointmentRequest?.data?.time);

        const formData = new FormData(); 
        appointmentRequest?.data?.first_name && formData.append('first_name', appointmentRequest?.data?.first_name); 
        appointmentRequest?.data?.last_name && formData.append('last_name', appointmentRequest?.data?.last_name); 
        appointmentRequest?.data?.email && formData.append('email', appointmentRequest?.data?.email); 
        appointmentRequest?.data?.phone && formData.append('phone', appointmentRequest?.data?.phone); 
        appointmentRequest?.data?.comments && formData.append('comments', appointmentRequest?.data?.comments); 
        ((appointmentRequest?.data?.date && appointmentRequest?.data?.time)) 
            && formData.append('proposed_schedule_date_time', new Date(proposedDateTime)); 

        await createAppointmentRequest(formData); 
        await appointmentRequest?.setData({});
    };

    async function submitContactForm(e) {
        e.preventDefault(); 

        const formData = new FormData(); 
        contactUs?.data?.first_name && formData.append('first_name', contactUs?.data?.first_name); 
        contactUs?.data?.last_name && formData.append('last_name', contactUs?.data?.last_name); 
        contactUs?.data?.email && formData.append('email', contactUs?.data?.email); 
        contactUs?.data?.phone && formData.append('phone', contactUs?.data?.phone); 
        contactUs?.data?.subject && formData.append('subject', contactUs?.data?.subject); 
        contactUs?.data?.comments && formData.append('comments', contactUs?.data?.comments); 

        await createContactUs(formData); 
        await contactUs?.setData({});
    }

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
                <section className="hero row align-items-center position-relative mt-0 pt-0 pb-3" style={{ width: '100vw' }}>
                    {/* <div className="col-12 col-md-6"> */}
                    <div className="col-sm-12 col-md-6 z-1 position-relative">
                        <div className="glass-effect mx-2">
                            <h2 className="text-center text-md-start fs-1 fw-bold">
                                {/* <span className="fw-light">Good&nbsp;
                                    { hour < 12 
                                        ? 'morning' 
                                            : hour < 16 
                                            ? 'afternoon' 
                                                : hour >= 16 
                                                ? 'evening' 
                                                    : '' }
                                !</span>&nbsp; */}
                                <span>Cabinet Medical Clinic</span>
                            </h2>
                            <p className="text-center text-md-start fs-3 fw-semibold d-flex flex-column gap-0">
                                <span className="text-dark">Ready to enhance your health and wellness?</span>
                                <span className="text-dark">We can be of help.</span>
                            </p>

                            <p className="d-flex justify-content-center justify-content-md-start align-items-center gap-3 flex-wrap mt-4">
                                <a href="#book-appointment" className="btn btn-dark border-radius-35 fs-3 fw-bold px-3 text-white">Book consultation</a>
                                <a href="#contact-us" className="btn btn-danger border-radius-35 fs-3 fw-bold px-3">Contact Us</a>
                            </p>
                        </div>
                    </div>

                    {/* <div className="d-none d-md-block col-md-6"> */}
                    <div className="position-absolute h-100 w-100" >
                        <img src={ NazimWide } alt="Dr. Nazim Subrottee" className="h-100 w-100 object-fit-cover border-radius-15 slide-in " />
                    </div>
                </section>

                <section className="services px-1 px-md-4 px-lg-5 pt-5 mt-3">
                    <h2 className="border-bottom d-inline-block pb-2 fw-bold">Our Services</h2>
                    <section className="row align-items-center row-gap-4 pt-4">
                        <div className="col-sm-12 col-md-6 px-3 order-1">
                            {/* <img src={ ServicesImage } className="w-100 slide-in" alt="" /> */}
                            <img src={ ServicesImage1 } alt="Services Image 1" className="w-100 object-fit-cover border-radius-15 slide-in" style={{ height: '540px' }} />
                        </div>
                        <div className="d-none d-md-block col-md-6 px-3 order-3">
                            {/* <img src={ ServicesImage } className="w-100 slide-in" alt="" /> */}
                            <img src={ ServicesImage2 } alt="Services Image 2" className="w-100 object-fit-cover border-radius-15 slide-in" style={{ height: '540px' }} />
                        </div>
                        <div className="col-sm-12 col-md-6 row align-items-center row-gap-4 order-2">
                            <div className="col-6 mb-4">
                                <div className="service-card p-4 shadow-sm">
                                    <div className="service-icon">🩺</div>
                                    <h3 className="service-title">Medical Consultation and Follow-Up</h3>
                                    <p className="service-description">Expert medical advice and thorough follow-ups.</p>
                                </div>
                            </div>
                            <div className="col-6 mb-4">
                                <div className="service-card p-4 shadow-sm">
                                    <div className="service-icon">🩸</div>
                                    <h3 className="service-title">Point of Care Blood Tests</h3>
                                    <p className="service-description">On-the-spot testing for anemia, cholesterol, gout, and diabetes.</p>
                                </div>
                            </div>
                            <div className="col-6 mb-4">
                                <div className="service-card p-4 shadow-sm">
                                    <div className="service-icon">🏠</div>
                                    <h3 className="service-title">Home Visit</h3>
                                    <p className="service-description">Convenient care at the comfort of your home for patients unable to visit the clinic.</p>
                                </div>
                            </div>
                            <div className="col-6 mb-4">
                                <div className="service-card p-4 shadow-sm">
                                    <div className="service-icon">👴</div>
                                    <h3 className="service-title">Elderly Care</h3>
                                    <p className="service-description">A specialized service to support the health and well-being of elderly patients.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-6 row align-items-center row-gap-4 order-4">
                            <div className="col-6 mb-4">
                                <div className="service-card p-4 shadow-sm">
                                    <div className="service-icon">📄</div>
                                    <h3 className="service-title">Prescriptions and Referral Letters</h3>
                                    <p className="service-description">Accurate and prompt medical documentation.</p>
                                </div>
                            </div>
                            <div className="col-6 mb-4">
                                <div className="service-card p-4 shadow-sm">
                                    <div className="service-icon">📜</div>
                                    <h3 className="service-title">Medical and Fitness Certificates</h3>
                                    <p className="service-description">Issuance of certificates for work, travel, or fitness.</p>
                                </div>
                            </div>
                            <div className="col-6 mb-4">
                                <div className="service-card p-4 shadow-sm">
                                    <div className="service-icon">🩹</div>
                                    <h3 className="service-title">Wound Care and Dressing</h3>
                                    <p className="service-description">Professional care for injuries to promote healing.</p>
                                </div>
                            </div>
                            <div className="col-6 mb-4">
                                <div className="service-card p-4 shadow-sm h-100 d-flex flex-column align-items-center">
                                    <div className="service-title">... and so much more.</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>

                <section id="book-appointment" className="book-consultation pt-5 mt-3 text-center bg-body-tertiary">
                    <div className="card p-3 mx-2 mx-md-3 mx-lg-5">
                        <h2 className="text-uppercase fs-4 fw-bold pt-3">Book Consultation</h2>
                        <form onSubmit={ submitConsultationForm } className="form pt-3">
                            <div className="row g-2">
                                <div className="col-md">
                                    <div className="form-floating mb-3">
                                        <input 
                                            type="text" 
                                            name="first_name" 
                                            id="first_name" 
                                            value={ appointmentRequest?.data?.first_name ?? '' }
                                            onChange={ e => appointmentRequest.setData({
                                                ...appointmentRequest?.data,
                                                first_name: e.target.value,
                                            }) }
                                            className="form-control ps-4" 
                                            placeholder="John" 
                                            required />
                                        <label htmlFor="first_name">First Name</label>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="form-floating mb-3">
                                        <input 
                                            type="text" 
                                            name="last_name" 
                                            id="last_name" 
                                            value={ appointmentRequest?.data?.last_name ?? '' }
                                            onChange={ e => appointmentRequest.setData({
                                                ...appointmentRequest?.data,
                                                last_name: e.target.value,
                                            }) }
                                            className="form-control ps-4" 
                                            placeholder="Doe"
                                            required />
                                        <label htmlFor="last_name">Last Name</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="col-md mb-3">
                                    <div className="form-floating">
                                        <input 
                                            type="text" 
                                            name="phone" 
                                            id="phone" 
                                            value={ appointmentRequest?.data?.phone ?? '' }
                                            onChange={ e => appointmentRequest.setData({
                                                ...appointmentRequest?.data,
                                                phone: e.target.value,
                                            }) }
                                            className="form-control ps-4" 
                                            placeholder="54818339"
                                            required />
                                        <label htmlFor="phone">Phone</label>
                                    </div>
                                </div>
                                <div className="col-md mb-3">
                                    <div className="form-floating">
                                        <input 
                                            type="email" 
                                            name="email" 
                                            id="email" 
                                            value={ appointmentRequest?.data?.email ?? '' }
                                            onChange={ e => appointmentRequest.setData({
                                                ...appointmentRequest?.data,
                                                email: e.target.value,
                                            }) }
                                            className="form-control ps-4" 
                                            placeholder="name@example.com"
                                            required />
                                        <label htmlFor="floatingInputGrid">Email address</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="col-md mb-3">
                                    <div className="form-floating">
                                        <input 
                                            type="date" 
                                            name="date" 
                                            id="date" 
                                            value={ appointmentRequest?.data?.date ?? '' }
                                            onChange={ e => appointmentRequest.setData({
                                                ...appointmentRequest?.data,
                                                date: e.target.value,
                                            }) }
                                            className="form-control ps-4" 
                                            style={{  }}
                                            placeholder="2025-03-15"
                                            required />
                                        <label htmlFor="date">Date</label>
                                    </div>
                                </div>
                                <div className="col-md mb-3">
                                    <div className="form-floating">
                                        <input 
                                            type="time" 
                                            name="time" 
                                            id="time" 
                                            value={ appointmentRequest?.data?.time ?? '' }
                                            onChange={ e => appointmentRequest.setData({
                                                ...appointmentRequest?.data,
                                                time: e.target.value,
                                            }) }
                                            className="form-control ps-4" 
                                            placeholder="11:15"
                                            required />
                                        <label htmlFor="time">Time</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="mb-3">
                                    <div className="form-floating">
                                        <textarea 
                                            name="comments" 
                                            id="comments" 
                                            value={ appointmentRequest?.data?.comments ?? '' }
                                            onChange={ e => appointmentRequest.setData({
                                                ...appointmentRequest?.data,
                                                comments: e.target.value,
                                            }) }
                                            className="form-control ps-4" 
                                            placeholder="Leave a comment here" 
                                            style={{ height: '100px' }}></textarea>
                                        <label htmlFor="floatingTextarea2">Comments</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2 my-3">
                                <p className="text-center text-md-start">
                                    <button type="submit" className="btn btn-outline-info border-radius-35">Submit</button>
                                </p>
                            </div>
                        </form>
                    </div>
                </section>

                <section id="doctors" className="doctors px-1 px-md-4 px-lg-5 pt-5 mt-3">
                    <h2 className="border-bottom d-inline-block pb-2 fw-bold">Our Qualified Doctors</h2>
                    <div>
                        <span>The aim of medicine is to prevent disease and prolong life; the idea of having a physician is to administer the medicine.</span>
                    </div>
                    <section className="nav-scroller">
                        <ul className="doctors-list nav justify-content-between gap-5 py-3" style={{ width: '100vw', overflowY: 'hidden' }}>
                            <li className="d-flex flex-column align-items-center mb-3" style={{ maxWidth: '310px' }}>
                                <img src={ NazimTransparent } alt="" className="border-radius-15"
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
                                <img src={ NazimTransparent } alt="" className="border-radius-15"
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
                                <img src={ NazimTransparent } alt="" className="border-radius-15"
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

                <section className="stats px-1 px-md-4 px-lg-5 pt-5 mt-5 fw-bold glass-effect" style={{ backgroundImage: `url(${NazimWide})` }}>
                    <h2 className="border-bottom pb-2 d-inline-block text-uppercase fs-4 fw-bold pt-3">Fun Facts</h2>
                    <section className="row align-items-center px-3 pb-5 pt-3">
                        <div className="col-sm-12 col-md-6 text-center text-md-start">
                            <p>Over 5,100 patients trust us.</p>
                            <p className="">
                                <a href="#book-appointment" className="btn btn-info border-radius-35 text-white">Book consultation</a>
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

                { (blogPublications?.data?.length > 0) && 
                    <section className="blog px-1 px-md-4 px-lg-5 pt-5 mt-3 w-100">
                        <h2 className="border-bottom d-inline-block pb-2 pt-3 mb-3 fw-bold">Health Tips</h2>
                        <p>Important tips about your health and fitness</p>

                        <section className="articles w-100 pt-3">
                            <div className="articles-list w-100" style={{ overflowY: 'hidden' }}>
                                { (blogPublications?.data?.map((publication, index) => {
                                    return (
                                        <article key={ publication?._id } className="mb-3 text-center" style={{ height: '500px', minWidth: '300px', minHeight: '400px' }}>
                                            <img src={ publication?.image_path?.url || NazimTransparent } alt="" className="border-radius-15 object-fit-cover" style={{ width: '100%', height: '70%' }} />
                                                {/* style={{ width: '250px', height: '250px' }} /> */}
                                                {/* style={{ minWidth: '250px', minHeight: '250px', maxWidth: '600px', maxHeight: '600px' }} /> */}
                                            <div className="pt-3">
                                                <div className="d-flex flex-column-reverse">
                                                    <h3 className="fs-5 text-wrap">{ publication?.title }</h3>
                                                    <p className="fw-bold" style={{ fontSize: 'smaller' }}>
                                                        <span className="text-secondary">Jan. 2, 2025&nbsp;
                                                            <span style={{ fontSize: 'x-small' }}>by</span>
                                                        </span>&nbsp;
                                                        <span className="text-info">
                                                            { ((publication?.user?.role == 'general_practitioner')
                                                                ? ' Dr.' 
                                                                    : (publication?.user?.role == 'gynaecologist') 
                                                                    ? ' Dr.' 
                                                                        : (publication?.user?.role == 'laboratory_scientist') 
                                                                        ? ' ' 
                                                                            : (publication?.user?.role == 'nurse')
                                                                            ? ' ' 
                                                                                : '' ) }
                                                            &nbsp;
                                                            { publication?.user?.first_name + 
                                                                ' ' + 
                                                                publication?.user?.last_name }
                                                        </span>
                                                    </p>
                                                </div>
                                                {/* <div 
                                                    className="preview text-wrap" 
                                                    style={{ maxWidth: '310px' }}
                                                    dangerouslySetInnerHTML={{ __html: (publication?.content?.slice(0, 100)) + (publication?.content?.length > 99 ? '...' : '') }} 
                                                /> */}
                                                <p className="mt-3">
                                                    <Link 
                                                        to={ route('blog.publications.show', { id: publication?._id }) } 
                                                        className="btn btn-outline-info border-radius-35">Read more</Link>
                                                </p>
                                            </div>
                                        </article>
                                    )
                                }) )}
                            </div>
                        </section>
                    </section> 
                }

                <section className="testimonials text-center px-1 px-md-4 px-lg-5 pt-5 mt-3">
                    <h2 className="text-uppercase border-bottom pb-2 fs-6 d-inline-block">Testimonials</h2>

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

                <section id="contact-us" className="contact px-1 px-md-4 px-lg-5 pt-5 mt-3">
                    <h2 className="border-bottom d-inline-block pb-2 fw-bold">Contact Us</h2>

                    <section className="row justify-content-center justify-content-md-between align-items-center gap-3 pt-4">
                        <article className="bg-body-tertiary border-radius-25 col-sm-12 col-md-12 col-lg-4 d-flex flex-column align-items-center justify-content-center gap-3 p-3" style={{ width: '250px', height: '225px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill"
                                viewBox="0 0 16 16">
                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                            </svg>
                            <span className="text-center">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa quibusdam adipisci voluptas. Et, quae vero.</span>
                        </article>
                        <article className="bg-body-tertiary border-radius-25 col-sm-12 col-md-12 col-lg-4 d-flex flex-column align-items-center justify-content-center gap-3 p-3" style={{ width: '250px', height: '225px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-phone-fill"
                                viewBox="0 0 16 16">
                                <path d="M3 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm6 11a1 1 0 1 0-2 0 1 1 0 0 0 2 0" />
                            </svg>
                            <a href="tel:+23054818339">+230 5481 8339</a>
                        </article>
                        <article className="bg-body-tertiary border-radius-25 col-sm-12 col-md-12 col-lg-4 d-flex flex-column align-items-center justify-content-center gap-3 p-3" style={{ width: '250px', height: '225px' }}>
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
                        <form onSubmit={ submitContactForm } className="col-sm-12 col-md-6 order-0 order-md-1 form pt-3">
                            <div className="row g-2">
                                <div className="col-md">
                                    <div className="form-floating mb-3">
                                        <input 
                                            type="text" 
                                            name="first_name" 
                                            id="first_name" 
                                            value={ contactUs?.data?.first_name ?? '' }
                                            onChange={ e => contactUs.setData({
                                                ...contactUs?.data,
                                                first_name: e.target.value,
                                            }) }
                                            className="form-control ps-4" 
                                            placeholder="John" 
                                            required />
                                        <label htmlFor="first_name">First Name</label>
                                    </div>
                                </div>
                                <div className="col-md">
                                    <div className="form-floating mb-3">
                                        <input 
                                            type="text" 
                                            name="last_name" 
                                            id="last_name" 
                                            value={ contactUs?.data?.last_name ?? '' }
                                            onChange={ e => contactUs.setData({
                                                ...contactUs?.data,
                                                last_name: e.target.value,
                                            }) }
                                            className="form-control ps-4" 
                                            placeholder="Doe"
                                            required />
                                        <label htmlFor="last_name">Last Name</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="col-md mb-3">
                                    <div className="form-floating">
                                        <input 
                                            type="text" 
                                            name="phone" 
                                            id="phone" 
                                            value={ contactUs?.data?.phone ?? '' }
                                            onChange={ e => contactUs.setData({
                                                ...contactUs?.data,
                                                phone: e.target.value,
                                            }) }
                                            className="form-control ps-4" 
                                            placeholder="54818339"
                                            required />
                                        <label htmlFor="phone">Phone</label>
                                    </div>
                                </div>
                                <div className="col-md mb-3">
                                    <div className="form-floating">
                                        <input 
                                            type="email" 
                                            name="email" 
                                            id="email" 
                                            value={ contactUs?.data?.email ?? '' }
                                            onChange={ e => contactUs.setData({
                                                ...contactUs?.data,
                                                email: e.target.value,
                                            }) }
                                            className="form-control ps-4" 
                                            placeholder="name@example.com"
                                            required />
                                        <label htmlFor="floatingInputGrid">Email address</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="col-12 mb-3">
                                    <div className="form-floating">
                                        <input 
                                            type="text" 
                                            name="subject" 
                                            id="subject" 
                                            value={ contactUs?.data?.subject ?? '' }
                                            onChange={ e => contactUs.setData({
                                                ...contactUs?.data,
                                                subject: e.target.value,
                                            }) }
                                            className="form-control ps-4" 
                                            placeholder="This is a subject"
                                            required />
                                        <label htmlFor="subject">Subject</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="mb-3">
                                    <div className="form-floating">
                                        <textarea 
                                            name="comments" 
                                            id="comments" 
                                            value={ contactUs?.data?.comments ?? '' }
                                            onChange={ e => contactUs.setData({
                                                ...contactUs?.data,
                                                comments: e.target.value,
                                            }) }
                                            className="form-control ps-4" 
                                            placeholder="Leave a comment here" 
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
