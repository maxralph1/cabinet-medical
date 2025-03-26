import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useMedicalBill(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getMedicalBill(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createMedicalBill(medicalBill) {
        setLoading(true); 
        setErrors({}); 

        // console.log(medicalBill); 
        return axiosInstance.post('medical-bills', medicalBill)
            .then(response => {
                setData(response?.data)
                // console.log(response); 
                navigate(route('home.medical-bills.index')); 
                swal.fire({
                    text: `Medical Bill added.`, 
                    color: '#000000', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
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

    async function getMedicalBill(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axiosInstance.get(`medical-bills/${id}?page=${page}&limit=${limit}`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateMedicalBill(medicalBill) {
        setLoading(true); 
        setErrors({}); 
        console.log(medicalBill);

        return axiosInstance.put(`medical-bills/${id}`, medicalBill)
            .then(() => {
                navigate(route('home.medical-bills.index')); 
                swal.fire({
                    text: `Medical Bill updated.`, 
                    color: '#000000', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
            })
            .catch(error => setErrors(error?.response))
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteMedicalBill(medicalBill) { 
        console.log('medicalBill:', medicalBill); 
        return axiosInstance.patch(`medical-bills/${medicalBill}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreMedicalBill(medicalBill) {
        return axiosInstance.patch(`medical-bills/${medicalBill?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyMedicalBill(medicalBill) {
        return axiosInstance.delete(`medical-bills/${medicalBill?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        medicalBill: { data, setData, errors, loading }, 
        createMedicalBill, 
        getMedicalBill, 
        updateMedicalBill, 
        deleteMedicalBill, 
        restoreMedicalBill, 
        destroyMedicalBill
    }
}