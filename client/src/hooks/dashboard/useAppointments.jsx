import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 

export function useAppointments(range = 'all') {
    const axiosInstance = useAxios(); 
    const [appointments, setAppointments] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getAppointments(range, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, [range]); 
 
    async function getAppointments(range, { signal } = {}) { 
        console.log(range)
        setAppointments([]); 
        return axiosInstance.get(`dashboard/appointments?range=${range}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setAppointments(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { appointments, getAppointments }; 
}; 