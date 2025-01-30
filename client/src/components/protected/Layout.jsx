import { useContext, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { Link, useLocation } from 'react-router-dom'; 
import { route } from '@/routes'; 
import TopNav from '@/components/protected/TopNav.jsx'; 


export default function Layout({ children }) {
    const { user, signOut } = useContext(AuthContext); 
    // const location = useLocation(); 
    const [toggleNav, setToggleNav] = useState(false); 

    return (
        <>
            <header className="header d-flex align-items-center justify-content-between pt-3 pb-1 mb-3 border-bottom">
                <div className="brand">
                    <h1 className="fs-3">Cabinet Medical</h1>
                </div>

                <div className="user d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center justify-content-between gap-3 border border-1 border-tertiary border-radius-35 p-1">
                        <span className="d-flex justify-content-center align-items-center border-radius-50 p-2 cursor-pointer"
                            style={{ backgroundColor: '#f2f2f2' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="" className="bi bi-bell" viewBox="0 0 16 16">
                                <path
                                    d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                            </svg>
                        </span>
                        <span className="cursor-pointer" style={{ width: '35px', height: '35px' }}>
                            <img src="https://th.bing.com/th/id/OIP.TyacMdkJZmaA3p9btptQ8wHaIA?rs=1&pid=ImgDetMain"
                                className="w-100 h-100 d-flex border-radius-50 object-fit-cover" alt="" />
                        </span>
                    </div>

                    <div>
                        <span 
                            onClick={ () => setToggleNav(!toggleNav) } 
                            className="cursor-pointer">
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
                    </div>
                </div>
            </header>

            { toggleNav && 
                <nav className="main-nav">
                    <ul className="nav-list list-unstyled d-flex flex-column gap-2 align-items-end">
                        <li 
                            onClick={ () => setToggleNav(!toggleNav) } 
                            className="fw-semibold">
                                <Link to={ route('home.index') }>
                                    Home
                                </Link>
                        </li>
                        <li 
                            onClick={ () => setToggleNav(!toggleNav) } 
                            className="fw-semibold">
                                <Link to={ route('home.appointments.index') }>
                                    Appointments
                                </Link>
                        </li>
                        <li 
                            onClick={ () => setToggleNav(!toggleNav) } 
                            className="fw-semibold">
                                <Link to={ route('home.diagnosis-types.index') }>
                                    Diagnosis Types
                                </Link>
                        </li>
                        <li 
                            onClick={ () => setToggleNav(!toggleNav) } 
                            className="fw-semibold">
                                <Link to={ route('home.diagnoses.index') }>
                                    Diagnoses
                                </Link>
                        </li>
                        <li 
                            onClick={ () => setToggleNav(!toggleNav) } 
                            className="fw-semibold">
                                <Link to={ route('home.regimens.index') }>
                                    Regimens
                                </Link>
                        </li>
                        <li 
                            onClick={ () => setToggleNav(!toggleNav) } 
                            className="fw-semibold">
                                <Link to={ route('home.medical-bills.index') }>
                                    Medical Bills
                                </Link>
                        </li>
                        <li 
                            onClick={ () => setToggleNav(!toggleNav) } 
                            className="fw-semibold">
                                <Link to={ route('home.patients.index') }>
                                    Patients
                                </Link>
                        </li>
                        <li 
                            onClick={ () => setToggleNav(!toggleNav) } 
                            className="fw-semibold">
                                <Link to={ route('home.professionals.index') }>
                                    Professionals
                                </Link>
                        </li>
                        <li 
                            onClick={ () => setToggleNav(!toggleNav) } 
                            className="fw-semibold">
                                <Link to={ route('home.departments.index') }>
                                    Departments
                                </Link>
                        </li>
                        <li 
                            onClick={ () => setToggleNav(!toggleNav) } 
                            className="fw-semibold">
                                <Link to={ route('home.inventory.index') }>
                                    Inventory
                                </Link>
                        </li>
                        <li className="fw-semibold">
                            <Link to={ route('home.settings.index') }>
                                Settings
                            </Link>
                        </li>
                        <li className="fw-semibold">
                            <Link to={ route('home.blog.index') }>
                                Blog
                            </Link>
                        </li>
                        <li 
                            onClick={ signOut }
                            className="text-danger cursor-pointer">Sign Out</li>
                    </ul>
                </nav>
            }

            <main className="main dashboard pt-3">

                { children }

            </main>

            <footer className="footer pt-5 pb-3">
                &copy; { new Date().getFullYear() }. Cabinet Medical.
            </footer>
        </>
    )
}