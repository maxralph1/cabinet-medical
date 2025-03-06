import { useEffect } from 'react'; 
import { route } from '@/routes'; 
import { useLocation } from 'react-router-dom';


const TrackPage = () => {
    const location = useLocation(); 

    if ((location.pathname != route('sign-in'))) {
        let pageToRedirectTo = (location.pathname == route('sign-up')) 
                                    ? route('home.index')
                                : (location.pathname == route('sign-up-as-staff')) 
                                    ? route('home.index')
                                : (location.pathname == route('verify-email')) 
                                    ? route('home.index')
                                : (location.pathname.startsWith('/passwordless-signin')) 
                                    ? route('home.index')
                                : (location.pathname == route('passwordless-signin-request')) 
                                    ? route('home.index') 
                                : (location.pathname.startsWith('/password-reset')) 
                                    ? route('home.index')
                                : (location.pathname == route('password-reset-request'))  
                                    ? route('home.index') 
                                : location.pathname 

        useEffect(() => {
            // Store the current page in local storage
            localStorage.setItem('cabinet_medical_last_visited_page', pageToRedirectTo);
        }, [location.pathname]); 
    }

    return null; // This component does not render anything
};

export default TrackPage;
