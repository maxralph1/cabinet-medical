import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useInventoryProductUnits(productUnitQuery) {
    const axiosInstance = useAxios(); 
    const [inventoryProductUnits, setInventoryProductUnits] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (productUnitQuery !== null) {
            const controller = new AbortController(); 
            getInventoryProductUnits(productUnitQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [productUnitQuery]); 

    async function getInventoryProductUnits(productUnitQuery, { signal } = {}) { 
        setInventoryProductUnits([]); 
        // console.log(productUnitQuery);
        setLoading(true);
        console.log(loading);
        return axiosInstance.get(`inventory/product-units?range=${productUnitQuery?.range}&page=${productUnitQuery?.page}&limit=${productUnitQuery?.limit}&search_key=${productUnitQuery?.search_key}`, { signal }) 
            .then(response => {
                setInventoryProductUnits(response?.data);
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

    return { inventoryProductUnits, getInventoryProductUnits, setInventoryProductUnits, loading }; 
} 
