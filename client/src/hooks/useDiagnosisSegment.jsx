import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useDiagnosisSegment(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getDiagnosisSegment(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createDiagnosisSegment(diagnosisSegment) {
        setLoading(true); 
        setErrors({}); 

        // console.log(diagnosisSegment); 
        return axiosInstance.post('diagnosis-segments', diagnosisSegment)
            .then(response => {
                setData(response?.data)
                console.log(response); 
                swal.fire({
                    text: `Diagnosis Segment created.`, 
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

    async function getDiagnosisSegment(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axiosInstance.get(`diagnosis-segments/${id}?page=${page}&limit=${limit}`)
            .then(response => setData(response?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    // async function updateDiagnosisSegment(diagnosisSegment) {
    async function updateDiagnosisSegment(id, result) {
        setLoading(true); 
        setErrors({}); 
        // console.log(diagnosisSegment);

        // return axiosInstance.put(`diagnosis-segments/${id}`, diagnosisSegment)
        return axiosInstance.put(`diagnosis-segments/${id}`, { result:result })
            .then(() => {
                swal.fire({
                    text: `Test result updated.`, 
                    color: '#000000', 
                    width: 325, 
                    position: 'top', 
                    showConfirmButton: false
                });
            })
            .catch(error => {
                console.log(error);
                setErrors(error?.response);
            })
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteDiagnosisSegment(diagnosisSegment) { 
        console.log('diagnosisSegment:', diagnosisSegment); 
        return axiosInstance.patch(`diagnosis-segments/${diagnosisSegment}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreDiagnosisSegment(diagnosisSegment) {
        return axiosInstance.patch(`diagnosis-segments/${diagnosisSegment?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyDiagnosisSegment(diagnosisSegment) {
        return axiosInstance.delete(`diagnosis-segments/${diagnosisSegment?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        diagnosisSegment: { data, setData, errors, loading }, 
        createDiagnosisSegment, 
        getDiagnosisSegment, 
        updateDiagnosisSegment, 
        deleteDiagnosisSegment, 
        restoreDiagnosisSegment, 
        destroyDiagnosisSegment
    }
}