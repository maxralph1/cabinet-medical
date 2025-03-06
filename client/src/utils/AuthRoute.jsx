import { useContext } from 'react'; 
import { Outlet, Navigate } from 'react-router-dom'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { route } from '@/routes'; 


const AuthRoute = () => {
    let { user } = useContext(AuthContext); 

    const lastVisitedPage = localStorage.getItem('cabinet_medical_last_visited_page') || route('home.index');

    return user ? <Navigate to={ lastVisitedPage } /> : <Outlet />; 
}; 


export default AuthRoute; 