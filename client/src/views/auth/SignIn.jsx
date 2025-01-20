import { useContext, useState } from 'react'; 
import AuthContext from '@/context/AuthContext.jsx'; 
import { Link } from 'react-router-dom'; 
import { route } from '@/routes'; 
import Layout from '@/components/auth/Layout.jsx'; 


export default function SignIn() {
    const [emailUsername, setEmailUsername] = useState(''); 
    const [password, setPassword] = useState(''); 

    let { authSuccess, signIn } = useContext(AuthContext); 

    const handleSubmit = async e => {
        e.preventDefault(); 

        signIn(emailUsername, password);
    }

    return (
        <Layout>
            <div className="toast align-items-center text-bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body">
                    Hello, world! This is a toast message.
                    </div>
                    <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
            <section className="auth-form col-sm-12 col-md-6 d-flex flex-column justify-content-center py-2 gap-3">
                <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <img src="..." className="rounded me-2" alt="..." />
                        <strong className="me-auto">Bootstrap</strong>
                        <small>11 mins ago</small>
                        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div className="toast-body">
                        Hello, world! This is a toast message.
                    </div>
                </div>
                <div className="d-flex flex-column align-items-center gap-3">
                    <span>Logo</span>
                    <h2>Sign In</h2>
                </div>
                <form onSubmit={ handleSubmit } id="auth-form" className="auth-form">
                    <div className="row">
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="text" 
                                id="username" 
                                className="form-control" 
                                onChange={ e => setEmailUsername(e.target.value) } 
                                placeholder="maxralph" />
                            <label htmlFor="username">Email/Username</label>
                        </div>
                        <div className="form-floating mb-3 col-sm-12 col-md-6">
                            <input 
                                type="password" 
                                id="password" 
                                className="form-control" 
                                onChange={ e => setPassword(e.target.value) } 
                                placeholder="Pfizer" />
                            <label htmlFor="password">Password</label>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end pt-3">
                        <button type="submit" className="btn btn-outline-secondary border-radius-25">Sign In</button>
                    </div>
                </form>

                <section className="auth-options px-5 pt-3 gap-3 d-flex flex-column align-items-center gap-3">
                    <span className=""><Link to={ route('passwordless-signin-request')} className="text-dark fw-bold">Sign in without password instead</Link></span> 
                    <span className=""><Link to={ route('sign-up') } className="text-dark fw-bold">Sign Up</Link>&nbsp;if you don't have an account</span> 
                    <span className="">Forgot your password?<Link to={ route('password-reset-request') } className="text-dark fw-bold">&nbsp;Reset Password</Link></span> 
                </section>
            </section>
        </Layout>
    )
}
