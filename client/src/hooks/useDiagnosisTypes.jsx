import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useDiagnosisTypes(userQuery) {
    const axiosInstance = useAxios(); 
    const [diagnosisTypes, setDiagnosisTypes] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userQuery !== null) {
            const controller = new AbortController(); 
            getDiagnosisTypes(userQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [userQuery]); 

    async function getDiagnosisTypes(userQuery, { signal } = {}) { 
        setDiagnosisTypes([]); 
        // console.log(userQuery);
        setLoading(true);
        console.log(loading);
        return axiosInstance.get(`diagnosis-types?range=${userQuery?.range}&page=${userQuery?.page}&limit=${userQuery?.limit}&search_key=${userQuery?.search_key}`, { signal }) 
            .then(response => {
                setDiagnosisTypes(response?.data);
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

    return { diagnosisTypes, getDiagnosisTypes, setDiagnosisTypes, loading }; 
} 
