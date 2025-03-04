import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import { route } from '@/routes'; 
import useAxios from '@/utils/useAxios.jsx'; 
import axios from 'axios'; 
import Constants from '@/utils/Constants.jsx'; 
import swal from 'sweetalert2'; 


export function useBlogPublication(id = null) {
    const [errors, setErrors] = useState({}); 
    const [loading, setLoading] = useState(false); 
    const [data, setData] = useState({}); 
    const navigate = useNavigate(); 
    const axiosInstance = useAxios(); 

    useEffect(() => {
        if (id !== null) {
            const controller = new AbortController();
            getBlogPublication(id, { signal: controller.signal })
            return () => controller.abort();
        }
    }, [id]);

    async function createBlogPublication(blogPublication) {
        setLoading(true); 
        setErrors({}); 

        // console.log(blogPublication); 
        return axiosInstance.post('blog/articles', blogPublication)
            .then(response => {
                setData(response?.data?.data)
                console.log(response); 
                swal.fire({
                    text: `Blog Publication created.`, 
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

    async function getBlogPublication(id, page, limit) {
        // setLoading(true); 
        // console.log(id, page, limit);

        // return axiosInstance.get(`blog/articles/${id}?page=${page}&limit=${limit}`)
        return axios.get(`${ Constants?.serverURL }/api/v1/blog/articles/${id}?page=${page}&limit=${limit}`)
            .then(response => setData(response?.data?.data))
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false));
    } 

    async function updateBlogPublication(blogPublication) {
        setLoading(true); 
        setErrors({}); 
        console.log(blogPublication);

        return axiosInstance.put(`blog/articles/${id}`, blogPublication)
            // .then(() => navigate(route('home.blog.publications.index')))
            .then(() => navigate(route('home.blog.index')))
            .catch(error => setErrors(error?.response))
            .finally(() => {
                setLoading(false); 
                setData({}); 
            });
    }

    async function deleteBlogPublication(blogPublication) { 
        console.log('blogPublication:', blogPublication); 
        return axiosInstance.patch(`blog/articles/${blogPublication}`)
            .then(() => {})
            .catch(error => {
                // console.log(error?.response); 
                setErrors(error?.response); 
            })
            .finally(() => setLoading(false)); 
    } 

    async function restoreBlogPublication(blogPublication) {
        return axiosInstance.patch(`blog/articles/${blogPublication?._id}/restore`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    async function destroyBlogPublication(blogPublication) {
        return axiosInstance.delete(`blog/articles/${blogPublication?._id}`)
            .then(() => {})
            .catch(error => setErrors(error?.response))
            .finally(() => setLoading(false)); 
    } 

    return {
        blogPublication: { data, setData, errors, loading }, 
        createBlogPublication, 
        getBlogPublication, 
        updateBlogPublication, 
        deleteBlogPublication, 
        restoreBlogPublication, 
        destroyBlogPublication 
    }
}