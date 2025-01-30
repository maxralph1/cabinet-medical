import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useMedicalBills(medicalBillQuery) {
    const axiosInstance = useAxios(); 
    const [medicalBills, setMedicalBills] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (medicalBillQuery !== null) {
            const controller = new AbortController(); 
            getMedicalBills(medicalBillQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [medicalBillQuery]); 

    async function getMedicalBills(medicalBillQuery, { signal } = {}) { 
        setMedicalBills([]); 
        // console.log(medicalBillQuery);
        setLoading(true);
        console.log(loading);
        return axiosInstance.get(`medical-bills?range=${medicalBillQuery?.range}&page=${medicalBillQuery?.page}&limit=${medicalBillQuery?.limit}&search_key=${medicalBillQuery?.search_key}`, { signal }) 
            .then(response => {
                setMedicalBills(response?.data);
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

    return { medicalBills, getMedicalBills, setMedicalBills, loading }; 
} 
