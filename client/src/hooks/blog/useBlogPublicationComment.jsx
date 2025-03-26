import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import useAxios from '@/utils/useAxios.jsx'; 
import swal from 'sweetalert2'; 


export function useBlogPublicationComment(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 

    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getBlogPublicationComment(id, { signal: controller.signal })
            return () => controller.abort(); 
        }
    }, [id]); 

    async function createBlogPublicationComment(blogPublication) {
        setLoading(true); 
        setErrors({}); 

        // console.log(blogPublicationComment); 
        return axiosInstance.post(`blog/comments`, blogPublication)
            .then(response => {
                setData(response?.data?.data)
                console.log(response); 
                // swal.fire({
                //     text: `Blog Publication Comment added.`,
                //     color: '#f2f2f2', 
                //     width: 325, 
                //     position: 'top', 
                //     showConfirmButton: false 
                // });
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

    async function getBlogPublicationComment(id) {
        // setLoading(true); 
        // console.log(id);

        return axiosInstance.get(`blog/comments/${id}`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function deleteBlogPublicationComment(blogPublicationComment) { 
        console.log('blogPublicationComment:', blogPublicationComment); 
        return axiosInstance.patch(`blog/comments/${blogPublicationComment}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreBlogPublicationComment(blogPublicationComment) {
        return axiosInstance.patch(`blog/comments/${blogPublicationComment?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyBlogPublicationComment(blogPublicationComment) {
        return axiosInstance.delete(`blog/comments/${blogPublicationComment?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    return {
        blogPublicationComment: { data, setData, errors, loading }, 
        createBlogPublicationComment, 
        getBlogPublicationComment, 
        deleteBlogPublicationComment, 
        restoreBlogPublicationComment, 
        destroyBlogPublicationComment
    }
}