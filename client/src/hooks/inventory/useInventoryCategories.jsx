import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useInventoryCategories(categoryQuery) {
    const axiosInstance = useAxios(); 
    const [inventoryCategories, setInventoryCategories] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (categoryQuery !== null) {
            const controller = new AbortController(); 
            getInventoryCategories(categoryQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [categoryQuery]); 

    async function getInventoryCategories(categoryQuery, { signal } = {}) { 
        setInventoryCategories([]); 
        // console.log(categoryQuery);
        setLoading(true);
        console.log(loading);
        return axiosInstance.get(`inventory/categories?range=${categoryQuery?.range}&page=${categoryQuery?.page}&limit=${categoryQuery?.limit}&search_key=${categoryQuery?.search_key}`, { signal }) 
            .then(response => {
                setInventoryCategories(response?.data);
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

    return { inventoryCategories, getInventoryCategories, setInventoryCategories, loading }; 
} 
