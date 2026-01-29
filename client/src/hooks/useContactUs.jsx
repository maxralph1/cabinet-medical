import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useContactUs(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getContactUs(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createContactUs(contactUs) {
        setLoading(true); 
        setErrors({}); 

        // console.log(contactUs); 
        return axios.post(`${ Constants?.serverURL }/api/v1/contact-us`, contactUs)
            .then(response => {
                setData(response?.data); 
                swal.fire({
                    text: `Request received. You would be contacted shortly via the contact detail(s) you have provided. Thanks!`, 
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

    async function getContactUs(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axios.get(`${ Constants?.serverURL }/api/v1/contact-us/${id}?`)
            .then(response => setData(response?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateContactUs(contactUs) {
        setLoading(true); 
        setErrors({}); 
        console.log(contactUs);

        return axiosInstance.put(`contact-us/${id}`, contactUs)
            .then(() => navigate(route('home.contact-us.index')))
            .catch(error => setErrors(error?.response))
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteContactUs(contactUs) { 
        console.log('appointment request:', contactUs); 
        return axiosInstance.patch(`contact-us/${contactUs}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreContactUs(contactUs) {
        return axiosInstance.patch(`contact-us/${contactUs?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyContactUs(contactUs) {
        return axiosInstance.delete(`contact-us/${contactUs?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        contactUs: { data, setData, errors, loading }, 
        createContactUs, 
        getContactUs, 
        updateContactUs, 
        deleteContactUs, 
        restoreContactUs, 
        destroyContactUs
    }
}