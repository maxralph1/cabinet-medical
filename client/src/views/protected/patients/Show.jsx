import { /**useContext,**/ useState } from 'react'; 
// import AuthContext from '@/context/AuthContext.jsx'; 
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useUser } from '@/hooks/useUser.jsx'; 
import { usePatientChart } from '@/hooks/usePatientChart.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 
import UserProfileComponent from '@/components/protected/nested-components/UserProfileComponent';


export default function Show() {
    const { username } = useParams();
    // const { user } = useContext(AuthContext); 
    // console.log(user)
    console.log(username)
    const { retrievedUser, getUser } = useUser(username); 
    console.log(retrievedUser)

    const { patientChart, createPatientChart } = usePatientChart();

    const [toggleChartForm, setToggleChartForm] = useState(false); 

    const handleChartSubmit = async e => {
        e.preventDefault(); 

        const formData = new FormData(); 
        patientChart?.data?.notes && formData.append('notes', patientChart?.data?.notes); 
        patientChart?.data?.comments && formData.append('comments', patientChart?.data?.comments); 
        formData.append('patient', retrievedUser?.data?._id); 

        await createPatientChart(formData); 
        await patientChart?.setData({}); 
        await getUser(username); 
    }

    const handleChartUpdate = async e => {
        e.preventDefault(); 

        const formData = new FormData(); 
        
    }

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">Patient</h2>
            </div>

            <UserProfileComponent 
                retrievedUser={ retrievedUser } />

            <section className="medical-chart pt-5">
                <h3 className="fs-5 mb-3 border-bottom pb-1">Medical Chart</h3>

                <div className="d-flex justify-content-end pt-2">
                    <span 
                        onClick={ () => setToggleChartForm(!toggleChartForm) }
                        className="btn btn-sm btn-outline-secondary border-radius-15 py-0">
                        <span>
                            {toggleChartForm ? 'Close ' : 'Open '}   
                        </span>Chart Form
                    </span>
                </div>

                { toggleChartForm && (
                    <section className="pt-3">
                        <form onSubmit={ handleChartSubmit }>
                            <div className="row">
                                <div className="form-floating mb-3 col-12">
                                    <textarea 
                                        id="notes"
                                        className="form-control" 
                                        style={{ height: '100px' }}  
                                        value={ patientChart?.data?.notes ?? '' } 
                                        onChange={ e => patientChart.setData({
                                            ...patientChart?.data,
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
                                        value={ patientChart?.data?.comments ?? '' } 
                                        onChange={ e => patientChart.setData({
                                            ...patientChart?.data,
                                            comments: e.target.value,
                                        }) } 
                                        placeholder="This is for the medication." 
                                        required></textarea>
                                    <label htmlFor="comments">Comments</label>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end pt-3">
                                <button type="submit" className="btn btn-outline-secondary border-radius-25">Add</button>
                            </div>
                        </form>
                    </section>
                ) }

                <section>
                    { ((retrievedUser?.data?.charts?.length > 0) 
                        ? retrievedUser?.data?.charts
                                        ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                        ?.map(chart => {
                        return (
                            <article key={ chart?._id }>
                                <div className="border-bottom pt-3">
                                    <div>
                                        <h4 className="mb-0" style={{ fontSize: 'small' }}>Notes:</h4>
                                        <p className="mb-0">{ chart?.notes }</p>
                                    </div>
                                    <div className="pt-3">
                                        <h4 className="mb-0" style={{ fontSize: 'small' }}>Comments:</h4>
                                        <p className="mb-0">{ chart?.comments }</p>
                                    </div>
                                    <p className="text-secondary" style={{ fontSize: 'small'}}>
                                        <small>
                                            { dayjs(chart?.created_at)?.format('MMMM D, YYYY, HH:mm') }&nbsp;-&nbsp;
                                            <span className="fst-italic">
                                                { ((chart?.professional?.first_name)?.slice(0,1)?.toUpperCase() + (chart?.professional?.first_name)?.slice(1)) 
                                                    + ' ' 
                                                    + ((chart?.professional?.last_name)?.slice(0,1)?.toUpperCase() + (chart?.professional?.last_name)?.slice(1)) }
                                            </span>
                                        </small>
                                    </p>
                                </div>
                            </article>
                        )
                    }) : (
                        <div className="py-5 text-center">Patient has no charts yet.</div>
                    )) }

                </section>
            </section>
        </Layout>
    )
}
