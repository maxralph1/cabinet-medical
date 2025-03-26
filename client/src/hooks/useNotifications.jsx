import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 


export function useNotifications(notificationQuery) {
    const axiosInstance = useAxios(); 
    const [notifications, setNotifications] = useState([]); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (notificationQuery !== null) {
            const controller = new AbortController(); 
            getNotifications(notificationQuery, { signal: controller.signal }); 
            return () => { controller.abort() };
        }
    }, [notificationQuery]); 

    async function getNotifications(notificationQuery, { signal } = {}) { 
        console.log(notificationQuery);

        setNotifications([]); 
        setLoading(true); 
        // return axiosInstance.get(`notifications?page=${notificationQuery?.page}&limit=${notificationQuery?.limit}`, { signal })
        return axiosInstance.get(`notifications?page=${notificationQuery?.page}&limit=${notificationQuery?.limit}`, { signal })
            .then(response => {
                setNotifications(response?.data); 
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

    return { notifications, getNotifications, loading, setNotifications }; 
} 
