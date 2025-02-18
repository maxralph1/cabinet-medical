import { useState } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import FroalaEditor from 'react-froala-wysiwyg'; 
import FroalaEditorComponent from 'react-froala-wysiwyg'; 
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import { useBlogPublication } from '@/hooks/blog/useBlogPublication.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 
import SelectedCategoryComponent from '@/components/protected/nested-components/SelectedCategoryComponent'; 


export default function Edit() {
    const { id } = useParams(); 
    const { blogPublication, updateBlogPublication } = useBlogPublication(id); 
    console.log(blogPublication); 

    /** Image Processing */
    const [image, setImage] = useState(null); 

    const handleImageClick = () => {
        document.getElementById('image-upload-input').click();
    }; 

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImage(reader.result); 
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        }
    }; 

    const handleRemoveImage = () => {
        setImage(null);
    }; 
    /** End of Image Processing */

    /** Rich-text Editor */
    const [editorValue, setEditorValue] = useState('');
    /** End of Rich-text Editor */

    const [selectedCategoryItems, setSelectedCategoryItems] = useState([]); 
    console.log('selected:', selectedCategoryItems);

    const handleSubmit = async e => {
        e.preventDefault(); 
        // console.log(editorValue); 
        console.log(selectedCategoryItems); 

        const selectedCategoryItemsString = selectedCategoryItems.map(item => item._id).join(',');
        console.log('id strings:', selectedCategoryItemsString);

        // if ((selectedCategoryItems) && (selectedDiagnosisTypes?.length>0)) {
        if ((selectedCategoryItems)?.length > 0) {
            const formData = new FormData(); 
            (selectedCategoryItems?.length>0) && formData.append('categories', selectedCategoryItemsString); 
            (image) && formData.append('image', blogPublication?.data?.image); 
            blogPublication?.data?.title && formData.append('title', blogPublication?.data?.title); 
            (editorValue) && formData.append('content', editorValue); 

            await updateBlogPublication(formData); 
            await blogPublication?.setData({}); 
            await setSelectedCategoryItems([]); 
            await setEditorValue(''); 
        } else {
            swal.fire({
                text: `Please select a category.`, 
                color: '#900000', 
                width: 325, 
                position: 'top', 
                showConfirmButton: false
            });
        }
    }; 

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">
                    <Link 
                        to={ route('home.blog.publications.index') } className="">Blog Publications</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>Update Blog Publication</span>
                </h2>
            </div>

            <section className="pt-4">
                <form onSubmit={ handleSubmit } id="blog-publication-form" className="blog-publication-form">
                    <div className="row current-categories">
                        <SelectedCategoryComponent 
                            selectedCategoryItems={ selectedCategoryItems } 
                            setSelectedCategoryItems={ setSelectedCategoryItems } />
                    </div>
                    <section className="previous-categories pt-1 px-3">
                        <h3 className="fs-6">Previous Categories</h3>
                        {((selectedCategoryItems>0) ? selectedCategoryItems : blogPublication?.data?.categories)?.map((item, index) => (
                            <li key={index} className="d-flex align-items-center gap-3">
                                <div className="category d-flex justify-content-start align-items-center gap-3 pt-2">
                                    <div className="d-flex flex-column">
                                        <span className="fw-semibold badge rounded-pill text-bg-secondary">{ ((item?.name||item?.blog_category?.name)?.slice(0,1)?.toUpperCase() + (item?.name||item?.blog_category?.name)?.slice(1)) }
                                        </span>
                                    </div>
                                </div>
                                <div 
                                    onClick={ () => handleRemoveItem(item) } 
                                    className="cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FF0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                    </svg>
                                </div>
                            </li>
                        ))}
                    </section>
                    <div className="image row g-2 pt-3">
                        <div className="mb-3 position-relative"> 
                            <input
                                type="file"
                                accept="image/*"
                                id="image-upload-input"
                                style={{ display: 'none' }} 
                                onChange={ (e) => { blogPublication.setData({
                                                        ...blogPublication?.data,
                                                        image: e.target.files[0], 
                                                    });
                                                    handleImageChange(e)} }
                            />

                            <div onClick={handleImageClick} className="cursor-pointer border-radius-15 d-flex justify-content-center align-items-center" style={{ width: '150px', height: '150px', backgroundColor: '#f0f0f0' }}>
                                { blogPublication?.data?.image_path?.url ? (
                                    <img src={ blogPublication?.data?.image_path?.url } alt="Preview" className="border-radius-15" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="75" height="75" fill="#414141" className="bi bi-image" viewBox="0 0 16 16">
                                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                                        </svg>
                                    </span>
                                )}
                            </div> 

                            {/* Remove button */}
                            {image && (
                                <span 
                                    onClick={handleRemoveImage} 
                                    className="bg-transparent border-0"
                                    style={{
                                        position: 'absolute', 
                                        top: '0', 
                                        left: '155px', 
                                        cursor: 'pointer',
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#ff0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                    </svg>
                                </span>
                            )}
                        </div> 
                    </div> 
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="text" 
                                value={ blogPublication?.data?.title ?? '' }
                                id="title" 
                                className="form-control" 
                                onChange={ e => blogPublication.setData({
                                    ...blogPublication?.data,
                                    title: e.target.value,
                                }) } 
                                placeholder="WBC Count" 
                                required />
                            <label htmlFor="title">Title</label>
                        </div>
                    </div>
                    <div className="row">
                        {/* <div className="form-floating mb-3 col-sm-12 col-md-6"> */}
                        <div className="form-floating mb-3 col-12">
                            <FroalaEditorComponent 
                                tag="textarea" 
                                model={ blogPublication?.data?.content ?? '' } 
                                onModelChange={(content) => {
                                    setEditorValue(content)
                                }} />
                        </div>
                    </div>
                    
                    <div className="row">
                        {/* <div className="col-sm-12 col-md-6 d-flex justify-content-end pt-3"> */}
                        <div className="col-12 d-flex justify-content-end pt-3">
                            <button type="submit" className="btn btn-outline-secondary border-radius-25">Update</button>
                        </div>
                    </div>
                </form>
            </section>
        </Layout>
    )
}
