import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function usePatientChart(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getPatientChart(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createPatientChart(patientChart) {
        setLoading(true); 
        setErrors({}); 

        console.log(); 
        return axiosInstance.post('patient-charts', patientChart)
            .then(response => {
                setData(response?.data)
                console.log(response); 
                swal.fire({
                    text: `Patient Chart added.`, 
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
            .finally(() => setLoading(false));
    } 

    async function getPatientChart(id, { signal } = {}) {
        setLoading(true); 

        return axiosInstance.get(`patient-charts/${id}`, { signal })
            .then(response => {
                console.log(response); 
                setData(response?.data?.data); 
            })
            .catch(error => {
                console.error(error);
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false));
    }

    async function updatePatientChart(patientChart) {
        setLoading(true); 
        setErrors({}); 
        console.log(patientChart);

        return axiosInstance.putForm(`patient-charts/${id}`, patientChart)
            .then(response => {
                swal.fire({
                    text: `${response?.data?.success}`,
                    color: "#820303",
                    width: 350,
                    position: 'top',
                    showConfirmButton: false,
                });
            })
            .catch(error => {
                setErrors(error?.response); 
                console.error(error?.response); 
            })
            .finally(() => setLoading(false));
    }

    async function deletePatientChart(patientChart) {
        return axiosInstance.patch(`patient-charts/${patientChart?.id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyPatientChart(patientChart) {
        return axiosInstance.delete(`patient-charts/${patientChart?.id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function restorePatientChart(patientChart) {
        return axiosInstance.patch(`patient-charts/${patientChart?.id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        patientChart: { data, setData, errors, loading }, 
        getPatientChart, 
        createPatientChart, 
        updatePatientChart, 
        deletePatientChart, 
        destroyPatientChart, 
        restorePatientChart
    }
}