import RegisterForm from "../../components/form/auth/register.form";
import { Link } from "react-router";
import NavBar from "../../components/header";

const RegisterPage = () => {
  return (
    <main className="site-shell">
      <NavBar />
      <div className="form-page">
        <div className="form-page-art">
          <span className="eyebrow">A little more personal</span>
          <h1>Find the things that feel like you.</h1>
          <p>Create an account to keep your favorites, follow orders, and make checkout a little easier.</p>
        </div>
        <section className="form-panel">
          <h2>Make yourself at home</h2>
          <p>A few details and you&apos;re all set.</p>
          <RegisterForm />
          <p className="form-footnote">Already have an account? <Link to="/login">Sign in</Link></p>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
