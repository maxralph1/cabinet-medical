import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useInventoryInvoices(invoiceQuery) {
    const axiosInstance = useAxios(); 
    const [inventoryInvoices, setInventoryInvoices] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (invoiceQuery !== null) {
            const controller = new AbortController(); 
            getInventoryInvoices(invoiceQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [invoiceQuery]); 

    async function getInventoryInvoices(invoiceQuery, { signal } = {}) { 
        setInventoryInvoices([]); 
        console.log(invoiceQuery);
        setLoading(true);
        console.log(loading);
        return axiosInstance.get(`inventory/invoices?range=${invoiceQuery?.range}&page=${invoiceQuery?.page}&limit=${invoiceQuery?.limit}&search_key=${invoiceQuery?.search_key}`, { signal }) 
            .then(response => {
                setInventoryInvoices(response?.data);
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

    return { inventoryInvoices, getInventoryInvoices, setInventoryInvoices, loading }; 
} 
