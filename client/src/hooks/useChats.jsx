import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useChats(chatQuery) {
    const axiosInstance = useAxios(); 
    const [chats, setChats] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (chatQuery !== null) {
            const controller = new AbortController(); 
            getChats(chatQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [chatQuery]); 

    async function getChats(chatQuery, { signal } = {}) { 
        setChats([]); 
        // console.log(chatQuery);
        setLoading(true);
        console.log(loading);
        return axiosInstance.get(`chats?range=${chatQuery?.range}&page=${chatQuery?.page}&limit=${chatQuery?.limit}&search_key=${chatQuery?.search_key}`, { signal }) 
            .then(response => {
                setChats(response?.data);
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

    return { chats, getChats, setChats, loading }; 
} 
