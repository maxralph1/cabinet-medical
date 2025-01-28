import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useDiagnosisTypes } from '@/hooks/useDiagnosisTypes.jsx'; 
import { useDiagnosis } from '@/hooks/useDiagnosis.jsx'; 
import { useVoiceToText } from '@/utils/useVoiceToText.jsx'; 
import scrollToTop from '@/utils/ScrollToTop.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Create() {
    const [selectedDiagnosisTypes, setSelectedDiagnosisTypes] = useState([]); 

    const addSelectedDiagnosisType = (selectedDiagnosisType) => {
        setSelectedDiagnosisTypes((prevSelectedDiagnosisTypes) => [...prevSelectedDiagnosisTypes, selectedDiagnosisType]);
    };

    const removeSelectedDiagnosisType = (selectedDiagnosisTypeToRemove) => {
        setSelectedDiagnosisTypes((prevSelectedDiagnosisTypes) => prevSelectedDiagnosisTypes.filter(selectedDiagnosisType => selectedDiagnosisType !== selectedDiagnosisTypeToRemove));
    };

    const { diagnosisTypes } = useDiagnosisTypes();
    const { diagnosis, createDiagnosis } = useDiagnosis(); 

    const handleSubmit = async e => {
        e.preventDefault(); 

        const formData = new FormData(); 
        diagnosis?.data?.proposed_time_start && formData.append('proposed_time_start', diagnosis?.data?.proposed_time_start); 
        diagnosis?.data?.proposed_time_end && formData.append('proposed_time_end', diagnosis?.data?.proposed_time_end); 

        await createDiagnosis(formData); 
        await diagnosis?.setData({}); 
    }

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">
                    <Link 
                        to={ route('home.diagnoses.index') } className="">Diagnoses</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>Add Diagnosis</span>
                </h2>
            </div>

            <section className="pt-4">
                <section className="selected-diagnosis-types">

                </section>

                <section className="diagnosis-types-selections">
                    <div className="row align-items-center">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <select 
                                id="diagnosis_type" 
                                className="form-select" 
                                placeholder="Diagnosis Type">
                                    <option>Choose one ...</option>
                                    { (diagnosisTypes?.data?.length > 0) && diagnosisTypes?.data?.map(diagnosisType => {
                                        return (
                                            <option 
                                                key={ diagnosisType?._id } 
                                                value={ diagnosisType?._id } 
                                                onChange={ event => product.setData({
                                                    ...product?.data,
                                                    diagnosisType: event.target.value,
                                                })} 
                                                id="diagnosisType" 
                                                aria-label="Product DiagnosisType" 
                                                aria-describedby="product diagnosisType">
                                                    <span className="w-100 d-flex justify-content-between">
                                                        <span>
                                                            { diagnosisType?.title }
                                                        </span>
                                                        <span 
                                                            className="btn btn-sm btn-outline-secondary border-radius-35"
                                                            onClick={() => addSelectedDiagnosisType(diagnosisType)}>
                                                                Add to List
                                                        </span>
                                                    </span>
                                            </option>
                                        )
                                    }) }
                            </select>
                            <label htmlFor="diagnosis_type">Diagnosis Type</label>
                        </div>

                        {/* <div className="col-md-3">
                            <span className="btn btn-sm btn-outline-secondary border-radius-35">Add to List</span>
                        </div> */}
                    </div> 
                </section>

                <form onSubmit={ handleSubmit } id="diagnosis-form" className="diagnosis-form">
                    <div className="row">
                        <div className="form-floating mb-3 col-12">
                            <textarea 
                                id="notes"
                                className="form-control" 
                                style={{ height: '100px' }}  
                                onChange={ e => diagnosisType.setData({
                                    ...diagnosisType?.data,
                                    notes: e.target.value,
                                }) } 
                                placeholder="This is the count of the White Blood Cells." 
                                required></textarea>
                            <label htmlFor="notes">Notes</label>
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
