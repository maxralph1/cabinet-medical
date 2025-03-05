import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 

export default function useRegimens(range = 'all') {
    const axiosInstance = useAxios(); 
    const [regimens, setRegimens] = useState([]); 

    useEffect(() => {
        const controller = new AbortController(); 
        getRegimens(range, { signal: controller.signal }); 
        return () => { controller.abort() };
    }, [range]); 
 
    async function getRegimens(range, { signal } = {}) { 
        console.log(range)
        setRegimens([]); 
        return axiosInstance.get(`dashboard/regimens?range=${range}`, { signal }) 
            .then(response => { 
                console.log(response?.data)
                setRegimens(response?.data)
            })
            .catch(error => console.log(error)); 
    } 

    return { regimens, getRegimens }; 
}; 