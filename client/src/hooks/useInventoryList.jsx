import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useInventoryList(inventoryQuery) {
    const axiosInstance = useAxios(); 
    const [inventoryList, setInventoryList] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (inventoryQuery !== null) {
            const controller = new AbortController(); 
            getInventoryList(inventoryQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [inventoryQuery]); 

    async function getInventoryList(inventoryQuery, { signal } = {}) { 
        setInventoryList([]); 
        // console.log(inventoryQuery);
        setLoading(true);
        console.log(loading);
        return axiosInstance.get(`inventory?range=${inventoryQuery?.range}&page=${inventoryQuery?.page}&limit=${inventoryQuery?.limit}&search_key=${inventoryQuery?.search_key}`, { signal }) 
            .then(response => {
                setInventoryList(response?.data);
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

    return { inventoryList, getInventoryList, setInventoryList, loading }; 
} 
