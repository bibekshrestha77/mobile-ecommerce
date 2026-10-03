import { useForm } from "react-hook-form";
import { CiMail } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import Input from "../../ui/input/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../../schema/auth.schema";
import Button from "../../ui/button/button";
import { login } from "../../../api/auth.api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const LoginForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(loginSchema),
    mode: "all",
  });

  const { mutate } = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      // console.log("mutation failed", response);

      toast.success(response.message || "Login Success!");
      //reset form
      reset();
      //navigate to home page
      navigate("/");
    },
    onError: (error) => {
      // console.log("mutation failed", error);
      toast.error(error?.message || "Something went wrong");
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    mutate(data);
  };

  return (
    <div className="w-full h-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-2  flex flex-col gap-5"
      >
        {/* email input */}
        <Input
          label="Email"
          register={register}
          name="email"
          type="text"
          id="email"
          placeholder="johndoe@gmail.com"
          error={errors.email?.message}
          icon={<CiMail size={22} className=" mb-0.5 mr-1 text-blue-700" />}
        />
        <Input
          label="Password"
          id="password"
          name="password"
          register={register}
          type="password"
          placeholder="Enter password"
          error={errors.password?.message}
          icon={<CiLock size={22} className=" mb-0.5 mr-1 text-blue-700" />}
          autoComplete="current-password"
        />

        <div className="mt-4">
          <Button label="Login" type="submit" />
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
