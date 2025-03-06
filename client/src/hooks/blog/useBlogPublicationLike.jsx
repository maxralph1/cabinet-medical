import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useBlogPublicationLike(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 

    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getBlogPublicationLike(id, { signal: controller.signal })
            return () => controller.abort(); 
        }
    }, [id]); 

    async function createBlogPublicationLike(blogPublication) {
        setLoading(true); 
        setErrors({}); 

        // console.log(blogPublicationLike); 
        return axiosInstance.post(`blog/likes`, { article: blogPublication })
            .then(response => {
                console.log(response); 
                setData(response?.data?.data)
                // swal.fire({
                //     text: `Blog Publication liked.`,
                //     color: '#f2f2f20', 
                //     width: 325, 
                //     position: 'top', 
                //     showConfirmButton: false 
                // });
            })
            .catch(error => {
                console.log(error); 
                console.log(error?.response); 
                setErrors(error?.response); 
                if (error?.response?.status == 409) {
                    swal.fire({
                        text: `${error?.response?.data?.message}`, 
                        color: '#900000', 
                        width: 325, 
                        position: 'top', 
                        showConfirmButton: false
                    });
                }
                // } else {
                //     swal.fire({
                //         text: `${error?.response?.status}: An error occured!`, 
                //         color: '#900000', 
                //         width: 325, 
                //         position: 'top', 
                //         showConfirmButton: false
                //     });
                // }
                // console.log(error);
            })
            .finally(() => {
                setLoading(false); 
                setData({});
            });
    } 

    async function getBlogPublicationLike(id) {
        // setLoading(true); 
        // console.log(id);

        return axiosInstance.get(`blog/likes/${id}`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function deleteBlogPublicationLike(blogPublicationLike) { 
        console.log('blogPublicationLike:', blogPublicationLike); 
        return axiosInstance.patch(`blog/likes/${blogPublicationLike?._id}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreBlogPublicationLike(blogPublicationLike) {
        return axiosInstance.patch(`blog/likes/${blogPublicationLike?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyBlogPublicationLike(blogPublicationLike) {
        return axiosInstance.delete(`blog/likes/${blogPublicationLike?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    return {
        blogPublicationLike: { data, setData, errors, loading }, 
        createBlogPublicationLike, 
        getBlogPublicationLike, 
        deleteBlogPublicationLike, 
        restoreBlogPublicationLike, 
        destroyBlogPublicationLike
    }
}