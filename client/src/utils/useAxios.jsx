import { useContext } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { jwtDecode } from 'jwt-decode'; 
import dayjs from 'dayjs'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 

const baseURL = `${ Constants?.serverURL }/api/v1`; 


const useAxios = () => {
    const navigate = useNavigate(); 
    const { authTokens, setUser, setAuthTokens, signOut } = useContext(AuthContext); 

    const axiosInstance = axios.create({
        baseURL, 
        headers: {
            'Authorization': `Bearer ${ authTokens?.access }`, 
            'Content-Type': 'multipart/form-data', 
        }
    }, { withCredentials: true }); 

    axiosInstance.interceptors.request.use(async req => {
        const user = jwtDecode(authTokens?.access); 
        const isExpired = dayjs.unix(user?.exp).diff(dayjs()) < 1; 

        if (!isExpired) return req;

        // const response = await axios.post(`${ baseURL }/auth/refresh-token`, {
        //     // refresh: authTokens?.refresh
        // }, {
        //     headers: {
        //         'Authorization': `Bearer ${ authTokens?.access }`, 
        //         'Content-Type': 'application/json', 
        //     }
        // }, { 
        //     withCredentials: true 
        // }); 

        const response = await axios.post(`${ baseURL }/auth/refresh-token`, {
            headers: {
                'Authorization': `Bearer ${ authTokens?.access }`, 
                'Content-Type': 'application/json', 
            }
        }, { 
            withCredentials: true 
        }); 

        localStorage?.setItem('cabinet_medical_auth_tokens', JSON?.stringify(response?.data)); 

        setAuthTokens(response?.data); 
        setUser(jwtDecode(response?.data?.access)); 

        req.headers.Authorization = `Bearer ${response?.data?.access}`; 
        return req;
    }); 

    axiosInstance.interceptors.response.use(
        response => response, 
        error => {
            if (error?.response?.status === 401) { 
                signOut();
                navigate(route('sign-in'));
            }; 
            return Promise.reject(error);
        }
    ) 
    
    return axiosInstance;
} 


export default useAxios; 