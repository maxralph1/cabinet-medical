import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useAppointmentRequest(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getAppointmentRequest(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createAppointmentRequest(appointmentRequest) {
        setLoading(true); 
        setErrors({}); 

        // console.log(appointmentRequest); 
        return axios.post(`${ Constants?.serverURL }/api/v1/appointment-requests`, appointmentRequest)
            .then(response => {
                setData(response?.data); 
                swal.fire({
                    text: `Request received. You would be contacted shortly via the contact detail(s) you have provided as soon as an available slot is booked. Thanks!`, 
                    color: '#000000', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
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

    async function getAppointmentRequest(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axios.get(`${ Constants?.serverURL }/api/v1/appointment-requests/${id}?`)
            .then(response => setData(response?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateAppointmentRequest(appointmentRequest) {
        setLoading(true); 
        setErrors({}); 
        console.log(appointmentRequest);

        return axiosInstance.put(`appointment-requests/${id}`, appointmentRequest)
            .then(() => navigate(route('home.appointment-requests.index')))
            .catch(error => setErrors(error?.response))
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteAppointmentRequest(appointmentRequest) { 
        console.log('appointment request:', appointmentRequest); 
        return axiosInstance.patch(`appointment-requests/${appointmentRequest}`)
            .then(() => {})
            .catch(error => {
                console.log(error); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreAppointmentRequest(appointmentRequest) {
        return axiosInstance.patch(`appointment-requests/${appointmentRequest?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyAppointmentRequest(appointmentRequest) {
        return axiosInstance.delete(`appointment-requests/${appointmentRequest?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function approveAppointmentRequest(appointmentRequest) { 
        console.log('appointment request:', appointmentRequest); 
        return axiosInstance.patch(`appointment-requests/${appointmentRequest}/approve`)
            .then((response) => {
                swal.fire({
                    text: `Appointment Request approved.`, 
                    color: '#000000', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
                console.log(response);
            })
            .catch(error => {
                console.log(error); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function rejectAppointmentRequest(appointmentRequest) { 
        console.log('appointment request:', appointmentRequest); 
        return axiosInstance.patch(`appointment-requests/${appointmentRequest}/reject`)
            .then(() => {
                swal.fire({
                    text: `Appointment Request rejected.`, 
                    color: '#000000', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
                console.log(response);
            })
            .catch(error => {
                console.log(error); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 


    return {
        appointmentRequest: { data, setData, errors, loading }, 
        createAppointmentRequest, 
        getAppointmentRequest, 
        updateAppointmentRequest, 
        deleteAppointmentRequest, 
        restoreAppointmentRequest, 
        destroyAppointmentRequest, 
        approveAppointmentRequest, 
        rejectAppointmentRequest
    }
}