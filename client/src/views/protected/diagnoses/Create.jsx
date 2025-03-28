import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import swal from 'sweetalert2'; 
import { useDiagnosisTypes } from '@/hooks/useDiagnosisTypes.jsx'; 
import { useDiagnosis } from '@/hooks/useDiagnosis.jsx'; 
import SelectedUserComponent from '@/components/protected/nested-components/SelectedUserComponent';
import Layout from '@/components/protected/Layout.jsx'; 


export default function Create() {
    const [selectedUserItem, setSelectedUserItem] = useState(null); 
    // console.log('selected user here: ', selectedUserItem); 

    const [selectedDiagnosisTypes, setSelectedDiagnosisTypes] = useState([]); 
    // console.log('selected:', selectedDiagnosisTypes); 

    const addSelectedDiagnosisType = (selectedDiagnosisType) => {
        if (selectedDiagnosisTypes?.includes(selectedDiagnosisType)) return;
        setSelectedDiagnosisTypes((prevSelectedDiagnosisTypes) => [...prevSelectedDiagnosisTypes, selectedDiagnosisType]);
    };

    const removeSelectedDiagnosisType = (selectedDiagnosisTypeToRemove) => {
        setSelectedDiagnosisTypes((prevSelectedDiagnosisTypes) => prevSelectedDiagnosisTypes.filter(selectedDiagnosisType => selectedDiagnosisType !== selectedDiagnosisTypeToRemove));
    };

    const { diagnosisTypes } = useDiagnosisTypes();
    const { diagnosis, createDiagnosis } = useDiagnosis(); 

    const handleSubmit = async e => {
        e.preventDefault(); 

        if ((selectedUserItem) && (selectedDiagnosisTypes?.length>0)) {
            const formData = new FormData(); 
            selectedUserItem && formData.append('patient', selectedUserItem?._id); 
            selectedDiagnosisTypes && formData.append('diagnosis_types', selectedDiagnosisTypes); 
            diagnosis?.data?.notes && formData.append('notes', diagnosis?.data?.notes); 

            await createDiagnosis(formData); 
            await diagnosis?.setData({}); 
            setSelectedUserItem(''); 
            setSelectedDiagnosisTypes([]); 
        } else {
            // console.log('Please select a patient and at least one diagnosis type.'); 
            swal.fire({
                text: `Please select a patient and at least one diagnosis type.`, 
                color: '#900000', 
                width: 325, 
                position: 'top', 
                showConfirmButton: false
            });
        }
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
                <SelectedUserComponent 
                    selectedUserItem={ selectedUserItem } 
                    setSelectedUserItem={ setSelectedUserItem } />

                <section className="diagnosis-types-selections">
                    <div className="row align-items-center">
                        <div className="form-floating mb-3 col-9">
                            <select
                                id="diagnosis_type" 
                                className="form-select" 
                                onChange={ e => {
                                    addSelectedDiagnosisType(e.target.value);
                                }} 
                                placeholder="Diagnosis Type">
                                    {/* <option value="">Choose one ...</option> */}
                                    { (diagnosisTypes?.data?.length > 0) && diagnosisTypes?.data?.map(diagnosisType => {
                                        return (
                                            <option 
                                                key={ diagnosisType?._id } 
                                                value={ diagnosisType?._id } 
                                                id="diagnosisType" 
                                                className=""
                                                aria-label="Diagnosis Type" 
                                                aria-describedby="diagnosis type">
                                                    { diagnosisType?.title }
                                            </option>
                                        )
                                    }) }
                            </select>
                            <label htmlFor="diagnosis_type">Select Tests (Diagnosis Types)</label>
                            {/* <small className="text-secondary">Select tests to be carried out.</small> */}
                        </div>
                        
                    </div> 
                </section>

                <section className="selected-diagnosis-types px-3 pt-2 pb-3">
                    { selectedDiagnosisTypes?.length > 0 && 
                        <h3 className="fs-6 fw-normal">Selected tests to be carried out:</h3> 
                    }
                    <div>
                        { selectedDiagnosisTypes?.length > 0 && selectedDiagnosisTypes?.map((selectedDiagnosisType, index) => {
                            return (
                                <article key={selectedDiagnosisType} className="selected-diagnosis-type">
                                    <div className="d-flex justify-content-start align-items-center gap-3">
                                        <span>{ index+1 }.</span>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="fw-semibold">
                                                {diagnosisTypes?.data?.length > 0 && diagnosisTypes?.data?.find(diagnosisTypes => diagnosisTypes?._id == selectedDiagnosisType)?.title }
                                            </span>
                                            <button 
                                                onClick={() => removeSelectedDiagnosisType(selectedDiagnosisType)} 
                                                className="border-0 bg-transparent"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FF0000" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            )
                        }) } 
                    </div>
                </section>

                <form onSubmit={ handleSubmit } id="diagnosis-form" className="diagnosis-form">
                    <div className="row">
                        <div className="form-floating mb-3 col-12">
                            <textarea 
                                id="notes"
                                className="form-control" 
                                style={{ height: '100px' }}  
                                onChange={ e => diagnosis.setData({
                                    ...diagnosis?.data,
                                    notes: e.target.value,
                                }) } 
                                placeholder="This is the count of the White Blood Cells."></textarea>
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
