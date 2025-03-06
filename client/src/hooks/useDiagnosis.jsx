import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useDiagnosis(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getDiagnosis(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createDiagnosis(diagnosis) {
        setLoading(true); 
        setErrors({}); 

        console.log(diagnosis); 
        return axiosInstance.post('diagnoses', diagnosis)
            .then(response => {
                setData(response?.data)
                console.log(response); 
                navigate(route('home.diagnoses.index'));
                swal.fire({
                    text: `Diagnosis (tests) created for patient.`, 
                    color: '#f2f2f20', 
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

    async function getDiagnosis(id) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axiosInstance.get(`diagnoses/${id}`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateDiagnosis(diagnosis) {
        setLoading(true); 
        setErrors({}); 
        console.log(diagnosis);

        return axiosInstance.put(`diagnoses/${id}`, diagnosis)
            .then(() => navigate(route('home.diagnoses.index')))
            .catch(error => setErrors(error?.response))
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteDiagnosis(diagnosis) { 
        console.log('diagnosis:', diagnosis); 
        return axiosInstance.patch(`diagnoses/${diagnosis}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreDiagnosis(diagnosis) {
        return axiosInstance.patch(`diagnoses/${diagnosis?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyDiagnosis(diagnosis) {
        return axiosInstance.delete(`diagnoses/${diagnosis?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        diagnosis: { data, setData, errors, loading }, 
        createDiagnosis, 
        getDiagnosis, 
        updateDiagnosis, 
        deleteDiagnosis, 
        restoreDiagnosis, 
        destroyDiagnosis
    }
}