import { useState, useEffect } from 'react'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useNotification(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getNotification(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function getNotification(id) {

        return axiosInstance.get(`notifications/${id}?`)
            .then(response => setData(response?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function deleteNotification(notification) { 
        console.log('appointment request:', notification); 
        return axiosInstance.patch(`notifications/${notification}`)
            .then(() => {})
            .catch(error => {
                console.log(error); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreNotification(notification) {
        return axiosInstance.patch(`notifications/${notification?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyNotification(notification) {
        return axiosInstance.delete(`notifications/${notification?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        notification: { data, setData, errors, loading }, 
        getNotification, 
        deleteNotification, 
        restoreNotification, 
        destroyNotification,
    }
}