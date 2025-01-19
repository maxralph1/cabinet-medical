import { useContext, useState } from 'react'; 
import { useParams } from 'react-router-dom'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import swal from 'sweetalert2'; 
import Layout from '@/components/auth/Layout.jsx'; 


export default function PasswordReset() {
    const params = useParams();
    const username = params.username;
    const token = params.token; 

    const [password, setPassword] = useState(''); 
    const [passwordRepeat, setPasswordRepeat] = useState(''); 

    const { resetPassword } = useContext(AuthContext); 

    const handleSubmit = async e => {
        e.preventDefault(); 

        if (password != passwordRepeat) {
        swal.fire({
            text: 'Passwords do not match', 
            color: "#900000",
            width: 300,
            position: 'top',
            showConfirmButton: false,
        }); 
        } else if (password == passwordRepeat) { 
        resetPassword(username, token, password)
        }
    }

    return (
        <Layout>
            <section className="auth-form col-sm-12 col-md-6 d-flex flex-column justify-content-center py-2 gap-3">
                <div className="d-flex flex-column align-items-center gap-3">
                    <span>Logo</span>
                    <h2>Password Reset</h2>
                </div>
                <form onSubmit={ handleSubmit } id="auth-form" className="auth-form">
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="password" 
                                id="password" 
                                className="form-control" 
                                onChange={ e => setPassword(e.target.value) } 
                                placeholder="************" />
                            <label htmlFor="password">Password</label>
                        </div>
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="password" 
                                id="repeat_password" 
                                className="form-control" 
                                onChange={ e => setPasswordRepeat(e.target.value) } 
                                placeholder="**********" />
                            <label htmlFor="repeat_password">Repeat Password</label>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end pt-3">
                        <button type="submit" className="btn btn-outline-secondary border-radius-25">Sign Up</button>
                    </div>
                </form>

                <section className="auth-options px-5 pt-3 gap-3 d-flex flex-column align-items-center gap-3"> 
                    <span className="">Remember your password?&nbsp;<Link to={ route('sign-in')} className="text-dark fw-bold">Sign in</Link></span> 
                    <span className=""><Link to={ route('sign-up') } className="text-dark fw-bold">Sign Up</Link>&nbsp;if you do not already have an account</span> 
                </section>
            </section>
        </Layout>
    )
} 