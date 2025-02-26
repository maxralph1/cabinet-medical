import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 


export function useBlogPublications(publicationQuery) {
    const axiosInstance = useAxios(); 
    const [blogPublications, setBlogPublications] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (publicationQuery !== null) {
            const controller = new AbortController(); 
            getBlogPublications(publicationQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [publicationQuery]); 

    async function getBlogPublications(publicationQuery, { signal } = {}) { 
        setBlogPublications([]); 
        // console.log(publicationQuery);
        setLoading(true);
        console.log(loading);
        // return axiosInstance.get(`blog/articles?range=${publicationQuery?.range}&page=${publicationQuery?.page}&limit=${publicationQuery?.limit}&search_key=${publicationQuery?.search_key}`, { signal }) 
        return axios.get(`${ Constants?.serverURL }/api/v1/blog/articles?range=${publicationQuery?.range}&page=${publicationQuery?.page}&limit=${publicationQuery?.limit}&search_key=${publicationQuery?.search_key}`, { signal }) 
            .then(response => {
                setBlogPublications(response?.data);
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

    return { blogPublications, getBlogPublications, setBlogPublications, loading }; 
} 
