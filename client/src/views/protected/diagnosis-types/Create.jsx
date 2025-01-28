import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useDiagnosisType } from '@/hooks/useDiagnosisType.jsx'; 
import { useVoiceToText } from '@/utils/useVoiceToText.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Create() {
    const { diagnosisType, createDiagnosisType } = useDiagnosisType(); 

    const handleSubmit = async e => {
        e.preventDefault(); 

        const formData = new FormData(); 
        diagnosisType?.data?.title && formData.append('title', diagnosisType?.data?.title); 
        diagnosisType?.data?.description && formData.append('description', diagnosisType?.data?.description); 

        await createDiagnosisType(formData); 
        await diagnosisType?.setData({}); 
    }

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">
                    <Link 
                        to={ route('home.diagnosis-types.index') } className="">Diagnosis Types</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>Add Diagnosis Type</span>
                </h2>
            </div>

            <section className="pt-4">
                <form onSubmit={ handleSubmit } id="diagnosis-type-form" className="diagnosis-type-form">
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="text" 
                                id="title" 
                                className="form-control" 
                                onChange={ e => diagnosisType.setData({
                                    ...diagnosisType?.data,
                                    title: e.target.value,
                                }) } 
                                placeholder="WBC Count" 
                                required />
                            <label htmlFor="title">Title</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <textarea 
                                id="description"
                                className="form-control" 
                                style={{ height: '100px' }}  
                                onChange={ e => diagnosisType.setData({
                                    ...diagnosisType?.data,
                                    description: e.target.value,
                                }) } 
                                placeholder="This is the count of the White Blood Cells." 
                                required></textarea>
                            <label htmlFor="description">Description</label>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end pt-3">
                        <button type="submit" className="btn btn-outline-secondary border-radius-25">Save</button>
                    </div>
                </form>
            </section>
        </Layout>
    )
}
