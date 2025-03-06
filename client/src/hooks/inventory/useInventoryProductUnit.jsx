import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useInventoryProductUnit(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getInventoryProductUnit(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createInventoryProductUnit(inventoryProductUnit) {
        setLoading(true); 
        setErrors({}); 

        // console.log(inventoryProductUnit); 
        return axiosInstance.post('inventory/product-units', inventoryProductUnit)
            .then(response => {
                setData(response?.data?.data)
                console.log(response); 
                swal.fire({
                    text: `Inventory ProductUnit created.`, 
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

    async function getInventoryProductUnit(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axiosInstance.get(`inventory/product-units/${id}?page=${page}&limit=${limit}`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateInventoryProductUnit(inventoryProductUnit) {
        setLoading(true); 
        setErrors({}); 
        console.log(inventoryProductUnit);

        return axiosInstance.put(`inventory/product-units/${id}`, inventoryProductUnit)
            .then(() => navigate(route('home.blog.publications.index')))
            .catch(error => setErrors(error?.response))
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteInventoryProductUnit(inventoryProductUnit) { 
        console.log('inventoryProductUnit:', inventoryProductUnit); 
        return axiosInstance.patch(`inventory/product-units/${inventoryProductUnit}`)
            .then(() => {})
            .catch(error => {
                console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreInventoryProductUnit(inventoryProductUnit) {
        return axiosInstance.patch(`inventory/product-units/${inventoryProductUnit?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyInventoryProductUnit(inventoryProductUnit) {
        return axiosInstance.delete(`inventory/product-units/${inventoryProductUnit?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        inventoryProductUnit: { data, setData, errors, loading }, 
        createInventoryProductUnit, 
        getInventoryProductUnit, 
        updateInventoryProductUnit, 
        deleteInventoryProductUnit, 
        restoreInventoryProductUnit, 
        destroyInventoryProductUnit
    }
}