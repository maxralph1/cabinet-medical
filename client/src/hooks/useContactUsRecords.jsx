import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useContactUsRecords(contactUsQuery) {
    const axiosInstance = useAxios(); 
    const [contactUsRecords, setContactUsRecords] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (contactUsQuery !== null) {
            const controller = new AbortController(); 
            getContactUsRecords(contactUsQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [contactUsQuery]); 

    async function getContactUsRecords(contactUsQuery, { signal } = {}) { 
        console.log(contactUsQuery);

        setContactUsRecords([]); 
        setLoading(true); 
        // return axiosInstance.get(`contactUsRecords?page=${contactUsQuery?.page}&limit=${contactUsQuery?.limit}`, { signal })
        return axiosInstance.get(`contact-us?page=${contactUsQuery?.page}&limit=${contactUsQuery?.limit}&search_key=${contactUsQuery?.search_key}`, { signal })
            .then(response => {
                setContactUsRecords(response?.data); 
                // setLoading(false);
            })
            .catch(error => {
                console.log(error) 
                // setLoading(false); 
            })
            .finally(() => {
                setLoading(false); 
            });
    } 

    return { contactUsRecords, getContactUsRecords, loading, setContactUsRecords }; 
} 
