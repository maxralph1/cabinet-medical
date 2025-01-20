import { useContext, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx';
// import { Link, useLocation } from 'react-router-dom'; 
// import { route } from '@/routes'; 
import TopNav from '@/components/protected/TopNav.jsx'; 


export default function Layout({ children }) {
    const { user } = useContext(AuthContext); 
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor"
                                className="bi bi-menu-button-wide" viewBox="0 0 16 16">
                                <path
                                    d="M0 1.5A1.5 1.5 0 0 1 1.5 0h13A1.5 1.5 0 0 1 16 1.5v2A1.5 1.5 0 0 1 14.5 5h-13A1.5 1.5 0 0 1 0 3.5zM1.5 1a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5z" />
                                <path
                                    d="M2 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m10.823.323-.396-.396A.25.25 0 0 1 12.604 2h.792a.25.25 0 0 1 .177.427l-.396.396a.25.25 0 0 1-.354 0M0 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm1 3v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2zm14-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2zM2 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5" />
                            </svg>
                        </span>
                    </div>
                </div>
            </header>

            { toggleNav && 
                <TopNav /> 
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