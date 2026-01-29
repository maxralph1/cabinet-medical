import { useParams } from 'react-router-dom'; 
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime"; 
import utc from 'dayjs/plugin/utc';
dayjs.extend(relativeTime);
dayjs.extend(utc); 
import { useDiagnosis } from '@/hooks/useDiagnosis.jsx'; 
import Layout from '@/components/protected/Layout.jsx';


export default function Show() {
    const { id } = useParams(); 

    const { diagnosis } = useDiagnosis(id); 
    console.log('diagnosis:', diagnosis?.data);
    return (
        <Layout>
            <h2 className="fs-4 border-bottom pb-1 mb-3">Patient Examination</h2>
            <div className="d-flex justify-content-end pb-3">
                <svg 
                    onClick={() => window.print()}
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-printer-fill" viewBox="0 0 16 16">
                    <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1"/>
                    <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                </svg>
            </div>
            <p>Patient:&nbsp;
                <span className="fw-semibold">
                    { diagnosis?.data?.patient ? ((diagnosis?.data?.patient?.first_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.data?.patient?.first_name)?.slice(1)) + ' ' + ((diagnosis?.data?.patient?.last_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.data?.patient?.last_name)?.slice(1)) : 'N/A' }
                </span>
            </p>
            <p>Authorizing Professional:&nbsp;
                <span className="fw-semibold">
                    { diagnosis?.data?.authorizing_professional ? ((diagnosis?.data?.authorizing_professional?.first_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.data?.authorizing_professional?.first_name)?.slice(1)) + ' ' + ((diagnosis?.data?.authorizing_professional?.last_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.data?.authorizing_professional?.last_name)?.slice(1)) : 'N/A' }
                </span>
            </p>
            <p>Examiner:&nbsp;
                <span className="fw-semibold">
                    { diagnosis?.data?.examiner ? ((diagnosis?.data?.examiner?.first_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.data?.examiner?.first_name)?.slice(1)) + ' ' + ((diagnosis?.data?.examiner?.last_name)?.slice(0,1)?.toUpperCase()+(diagnosis?.data?.examiner?.last_name)?.slice(1)) : 'N/A' }
                </span>
            </p>

            { (diagnosis?.data?.diagnosis_segments?.length > 0) && (
                <section className="diagnosis-segments pt-2">
                    <h3 className="border-bottom fs-6">Tests</h3>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">#</th>
                                <th scope="col">Type</th>
                                <th scope="col">Result</th>
                                </tr>
                            </thead>
                            <tbody className="table-group-divider">
                                { diagnosis?.data?.diagnosis_segments?.map((segment, index) => {
                                    return (
                                        <tr key={ segment?._id } className="diagnosis-segment">
                                            <th scope="row">{ index+1}</th>
                                            <td>{ segment?.diagnosis_type?.title }</td>
                                            <td>{ segment?.result ? segment?.result : 'N/A' }</td>
                                        </tr>
                                    )
                                }) }
                            </tbody>
                        </table>
                    </div>
                </section>
            ) }

            <section className="notes pt-3">
                <h3 className="border-bottom fs-6 fst-italic">Notes by Authorizing Professional</h3>
                <p>{ diagnosis?.data?.notes ? diagnosis?.data?.notes : 'N/A' }</p>
            </section>

            <section className="comments pt-3">
                <h3 className="border-bottom fs-6 fst-italic">Comments by Examiner(Lab. Scientist):</h3>
                <p>{ diagnosis?.data?.comments ? diagnosis?.data?.comments : 'N/A' }</p>
            </section>
        </Layout>
    )
}
