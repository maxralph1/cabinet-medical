import { useContext, useEffect, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { Link, useLocation } from 'react-router-dom'; 
import { route } from '@/routes'; 


export default function Layout({ children }) {
    const { user, signOut } = useContext(AuthContext); 

    const location = useLocation(); 

    const tabletBreakpoint = 768; 
    const [toggleNav, setToggleNav] = useState((window.innerWidth >= tabletBreakpoint) ? true : false); 

    return (
        <>
            <section className="container-fluid nav-bg white-text d-none d-md-flex justify-content-between pt-1 pb-2">
                <span className="d-flex align-items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-phone-fill"
                        viewBox="0 0 16 16">
                        <path d="M3 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm6 11a1 1 0 1 0-2 0 1 1 0 0 0 2 0" />
                    </svg>
                    <a href="tel:+23054818339">+230 5481 8339</a>
                </span>
                <span className="d-flex align-items-center gap-1">
                    <a href="mailto:drnazim.subrottee@gmail.com?subject=Hello%20there&body=I%20would%20like%20to%20&nbsp;...">Dr. Nazim Subrottee</a>
                </span>
                { !user 
                    ? (
                        <div className="d-flex gap-3">
                            <Link to={ route('sign-in') } className="text-uppercase">
                                Sign In
                            </Link>
                            <span>|</span>
                            <Link to={ route('sign-up') } className="text-uppercase">
                                Sign Up
                            </Link>
                        </div>
                    ) 
                    :  (
                        <span onClick={ signOut } className="text-uppercase text-danger cursor-pointer text-decoration-underline">
                            Sign Out
                        </span>
                    ) }
            </section>
            <header className="container-fluid w-100 d-flex justify-content-between align-items-center bg-white sticky-top py-2 shadow-sm border-bottom">
                {/* { ((window.innerWidth <= tabletBreakpoint) && (toggleNav == false)) && */}
                    <h1 className="fs-4 mt-1 text-nowrap">Cabinet Medical</h1>
                {/* } */}

                <nav className="w-100 justify-self-end">
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
                        <ul className="nav public-top-nav d-flex flex-column align-items-end flex-md-row align-items-md-center justify-content-md-end flex-nowrap">
                            <li className="nav-item pe-sm-3 text-end text-md-start ps-md-0">
                                <Link 
                                    to={ route('index') }
                                    className="nav-link text-dark fw-bold active">
                                        Home
                                </Link>
                            </li>

                            { user && (
                                <li className="nav-item pe-sm-3 text-end text-md-start ps-md-0">
                                    <Link 
                                        to={ route('home.index') }
                                        className="nav-link text-dark fw-bold">
                                            Dashboard
                                    </Link>
                                </li>
                            ) }

                            { !(location?.pathname)?.startsWith('/blog') && (
                                <>
                                    <li className="nav-item pe-sm-3 text-end text-md-start ps-md-0">
                                        <a href="#doctors" className="nav-link text-dark fw-bold">Doctors</a>
                                    </li>
                                    <li className="nav-item pe-sm-3 text-end text-md-start ps-md-0">
                                        <Link 
                                            to={ route('blog.index') }
                                            className="nav-link text-dark fw-bold">
                                                Blog
                                        </Link>
                                    </li>
                                    <li className="nav-item pe-sm-3 text-end text-md-start ps-md-0">
                                        <a href="#contact-us" className="nav-link text-dark fw-bold">Contact</a>
                                    </li>
                                    <li className="nav-item text-end text-md-start btn btn-outline-info border-radius-35 p-0">
                                        <a href="#book-appointment" className="nav-link text-dark fw-bold">Book Appointment</a>
                                    </li>
                                </>
                            ) }
                            
                            <li className="nav-item pe-sm-3 text-end text-md-start ps-md-0 d-block d-md-none">
                                { (!user) 
                                    ? (
                                        <Link 
                                            to={ route('sign-in') }
                                            className="nav-link text-dark fw-bold">
                                                Sign In
                                        </Link>
                                    ) 
                                    : (
                                        <span 
                                            // to={ route('sign-out') } 
                                            onClick={ signOut }
                                            className="nav-link text-danger fw-bold">
                                                Sign Out
                                        </span>
                                    ) }
                            </li>
                        </ul>
                    )}
                </nav>
            </header>

            <main className="container-fluid pt-4">
                { children }
            </main>

            <footer className="container-fluid pt-5 pb-4">
                &copy;2025. Cabinet Medical.
            </footer>
        </>
    )
}
