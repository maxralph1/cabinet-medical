import { createContext, useState, useEffect } from 'react'; 
import axios from 'axios'; 
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Constants from '@/utils/Constants.jsx'; 
import swal from 'sweetalert2'; 
import SwalAlert from '@/utils/SwalAlert.jsx';

const AuthContext = createContext(); 

export default AuthContext; 


export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage?.getItem('cabinet_medical_auth_tokens') 
            ? JSON.parse(localStorage?.getItem('cabinet_medical_auth_tokens')) 
            : null); 
    
    const [user, setUser] = useState(() => 
        localStorage?.getItem('cabinet_medical_auth_tokens') 
            ? jwtDecode(localStorage?.getItem('cabinet_medical_auth_tokens')) 
            : null); 

    const [loading, setLoading] = useState(false); 
    const [authLoading, setAuthLoading] = useState(false); 
    const [authError, setAuthError] = useState(''); 
    const [authSuccess, setAuthSuccess] = useState(''); 

    const navigate = useNavigate(); 


    /** Routes */ 

    const signUp = async (username, email, firstname, lastname, password, account_type) => {
        await axios.post(`${ Constants?.serverURL }/api/v1/auth/sign-up`, { username, email, first_name: firstname, last_name: lastname, password, account_type }, { withCredentials: true })
            .then((response) => { 
                // console.log(response); 
                navigate(route('sign-in')); 
                setAuthSuccess('Registration successful. An email with a verification link has been sent to you.');
                SwalAlert('success', '', 'Registration successful. An email with a verification link has been sent to you.');
            })
            .catch(error => { 
                console.log(error); 
                if (error?.response?.status == '400') {
                    setAuthError(`${error?.response?.status}: Something went wrong!`); 
                    SwalAlert('error', error?.response?.status, 'Something went wrong!'); 
                } else if (error?.response?.status == '409') {
                    setAuthError(`${error?.response?.status}: Username / Email already taken`); 
                    SwalAlert('error', error?.response?.status, 'Username / Email already taken'); 
                } else {
                    setAuthError(`${error?.response?.status}: ${error?.response?.data?.message}`); 
                    SwalAlert('error', error?.response?.status, error?.response?.data?.message); 
                }
            });
    } 

    const verifyEmail = async (username, token) => {
        await axios.post(`${ Constants.serverURL }/api/v1/auth/verify-email/${ username }/${ token }`, { withCredentials: true })
            .then(response => {
                // console.log(response); 
                setAuthTokens(response?.data); 
                setUser(jwtDecode(response?.data?.access)); 
                localStorage?.setItem('cabinet_medical_auth_tokens', JSON?.stringify(response?.data)); 
                navigate(route('home.index')); 
            })
            .catch(error => { 
                // console.log(error); 
                navigate(route('sign-in')); 
                if (error?.response?.status == '400') {
                    setAuthError(`${error?.response?.data}`); 
                    SwalAlert('error', error?.response?.status, error?.response?.data); 
                } else {
                    setAuthError(`${error?.response?.status}: Something went wrong!`); 
                    SwalAlert('error', error?.response?.status, 'Something went wrong!'); 
                }
            });
    }

    const signIn = async (email_username, password) => { 
        await axios.post(`${ Constants?.serverURL }/api/v1/auth/sign-in`, { email_username, password }, { withCredentials: true })
            .then((response) => { 
                    // console.log(response?.data);
                    // console.log(response);
                    setAuthTokens(response?.data); 
                    setUser(jwtDecode(response?.data?.access)); 
                    // console.log(user);
                    // console.log(authTokens);
                    localStorage.setItem('cabinet_medical_auth_tokens', JSON.stringify(response?.data)); 
                    // If Sign-in is successful
                    // navigate(route('home.index')); 
                    const lastVisitedPage = localStorage.getItem('cabinet_medical_last_visited_page') || route('home.index');
                    // localStorage.removeItem('cabinet_medical_last_visited_page'); 
                    navigate(lastVisitedPage); 

                })
            .catch(error => { 
                console.log(error);
                if ((error?.response?.status == '401') || (error?.response?.status == '429')) {
                    setAuthError(`${error?.response?.data?.message}`); 
                    SwalAlert('error', error?.response?.status, error?.response?.data?.message); 
                } else {
                    setAuthError(`Something went wrong!`);
                }
            });
    } 

    const passwordlessSignInRequest = async (username) => {
        await axios.post(`${ Constants.serverURL }/api/v1/auth/passwordless-signin-request`, { username }, { withCredentials: true })
            .then((response) => { 
                setAuthError(`${response?.data?.success}`);
                SwalAlert('success', '', 'Email notification with login link was sent to your email.'); 
            })
            .catch(error => {
                // console.log(error);
                if (error?.response?.status == '401') {
                    setAuthError(`${error?.response?.data?.message}`); 
                    SwalAlert('error', error?.response?.status, error?.response?.data?.message); 
                } else {
                    setAuthError(`${error?.response?.status}: Something went wrong!`); 
                    SwalAlert('error', error?.response?.status, 'Something went wrong!'); 
                }
            })
    } 

    const passwordlessSignIn = async (username, token) => {
        await axios.post(`${ Constants.serverURL }/api/v1/auth/passwordless-signin/${ username }/${ token }`, { withCredentials: true })
            .then(response => {
                // console.log(response); 
                setAuthTokens(response?.data); 
                setUser(jwtDecode(response?.data?.access)); 
                localStorage?.setItem('cabinet_medical_auth_tokens', JSON?.stringify(response?.data)); 
                navigate(route('home.index')); 
            })
            .catch(error => { 
                // console.log(error); 
                navigate(route('sign-in')); 
                if (error?.response?.status == '400') {
                    setAuthError(`${error?.response?.data}`); 
                    SwalAlert('error', error?.response?.status, error?.response?.data); 
                } else {
                    setAuthError(`${error?.response?.status}: Something went wrong!`); 
                    SwalAlert('error', error?.response?.status, 'Something went wrong!'); 
                }
            });
    }

    const signOut = async () => { 
        // localStorage.removeItem('cabinet_medical_last_visited_page');
        await axios.post(`${ Constants?.serverURL }/api/v1/auth/sign-out`, {
            headers: {
                'Authorization': `Bearer ${ authTokens?.access }`, 
                'Content-Type': 'multipart/form-data', 
            }, withCredentials: true })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setAuthTokens(null); 
                setUser(null); 
                localStorage?.removeItem('cabinet_medical_auth_tokens'); 
                // navigate(route('sign-in')); 
            });
    } 
    // const signOut = async () => {
    //     try {
    //         // Make the API call to sign out
    //         const response = await axios.post(
    //             `${Constants?.serverURL}/api/v1/auth/sign-out`,
    //             {}, // Empty body for sign-out
    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${authTokens?.access}`, // Pass the token in the Authorization header
    //                     'Content-Type': 'application/json', // Change this to 'application/json' since you're sending a POST request (unless you're uploading a file)
    //                 },
    //                 withCredentials: true // Include credentials if required (e.g., cookies)
    //             }
    //         );

    //         // Handle the response here
    //         console.log(response);

    //         // Optionally, handle any state updates
    //         setAuthTokens(null);
    //         setUser(null);
    //         localStorage?.removeItem('cabinet_medical_auth_tokens');
    //         // navigate(route('sign-in')); // Uncomment if you want to navigate after sign out

    //     } catch (error) {
    //         // Handle errors
    //         console.error('Sign out failed:', error);
    //         // Optionally show a user-friendly message or notify the user
    //     } finally {
    //         // Any cleanup or post-sign-out logic
    //     }
    // };


    const resetPasswordRequest = async (email) => {
        await axios.post(`${ Constants?.serverURL }/api/v1/auth/password-reset`, { email }, { withCredentials: true })
            .then(response => {
                setAuthSuccess('Email notification with reset link was sent to your email.'); 
                SwalAlert('success', '', 'Email notification with reset link was sent to your email.'); 
                // console.log(response); 
            })
            .catch(error => {
                setAuthError(`${ error?.response?.data?.message }`); 
                SwalAlert('error', error?.response?.status, error?.response?.data?.message); 
                // console.log(error); 
                // console.log(error?.response?.data?.message); 
            })
    } 

    const resetPassword = async (username, token, password) => {
        await axios.post(`${ Constants?.serverURL }/api/v1/auth/password-reset/${ username }/${ token }`, { password }, { withCredentials: true })
            .then(response => {
                // console.log(response); 
                navigate(route('sign-in')); 
                setAuthSuccess('Password reset successful.'); 
                SwalAlert('success', '', 'Password reset successful.'); 
            })
            .catch(error => {
                // console.log(error); 
                setAuthError(`${error?.response?.status}: ${error?.response?.data?.message}`); 
                SwalAlert('error', error?.response?.status, error?.response?.data?.message); 
            }); 
    }; 


    let contextData = {
        authLoading, 
        setAuthLoading, 
        authError, 
        setAuthError, 
        authSuccess, 
        setAuthSuccess, 
        user, 
        setUser, 
        authTokens, 
        setAuthTokens, 
        signUp, 
        verifyEmail, 
        signIn, 
        passwordlessSignInRequest, 
        passwordlessSignIn, 
        signOut, 
        resetPasswordRequest, 
        resetPassword
    } 

    useEffect(() => {
        if (authTokens?.authorization) setUser(jwtDecode(authTokens?.authorization?.token)); 
        setLoading(false); 
    }, [authTokens, loading]); 


    return (
        <AuthContext.Provider value={ contextData }>
            { loading ? null : children }
        </AuthContext.Provider>
    )
}