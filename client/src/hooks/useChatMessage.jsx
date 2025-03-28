import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useChatMessage(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getChatMessage(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createChatMessage(chatMessage, chat_id) {
        setLoading(true); 
        setErrors({}); 

        // console.log(chatMessage); 
        // console.log(chat_id); 
        return axiosInstance.post(`chats/${chat_id}/messages`, chatMessage)
            .then(response => {
                setData(response?.data); 
                console.log(response);
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
                        text: `${error?.response?.status ?? '500'}: An error occured!`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    });
                }
                console.log(error);
            })
            .finally(() => setLoading(false));
    } 

    async function getChatMessage(id) {
        // setLoading(true); 
        // console.log(id);

        return axiosInstance.get(`chats/${id}/messages`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateChatMessage(chatMessage) {
        setLoading(true); 
        setErrors({}); 
        console.log(chatMessage);

        return axiosInstance.put(`chats/${id}/messages`, chatMessage)
            .then(() => navigate(route('home.chatMessages.index')))
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
                        text: `${error?.response?.status ?? '500'}: An error occured!`, 
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

    async function deleteChatMessage(chatMessage) { 
        console.log('chatMessage:', chatMessage); 
        return axiosInstance.patch(`chats/${chatMessage}/messages`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreChatMessage(chatMessage) {
        return axiosInstance.patch(`chats/${chatMessage?._id}/messages/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyChatMessage(chatMessage) {
        return axiosInstance.delete(`chats/${chatMessage?._id}/messages`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        chatMessage: { data, setData, errors, loading }, 
        createChatMessage, 
        getChatMessage, 
        updateChatMessage, 
        deleteChatMessage, 
        restoreChatMessage, 
        destroyChatMessage
    }
}