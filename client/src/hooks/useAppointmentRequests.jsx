import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useAppointmentRequests(appointmentRequestQuery) {
    const axiosInstance = useAxios(); 
    const [appointmentRequests, setAppointmentRequests] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (appointmentRequestQuery !== null) {
            const controller = new AbortController(); 
            getAppointmentRequests(appointmentRequestQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [appointmentRequestQuery]); 

    async function getAppointmentRequests(appointmentRequestQuery, { signal } = {}) { 
        console.log(appointmentRequestQuery);

        setAppointmentRequests([]); 
        setLoading(true); 
        // return axiosInstance.get(`appointmentRequests?page=${appointmentRequestQuery?.page}&limit=${appointmentRequestQuery?.limit}`, { signal })
        return axiosInstance.get(`appointment-requests?page=${appointmentRequestQuery?.page}&limit=${appointmentRequestQuery?.limit}&search_key=${appointmentRequestQuery?.search_key}`, { signal })
            .then(response => {
                setAppointmentRequests(response?.data); 
                // setLoading(false);
            })
            .catch(error => {
                console.log(error) 
                // setLoading(false); 
            })
            .finally(() => {
                setLoading(false); 
            });
    } 

    return { appointmentRequests, getAppointmentRequests, loading, setAppointmentRequests }; 
} 
