import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useInventoryProducts(productQuery) {
    const axiosInstance = useAxios(); 
    const [inventoryProducts, setInventoryProducts] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (productQuery !== null) {
            const controller = new AbortController(); 
            getInventoryProducts(productQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [productQuery]); 

    async function getInventoryProducts(productQuery, { signal } = {}) { 
        setInventoryProducts([]); 
        // console.log(productQuery);
        setLoading(true);
        console.log(loading);
        return axiosInstance.get(`inventory/products?range=${productQuery?.range}&page=${productQuery?.page}&limit=${productQuery?.limit}&search_key=${productQuery?.search_key}`, { signal }) 
            .then(response => {
                setInventoryProducts(response?.data);
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

    return { inventoryProducts, getInventoryProducts, setInventoryProducts, loading }; 
} 
