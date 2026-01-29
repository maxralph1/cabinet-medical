// import { /**useContext,**/ useState } from 'react'; 
// import AuthContext from '@/context/AuthContext.jsx'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useUser } from '@/hooks/useUser.jsx'; 
// import { usePatientChart } from '@/hooks/usePatientChart.jsx'; 
import Layout from '@/components/protected/Layout.jsx'; 
import UserProfileComponent from '@/components/protected/nested-components/UserProfileComponent';


export default function Show() {
    const { username } = useParams();
    // const { user } = useContext(AuthContext); 
    // console.log(user)
    console.log(username)
    const { retrievedUser, getUser, updateUser } = useUser(username); 
    console.log(retrievedUser)

    // const handleChartUpdate = async e => {
    //     e.preventDefault(); 

    //     const formData = new FormData(); 
        
    // }

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="fs-3">Professional</h2>
            </div>

            <UserProfileComponent 
                retrievedUser={ retrievedUser } />

            <section className="medical-chart pt-5">
                <h3 className="fs-5 mb-3 border-bottom pb-1">Medical Chart</h3>

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
                                            { dayjs(chart?.created_at)?.format('MMMM D, YYYY, HH:mm') }&nbsp;-&nbsp;for&nbsp;
                                            <span className="fst-italic">
                                                <Link to={ route('home.patients.show', { username: chart?.patient?.username })}>
                                                    { ((chart?.patient?.first_name)?.slice(0,1)?.toUpperCase() + (chart?.patient?.first_name)?.slice(1)) 
                                                        + ' ' 
                                                        + ((chart?.patient?.last_name)?.slice(0,1)?.toUpperCase() + (chart?.patient?.last_name)?.slice(1)) }
                                                </Link>
                                            </span>
                                        </small>
                                    </p>
                                </div>
                            </article>
                        )
                    }) : (
                        <div className="py-5 text-center">Professional has added has no patient charts yet.</div>
                    )) }

                </section>
            </section>
        </Layout>
    )
}
