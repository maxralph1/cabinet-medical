import { useContext, useEffect, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { Link, useLocation } from 'react-router-dom'; 
import { route } from '@/routes'; 


export default function Layout({ children }) {
    const location = useLocation(); 

    const tabletBreakpoint = 768; 
    const [toggleNav, setToggleNav] = useState((window.innerWidth >= tabletBreakpoint) ? true : false); 

    return (
        <>
            <section className="d-none d-md-flex justify-content-between pt-1 pb-2">
                <span className="d-flex align-items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-phone-fill"
                        viewBox="0 0 16 16">
                        <path d="M3 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm6 11a1 1 0 1 0-2 0 1 1 0 0 0 2 0" />
                    </svg>
                    <a href="tel:+23054818339">+230 5481 8339</a>
                </span>
                <span className="d-flex align-items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-at-fill"
                        viewBox="0 0 16 16">
                        <path
                            d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2zm-2 9.8V4.698l5.803 3.546zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586zM16 9.671V4.697l-5.803 3.546.338.208A4.5 4.5 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671" />
                        <path
                            d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791" />
                    </svg>
                    <a href="mailto:drnazim.subrottee@gmail.com?subject=Hello%20there&body=I%20would%20like%20to%20&nbsp;...">drnazim.subrottee@gmail.com</a>
                </span>
                <div className="d-flex gap-3">
                    <Link to={ route('sign-in') } className="text-uppercase">
                        Sign In
                    </Link>
                    <span>|</span>
                    <Link to={ route('sign-up') } className="text-uppercase">
                        Sign Up
                    </Link>
                </div>
            </section>
            <header className="d-flex justify-content-between align-items-center bg-white sticky-top py-2">
                <h1 className="fs-4">Cabinet Medical</h1>

                <nav>
                    <span 
                        onClick={ () => setToggleNav(!toggleNav) } 
                        className="cursor-pointer d-flex justify-content-end d-md-none py-3">
                            { (toggleNav == false) 
                                ?   <svg xmlns="http://www.w3.org/2000/svg" 
                                        width="28" height="28" 
                                        fill="currentColor" 
                                        className="bi bi-text-right" 
                                        viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
                                    </svg>
                                :   <svg xmlns="http://www.w3.org/2000/svg" 
                                        width="23" height="23" 
                                        fill="currentColor" 
                                        className="bi bi-x-lg" 
                                        viewBox="0 0 16 16">
                                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                                    </svg> }
                            
                    </span>

                    { toggleNav && (
                        <ul className="nav public-top-nav d-flex flex-column flex-md-row">
                            <li className="nav-item pe-sm-3 text-end text-md-start ps-md-0">
                                <Link 
                                    to={ route('index') }
                                    className="nav-link active">
                                        Home
                                </Link>
                            </li>
                            <li className="nav-item pe-sm-3 text-end text-md-start ps-md-0">
                                <Link 
                                    to={ route('home.index') }
                                    className="nav-link">
                                        Dashboard
                                </Link>
                            </li>

                            { !(location?.pathname)?.startsWith('/blog') && (
                                <>
                                    <li className="nav-item pe-sm-3 text-end text-md-start ps-md-0">
                                        <a href="#doctors" className="nav-link">Doctors</a>
                                    </li>
                                    <li className="nav-item pe-sm-3 text-end text-md-start ps-md-0">
                                        <Link 
                                            to={ route('blog.index') }
                                            className="nav-link">
                                                Blog
                                        </Link>
                                    </li>
                                    <li className="nav-item pe-sm-3 text-end text-md-start ps-md-0">
                                        <a href="#contact-us" className="nav-link">Contact</a>
                                    </li>
                                    <li className="nav-item text-end text-md-start btn btn-outline-info border-radius-35 p-0">
                                        <a href="#book-appointment" className="nav-link">Book Appointment</a>
                                    </li>
                                </>
                            ) }
                            
                            <li className="nav-item pe-sm-3 text-end text-md-start ps-md-0 d-block d-md-none">
                                <Link 
                                    to={ route('sign-in') }
                                    className="nav-link">
                                        Sign In
                                </Link>
                            </li>
                        </ul>
                    )}
                </nav>
            </header>

            <main>
                { children }
            </main>

            <footer className="pt-5 pb-4">
                &copy;2025. Cabinet Medical.
            </footer>
        </>
    )
}
