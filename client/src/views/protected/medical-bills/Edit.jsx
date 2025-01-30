import { Link, useParams } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useMedicalBill } from '@/hooks/useMedicalBill.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 


export default function Edit() {
    const { id } = useParams(); 
    const { medicalBill, updateMedicalBill } = useMedicalBill(id); 
    // console.log(medicalBill); 

    const handleUpdate = async e => {
        e.preventDefault(); 

        const formData = new FormData(); 
        medicalBill?.data?.purpose && formData.append('purpose', medicalBill?.data?.purpose); 
        medicalBill?.data?.notes && formData.append('notes', medicalBill?.data?.notes); 
        medicalBill?.data?.comments && formData.append('comments', medicalBill?.data?.comments); 
        medicalBill?.data?.amount && formData.append('amount', medicalBill?.data?.amount); 
        medicalBill?.data?.fully_paid && formData.append('fully_paid', medicalBill?.data?.fully_paid); 
        medicalBill?.data?.fully_paid_on && formData.append('fully_paid_on', medicalBill?.data?.fully_paid_on); 

        await updateMedicalBill(formData); 
        await medicalBill?.setData({}); 
    }

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">
                    <Link 
                        to={ route('home.medical-bills.index') } className="">Medical Bills</Link>&nbsp;
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                        <path
                            d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                    </svg>&nbsp;
                    <span>Add Medical Bill</span>
                </h2>
            </div>

            <section className="pt-3">
                <form onSubmit={ handleUpdate }>
                    <div className="row pb-3">
                        <span>Patient:&nbsp;
                            <span className="fw-semibold">
                                { medicalBill?.data?.patient ? ((medicalBill?.data?.patient?.first_name)?.slice(0,1)?.toUpperCase()+(medicalBill?.data?.patient?.first_name)?.slice(1)) + ' ' + ((medicalBill?.data?.patient?.last_name)?.slice(0,1)?.toUpperCase()+(medicalBill?.data?.patient?.last_name)?.slice(1)) : 'N/A' }
                            </span>
                        </span>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-12">
                            <textarea 
                                id="purpose"
                                className="form-control" 
                                style={{ height: '100px' }}  
                                value={ medicalBill?.data?.purpose ?? '' } 
                                onChange={ e => medicalBill.setData({
                                    ...medicalBill?.data,
                                    purpose: e.target.value,
                                }) } 
                                placeholder="This is for the medication." 
                                required></textarea>
                            <label htmlFor="purpose">Purpose</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-12">
                            <textarea 
                                id="notes"
                                className="form-control" 
                                style={{ height: '100px' }} 
                                value={ medicalBill?.data?.notes ?? '' } 
                                onChange={ e => medicalBill.setData({
                                    ...medicalBill?.data,
                                    notes: e.target.value,
                                }) } 
                                placeholder="This is for the medication." 
                                required></textarea>
                            <label htmlFor="notes">Notes</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-12">
                            <textarea 
                                id="comments"
                                className="form-control" 
                                style={{ height: '100px' }} 
                                value={ medicalBill?.data?.comments ?? '' } 
                                onChange={ e => medicalBill.setData({
                                    ...medicalBill?.data,
                                    comments: e.target.value,
                                }) } 
                                placeholder="This is for the medication." 
                                required></textarea>
                            <label htmlFor="comments">Comments</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="number" 
                                id="amount" 
                                step="0.01" 
                                min="0"  
                                className="form-control" 
                                value={ medicalBill?.data?.amount ?? '' } 
                                onChange={ e => medicalBill.setData({
                                    ...medicalBill?.data,
                                    amount: e.target.value,
                                }) } 
                                placeholder="123.00" 
                                required />
                            <label htmlFor="amount">Amount (in MUR)</label>
                        </div>
                    </div>
                    <div className="usability row g-2">
                        <div className="col-md">
                            <div className="mb-3">
                                <div className="d-flex align-items-center gap-1 px-3 py-2">
                                    { (medicalBill?.data?.fully_paid == true) 
                                        ?   <span 
                                                type="button" 
                                                onClick={ () => {
                                                    medicalBill.setData({
                                                        ...medicalBill?.data,
                                                        fully_paid: false,
                                                    })
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-on" viewBox="0 0 16 16">
                                                        <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8"/>
                                                    </svg>
                                            </span>
                                        : (medicalBill?.data?.fully_paid == false) 
                                            ?   <span 
                                                    type="button" 
                                                    onClick={ () => {
                                                        medicalBill.setData({
                                                            ...medicalBill?.data,
                                                            fully_paid: true,
                                                        })
                                                    }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-toggle-off" viewBox="0 0 16 16">
                                                            <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zm-6 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5"/>
                                                        </svg>
                                                </span>
                                                    : '' } 
                                                <span>Set Medical Bill to fully paid.</span>
                                </div>
                            </div>
                        </div> 
                    </div>
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="date" 
                                id="fully_paid_on" 
                                className="form-control" 
                                value={ medicalBill?.data?.fully_paid_on ?? '' }
                                onChange={ e => medicalBill.setData({
                                    ...medicalBill?.data,
                                    fully_paid_on: e.target.value,
                                }) } 
                                placeholder="2025-01-23" />
                            <label htmlFor="fully_paid_on">Fully Paid On</label>
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
