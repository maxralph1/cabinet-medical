import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useAppointments(appointmentQuery) {
    const axiosInstance = useAxios(); 
    const [appointments, setAppointments] = useState([]); 
    const [loading, setLoading] = useState(true);

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
        setLoading(true); 
        // return axiosInstance.get(`appointments?page=${appointmentQuery?.page}&limit=${appointmentQuery?.limit}`, { signal })
        return axiosInstance.get(`appointments?page=${appointmentQuery?.page}&limit=${appointmentQuery?.limit}&search_key=${appointmentQuery?.search_key}&year=${appointmentQuery?.year}&month=${appointmentQuery?.month}&date=${appointmentQuery?.date}&time_start=${appointmentQuery?.time_start}&time_end=${appointmentQuery?.time_end}`, { signal })
            .then(response => {
                setAppointments(response?.data); 
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

    return { appointments, getAppointments, loading, setAppointments }; 
} 
