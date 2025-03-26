import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 

export function useRevenue(range = '') {
    const axiosInstance = useAxios(); 
    const [revenue, setRevenue] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getRevenue(range, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, [range]); 
 
    async function getRevenue(range, { signal } = {}) { 
        console.log(range)
        setRevenue([]); 
        return axiosInstance.get(`dashboard/revenue?range=${range}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setRevenue(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { revenue, getRevenue }; 
}; 