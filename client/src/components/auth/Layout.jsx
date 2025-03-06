import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 


export default function Layout({ children }) {
    return (
        <>
            <header className="header container-fluid d-flex align-items-center justify-content-between pt-1 pb-2 sticky-top py-2 shadow-sm border-bottom">
                <div className="brand">
                    <h1 className="fs-4 mt-1 text-nowrap">Cabinet Medical</h1>
                </div>
                <ul className="nav public-top-nav d-flex flex-column align-items-end flex-md-row align-items-md-center justify-content-md-end flex-nowrap">
                    <li className="nav-item pe-sm-3 text-end text-md-start ps-md-0">
                        <Link 
                            to={ route('index') }
                            className="nav-link text-dark fw-bold active">
                                Home
                        </Link>
                    </li>
                    {/* <li className="nav-item text-end text-md-start btn btn-outline-info border-radius-35 p-0">
                        <Link to={`${route('index')}#book-appointment`} className="nav-link text-dark fw-bold">Book Appointment</Link>
                    </li> */}
                </ul>
            </header> 

            <main className="main auth">
                <div className="row">
                    <section className="auth-side-quotes d-none d-md-block col-md-6 bg-transparent border-radius-25">
                        <div className="slide-section">
                            <h2 className="heading text-uppercase text-secondary">Our Mission</h2>
                            
                            <div id="carouselAuth" className="carousel slide carousel-fade" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <span>To make healthcare more accessible to people with the help of our robust AI health assistant and tools.</span>
                                    </div>
                                    <div className="carousel-item">
                                        <span>To make healthcare more mobile-friendly and instantly accessible to people regardless of location.</span>
                                    </div>
                                    <div className="carousel-item">
                                        <span>To deliver emergency top-notch healthcare services to our clients from the comfort of their homes.</span>
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselAuth" data-bs-slide="prev">
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselAuth" data-bs-slide="next">
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </section>
                    
                    { children }
                </div>
            </main>

            <footer className="footer container-fluid pt-5">
                <span className="text-secondary">&copy; 2025. Cabinet Medical.</span>
            </footer>
        </>
    )
}