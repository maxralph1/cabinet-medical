import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useChatMessages(id) {
    const axiosInstance = useAxios(); 
    const [chatMessages, setChatMessages] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController(); 
            getChatMessages(id, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [id]); 

    async function getChatMessages(id, { signal } = {}) { 
        setChatMessages([]); 
        // console.log(chatQuery);
        setLoading(true);
        console.log(loading);
        return axiosInstance.get(`chats/${id}/messages`, { signal }) 
            .then(response => {
                setChatMessages(response?.data);
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

    return { chatMessages, getChatMessages, loading }; 
} 
