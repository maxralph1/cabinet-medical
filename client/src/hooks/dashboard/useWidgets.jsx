import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 

export function useWidgets() {
    const axiosInstance = useAxios(); 
    const [widgets, setWidgets] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getWidgets({}, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, []); 
 
    async function getWidgets({ signal } = {}) { 
        console.log({})
        setWidgets([]); 
        return axiosInstance.get(`dashboard/widgets`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setWidgets(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { widgets, getWidgets }; 
}; 