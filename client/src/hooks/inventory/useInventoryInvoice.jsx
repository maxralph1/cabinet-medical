import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useInventoryInvoice(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 


    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getInventoryInvoice(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createInventoryInvoice(inventoryInvoice) {
        setLoading(true); 
        setErrors({}); 

        // console.log(inventoryInvoice); 
        return axiosInstance.post('inventory/invoices', inventoryInvoice)
            .then(response => {
                setData(response?.data?.data)
                console.log(response); 
                swal.fire({
                    text: `Inventory Invoice created.`, 
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

    async function getInventoryInvoice(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        return axiosInstance.get(`inventory/invoices/${id}?page=${page}&limit=${limit}`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateInventoryInvoice(inventoryInvoice) {
        setLoading(true); 
        setErrors({}); 
        console.log(inventoryInvoice);

        return axiosInstance.put(`inventory/invoices/${id}`, inventoryInvoice)
            .then(() => navigate(route('home.inventory.invoices.index')))
            .catch(error => setErrors(error?.response))
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteInventoryInvoice(inventoryInvoice) { 
        console.log('inventoryInvoice:', inventoryInvoice); 
        return axiosInstance.patch(`inventory/invoices/${inventoryInvoice}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreInventoryInvoice(inventoryInvoice) {
        return axiosInstance.patch(`inventory/invoices/${inventoryInvoice?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyInventoryInvoice(inventoryInvoice) {
        return axiosInstance.delete(`inventory/invoices/${inventoryInvoice?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 


    return {
        inventoryInvoice: { data, setData, errors, loading }, 
        createInventoryInvoice, 
        getInventoryInvoice, 
        updateInventoryInvoice, 
        deleteInventoryInvoice, 
        restoreInventoryInvoice, 
        destroyInventoryInvoice
    }
}