import { useContext, useState } from 'react'; 
import { useParams } from 'react-router-dom'
import AuthContext from '@/context/AuthContext.jsx'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useDiagnosis } from '@/hooks/useDiagnosis.jsx'; 
import { useDiagnosisSegment } from '@/hooks/useDiagnosisSegment.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Edit() {
    const { user } = useContext(AuthContext); 
    const { id } = useParams(); 
    const { diagnosis, getDiagnosis, updateDiagnosis } = useDiagnosis(id); 
    console.log('diagnosis:', diagnosis?.data); 

    const { updateDiagnosisSegment } = useDiagnosisSegment(); 

    const handleUpdate = async e => {
        e.preventDefault(); 

        if ((diagnosis?.data?.notes) || (diagnosis?.data?.comments)) {
            const formData = new FormData(); 
            diagnosis?.data?.notes && formData.append('notes', diagnosis?.data?.notes); 
            diagnosis?.data?.comments && formData.append('comments', diagnosis?.data?.comments); 

            await updateDiagnosis(formData); 
            await diagnosis?.setData({}); 
        } else {
            swal.fire({
                text: `Please update missing fields.`, 
                color: '#900000', 
                width: 325, 
                position: 'top', 
                showConfirmButton: false
            });
        }
    }

    const handleDiagnosisSegmentUpdate = async e => {
        e.preventDefault(); 

        if (!e.target.result.value) {
            swal.fire({
                text: `Please add a test result.`, 
                color: '#900000', 
                width: 325, 
                position: 'top', 
                showConfirmButton: false
            });
        } else {
            let test_id = e.target.id.value;
            let test_result = e.target.result.value;

            // const formData = new FormData(); 
            // e.target.id.value && formData.append('id', e.target.id.value); 
            // e.target.result.value && formData.append('result', e.target.result.value); 

            // await updateDiagnosisSegment(formData); 
            // await diagnosisSegment?.setData({}); 

            console.log(test_id, test_result); 
            await updateDiagnosisSegment(test_id, test_result); 
            await getDiagnosis(id);
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
                    <span>Update Diagnosis</span>
                </h2>
            </div>

            <section className="pt-4">
                <h3 className="fs-5">Diagnosis (Examination) Update for&nbsp;
                    { diagnosis?.data?.patient ? ((diagnosis?.data?.patient?.first_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.data?.patient?.first_name)?.slice(1)) + ' ' + ((diagnosis?.data?.patient?.last_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.data?.patient?.last_name)?.slice(1)) : 'N/A' }
                </h3>
            </section>

            <section className="diagnosis-segments">
                <h4 className="fs-6">Diagnosis Examinations</h4>
                            
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Type</th>
                                <th scope="col">Result</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody className="table-group-divider">
                            { diagnosis?.data?.diagnosis_segments?.map((diagnosisSegmentItem, index) => (
                                <tr key={ diagnosisSegmentItem?._id }>
                                    <td style={{ minWidth: '150px' }}>{ dayjs(diagnosisSegmentItem?.created_at).format('ddd, MMM D, YYYY h:mm A') }</td>
                                    <td style={{ minWidth: '150px' }}>{ diagnosisSegmentItem?.diagnosis_type?.title }</td>
                                    <td style={{ minWidth: '150px' }}>{ diagnosisSegmentItem?.result ?? 'N/A' }</td>
                                    <td>
                                        <div className="result-update-form">
                                            <form className="d-flex gap-3" onSubmit={ handleDiagnosisSegmentUpdate }>
                                                <input 
                                                    type="hidden" 
                                                    name="id" 
                                                    id={ diagnosisSegmentItem?._id } 
                                                    value={ diagnosisSegmentItem?._id } 
                                                    className="form-control" 
                                                    placeholder="Update result" />
                                                <input 
                                                    type="text" 
                                                    id="result" 
                                                    name="result" 
                                                    className="form-control" 
                                                    style={{ minWidth: '150px' }}
                                                    placeholder="Update result" />
                                                <button 
                                                    type="submit"  
                                                    className="btn btn-sm btn-outline-secondary border-radius-25">
                                                        Update
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </div>
                            
            </section>

            <section className="pt-3">
                <form onSubmit={ handleUpdate } id="diagnosis-form" className="diagnosis-form">
                    <div className="row">
                        <div className="form-floating mb-3 col-12">
                            <textarea 
                                id="notes" 
                                value={ diagnosis?.data?.notes ?? '' } 
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
                    <div className="row">
                        <div className="form-floating mb-3 col-12">
                            <textarea 
                                id="comments" 
                                value={ diagnosis?.data?.comments ?? '' } 
                                className="form-control" 
                                style={{ height: '100px' }}  
                                onChange={ e => diagnosis.setData({
                                    ...diagnosis?.data,
                                    comments: e.target.value,
                                }) } 
                                placeholder="This is the count of the White Blood Cells."></textarea>
                            <label htmlFor="comments">Comments</label>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end pt-3">
                        <button type="submit" className="btn btn-outline-secondary border-radius-25">Update</button>
                    </div>
                </form>
            </section>
        </Layout>
    )
}
