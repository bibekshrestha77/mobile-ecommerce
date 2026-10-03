import LoginForm from "../../components/form/auth/login.form"
import { Link } from "react-router"
import NavBar from "../../components/header"


const LoginPage = () => {
    return (
        <main className="site-shell">
            <NavBar />
            <div className="form-page">
                <div className="form-page-art">
                    <span className="eyebrow">Your PhoneVault account</span>
                    <h1>Good to see you again.</h1>
                    <p>Your premium devices, saved finds, and order updates are right where you left them.</p>
                </div>
                <section className="form-panel">
                    <h2>Welcome back</h2>
                    <p>Sign in to pick up right where you left off.</p>
                    <LoginForm />
                    <p className="form-footnote">New around here? <Link to="/register">Create an account</Link></p>
                </section>
            </div>
        </main>
    )
}

export default LoginPage