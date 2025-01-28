import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useDiagnoses(diagnosisQuery) {
    const axiosInstance = useAxios(); 
    const [diagnoses, setDiagnoses] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (diagnosisQuery !== null) {
            const controller = new AbortController(); 
            getDiagnoses(diagnosisQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [diagnosisQuery]); 

    async function getDiagnoses(diagnosisQuery, { signal } = {}) { 
        setDiagnoses([]); 
        // console.log(diagnosisQuery);
        setLoading(true);
        console.log(loading);
        return axiosInstance.get(`diagnoses?range=${diagnosisQuery?.range}&page=${diagnosisQuery?.page}&limit=${diagnosisQuery?.limit}&search_key=${diagnosisQuery?.search_key}`, { signal }) 
            .then(response => {
                setDiagnoses(response?.data);
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

    return { diagnoses, getDiagnoses, setDiagnoses, loading }; 
} 
