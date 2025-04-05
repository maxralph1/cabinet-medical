import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useAppointment(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getAppointment(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createAppointment(appointment) {
        setLoading(true); 
        setErrors({}); 

        // console.log(appointment); 
        return axiosInstance.post('appointments', appointment)
            .then(response => {
                setData(response?.data); 
                navigate(route('home.appointments.index'));
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

    async function getAppointment(id) {
        // setLoading(true); 
        // console.log(id);

        return axiosInstance.get(`appointments/${id}`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateAppointment(appointment) {
        setLoading(true); 
        setErrors({}); 
        console.log(appointment);

        return axiosInstance.put(`appointments/${id}`, appointment)
            .then(() => navigate(route('home.appointments.index')))
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

    async function deleteAppointment(appointment) { 
        console.log('appointment:', appointment); 
        return axiosInstance.patch(`appointments/${appointment}`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreAppointment(appointment) {
        return axiosInstance.patch(`appointments/${appointment?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyAppointment(appointment) {
        return axiosInstance.delete(`appointments/${appointment?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    }

    async function approveAppointment(appointment) { 
        console.log('appointment:', appointment); 
        return axiosInstance.patch(`appointments/${appointment}/approve`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function declineAppointment(appointment) { 
        console.log('appointment:', appointment); 
        return axiosInstance.patch(`appointments/${appointment}/decline`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function sendReminderAppointment(appointment) { 
        console.log('appointment:', appointment); 
        return axiosInstance.patch(`appointments/${appointment}/send-appointment-reminder`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 


    return {
        appointment: { data, setData, errors, loading }, 
        createAppointment, 
        getAppointment, 
        updateAppointment, 
        deleteAppointment, 
        restoreAppointment, 
        destroyAppointment, 
        approveAppointment, 
        declineAppointment, 
        sendReminderAppointment
    }
}