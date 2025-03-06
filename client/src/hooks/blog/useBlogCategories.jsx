import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useBlogCategories(categoryQuery) {
    const axiosInstance = useAxios(); 
    const [blogCategories, setBlogCategories] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (categoryQuery !== null) {
            const controller = new AbortController(); 
            getBlogCategories(categoryQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [categoryQuery]); 

    async function getBlogCategories(categoryQuery, { signal } = {}) { 
        setBlogCategories([]); 
        // console.log(categoryQuery);
        setLoading(true);
        console.log(loading);
        return axiosInstance.get(`blog/categories?range=${categoryQuery?.range}&page=${categoryQuery?.page}&limit=${categoryQuery?.limit}&search_key=${categoryQuery?.search_key}`, { signal }) 
            .then(response => {
                setBlogCategories(response?.data);
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

    return { blogCategories, getBlogCategories, setBlogCategories, loading }; 
} 
