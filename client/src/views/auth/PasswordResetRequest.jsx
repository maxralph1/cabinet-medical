import { useContext, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Layout from '@/components/auth/Layout.jsx'; 
import Logo from '@/assets/images/logo.jpg'; 


export default function PasswordResetRequest() {
    const [email, setEmail] = useState(''); 

    let { resetPasswordRequest } = useContext(AuthContext); 

    const handleSubmit = async e => {
        e.preventDefault(); 

        resetPasswordRequest(email); 
    };

    return (
        <Layout>
            <section className="auth-form col-sm-12 col-md-6 d-flex flex-column justify-content-center py-2 gap-3">
                <div className="d-flex flex-column align-items-center gap-3">
                    <span className="" style={{ width: '100px', height: '100px' }}>
                        <img src={ Logo } alt="Logo" className="h-100 w-100 object-fit-cover border-radius-15" />
                    </span>
                    <h2>Password Reset</h2>
                </div>
                <form onSubmit={ handleSubmit } id="auth-form" className="auth-form">
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-12">
                            <input 
                                type="email" 
                                id="email" 
                                className="form-control" 
                                onChange={ e => setEmail(e.target.value) } 
                                placeholder="Pfizer" />
                            <label htmlFor="email">Email</label>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end pt-3">
                        <button type="submit" className="btn btn-outline-secondary border-radius-25">Sign In</button>
                    </div>
                </form>

                <section className="auth-options px-1 pt-3 gap-3 d-flex flex-column align-items-sm-start align-items-md-center gap-3"> 
                    <span className="">Remember your password?&nbsp;<Link to={ route('sign-in')} className="text-dark fw-bold">Sign in</Link></span> 
                    <span className=""><Link to={ route('sign-up') } className="text-dark fw-bold">Sign Up</Link>&nbsp;if you do not already have an account</span> 
                </section>
            </section>
        </Layout>
    )
} 