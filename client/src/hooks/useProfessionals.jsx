import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useProfessionals(userQuery) {
    const axiosInstance = useAxios(); 
    const [professionals, setProfessionals] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userQuery !== null) {
            const controller = new AbortController(); 
            getProfessionals(userQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [userQuery]); 

    async function getProfessionals(userQuery, { signal } = {}) { 
        setProfessionals([]); 
        // console.log(userQuery);
        setLoading(true);
        console.log(loading);
        return axiosInstance.get(`professionals?role=${userQuery?.role}&range=${userQuery?.range}&page=${userQuery?.page}&limit=${userQuery?.limit}`, { signal }) 
            .then(response => {
                setProfessionals(response?.data);
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

    return { professionals, getProfessionals, loading }; 
} 
