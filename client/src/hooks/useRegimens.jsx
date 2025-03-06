import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useRegimens(regimenQuery) {
    const axiosInstance = useAxios(); 
    const [regimens, setRegimens] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (regimenQuery !== null) {
            const controller = new AbortController(); 
            getRegimens(regimenQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [regimenQuery]); 

    async function getRegimens(regimenQuery, { signal } = {}) { 
        setRegimens([]); 
        // console.log(regimenQuery);
        setLoading(true);
        console.log(loading);
        return axiosInstance.get(`regimens?range=${regimenQuery?.range}&page=${regimenQuery?.page}&limit=${regimenQuery?.limit}&search_key=${regimenQuery?.search_key}`, { signal }) 
            .then(response => {
                setRegimens(response?.data);
                setLoading(false);
            })
            .catch(error => {
                console.log(error); 
                setLoading(false);
            })
            .finally(() => {
                setLoading(false); 
            });
    } 

    return { regimens, getRegimens, setRegimens, loading }; 
} 
