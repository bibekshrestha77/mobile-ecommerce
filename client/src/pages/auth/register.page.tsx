import RegisterForm from "../../components/form/auth/register.form";

const RegisterPage = () => {
  return (
    <main className="min-h-screen w-full flex justify-center items-center tracking-wider">
      <div className="min-h-80 w-100 border border-blue-500 rounded-md shadow p-4">
        <h1 className="text-center text-3xl font-bold text-gray-800">
          Register
        </h1>
        <p className="text-center text-[13px] font-semibold mt-1 text-gray-600">
          Create your account below.
        </p>

        <RegisterForm />
      </div>
    </main>
  );
};

export default RegisterPage;
