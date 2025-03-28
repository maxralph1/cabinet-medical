import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useChat(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getChat(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createChat(user_id) {
        setLoading(true); 
        setErrors({}); 

        console.log(user_id); 
        return axiosInstance.post('chats', { user_id })
            .then(response => {
                setData(response?.data)
                console.log(response); 
                // navigate(route('home.chats.index'));
                // swal.fire({
                //     text: `Chat (tests) created for patient.`, 
                //     color: '#000000', 
                //     width: 325, 
                //     position: 'top', 
                //     showConfirmButton: false
                // });
            })
            .catch(error => {
                setErrors(error?.response); 
                if (error?.response?.status == 409) {
                    swal.fire({
                        text: `${error?.response?.data?.message}`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    });
                } else {
                    swal.fire({
                        text: `${error?.response?.status}: An error occured!`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    });
                }
                console.log(error);
            })
            .finally(() => {
                setLoading(false); 
                setData({});
            });
    } 

    async function getChat(id) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axiosInstance.get(`chats/${id}`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateChat(chat) {
        setLoading(true); 
        setErrors({}); 
        console.log(chat);

        return axiosInstance.put(`chats/${id}`, chat)
            .then(() => navigate(route('home.chats.index')))
            .catch(error => setErrors(error?.response))
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteChat(chat) { 
        console.log('chat:', chat); 
        return axiosInstance.patch(`chats/${chat}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreChat(chat) {
        return axiosInstance.patch(`chats/${chat?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyChat(chat) {
        return axiosInstance.delete(`chats/${chat?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        chat: { data, setData, errors, loading }, 
        createChat, 
        getChat, 
        updateChat, 
        deleteChat, 
        restoreChat, 
        destroyChat
    }
}