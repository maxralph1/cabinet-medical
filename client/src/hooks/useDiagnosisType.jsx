import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useDiagnosisType(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getDiagnosisType(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createDiagnosisType(diagnosisType) {
        setLoading(true); 
        setErrors({}); 

        // console.log(diagnosisType); 
        return axiosInstance.post('diagnosis-types', diagnosisType)
            .then(response => {
                setData(response?.data)
                console.log(response); 
                swal.fire({
                    text: `Diagnosis Type created.`, 
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

    async function getDiagnosisType(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axiosInstance.get(`diagnosis-types/${id}?page=${page}&limit=${limit}`)
            .then(response => setData(response?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateDiagnosisType(diagnosisType) {
        setLoading(true); 
        setErrors({}); 
        console.log(diagnosisType);

        return axiosInstance.put(`diagnosis-types/${id}`, diagnosisType)
            .then(() => navigate(route('home.diagnosisTypes.index')))
            .catch(error => setErrors(error?.response))
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteDiagnosisType(diagnosisType) { 
        console.log('diagnosisType:', diagnosisType); 
        return axiosInstance.patch(`diagnosis-types/${diagnosisType}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreDiagnosisType(diagnosisType) {
        return axiosInstance.patch(`diagnosis-types/${diagnosisType?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyDiagnosisType(diagnosisType) {
        return axiosInstance.delete(`diagnosis-types/${diagnosisType?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        diagnosisType: { data, setData, errors, loading }, 
        createDiagnosisType, 
        getDiagnosisType, 
        updateDiagnosisType, 
        deleteDiagnosisType, 
        restoreDiagnosisType, 
        destroyDiagnosisType
    }
}