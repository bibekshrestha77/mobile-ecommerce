import LoginForm from "../../components/form/auth/login.form"
import {Link} from "react-router"


const LoginPage = () => {
    return (
        <main className="min-h-screen w-full flex justify-center items-center tracking-wider">
            <div className="min-h-80 w-100 border border-blue-500  rounded-md shadow p-4 ">
                <h1 className="text-center text-3xl font-bold text-gray-800">Login</h1>
                <p className="text-center text-[13px] font-semibold mt-1 text-gray-600">Fill the fill below.</p>

                {/* login form */}
                <LoginForm/>
                <p className="text-sm mt-1 text-center">Don&apos;t have an account {""} <Link to={"/register"}> <span className="text-blue-500">Sign Up</span></Link> </p>
            </div>
        </main>
    )
}

export default LoginPage