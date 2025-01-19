import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useAppointments(appointmentQuery) {
    const axiosInstance = useAxios(); 
    const [appointments, setAppointments] = useState([]); 

    useEffect(() => {
        if (appointmentQuery !== null) {
            const controller = new AbortController(); 
            getAppointments(appointmentQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [appointmentQuery]); 

    async function getAppointments(appointmentQuery, { signal } = {}) { 
        // console.log(appointmentQuery);

        setAppointments([]); 
        return axiosInstance.get(`appointments?page=${appointmentQuery?.page}&limit=${appointmentQuery?.limit}&search=${appointmentQuery?.search}`, { signal })
            .then(response => setAppointments(response?.data))
            .catch(error => console.log(error));
    } 

    return { appointments, getAppointments, setAppointments }; 
} 
