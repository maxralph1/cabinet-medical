import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function usePatients(userQuery) {
    const axiosInstance = useAxios(); 
    const [patients, setPatients] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userQuery !== null) {
            const controller = new AbortController(); 
            getPatients(userQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [userQuery]); 

    async function getPatients(userQuery, { signal } = {}) { 
        setPatients([]); 
        // console.log(userQuery);
        setLoading(true);
        console.log(loading);
        return axiosInstance.get(`patients?range=${userQuery?.range}&page=${userQuery?.page}&limit=${userQuery?.limit}&search_key=${userQuery?.search_key}`, { signal }) 
            .then(response => {
                setPatients(response?.data);
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

    return { patients, getPatients, setPatients, loading }; 
} 
