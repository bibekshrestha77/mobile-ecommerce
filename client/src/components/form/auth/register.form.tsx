import { useForm } from "react-hook-form";
import { CiMail, CiLock, CiUser } from "react-icons/ci";
import Input from "../../ui/input/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../../schema/auth.schema";
import Button from "../../ui/button/button";
import { registerUser } from "../../../api/auth.api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

type RegisterFormData = {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  profile_image?: FileList;
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      profile_image: undefined,
    },
    resolver: yupResolver(registerSchema) as any,
    mode: "all",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      toast.success(response.message || "Registration successful!");
      reset();
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, profile_image, ...submitData } = data;
    // Split fullname into first_name and last_name
    const nameParts = submitData.fullname.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ") || "";
    mutate({
      first_name,
      last_name,
      email: submitData.email,
      password: submitData.password,
      profile_image: profile_image?.[0],
    });
  };

  return (
    <div className="w-full h-full">
      <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-5">
        {/* full name */}
        <Input
          label="Full Name"
          register={register}
          name="fullname"
          type="text"
          id="fullname"
          placeholder="John Doe"
          error={errors.fullname?.message}
          icon={<CiUser size={22} className="mb-0.5 mr-1 text-blue-700" />}
        />

        {/* email */}
        <Input
          label="Email"
          register={register}
          name="email"
          type="email"
          id="email"
          placeholder="johndoe@gmail.com"
          error={errors.email?.message}
          icon={<CiMail size={22} className="mb-0.5 mr-1 text-blue-700" />}
        />

        {/* password */}
        <Input
          label="Password"
          register={register}
          name="password"
          type="password"
          id="password"
          placeholder="Enter password"
          error={errors.password?.message}
          icon={<CiLock size={22} className="mb-0.5 mr-1 text-blue-700" />}
          autoComplete="new-password"
        />

        {/* confirm password */}
        <Input
          label="Confirm Password"
          register={register}
          name="confirmPassword"
          type="password"
          id="confirmPassword"
          placeholder="Re-enter password"
          error={errors.confirmPassword?.message}
          icon={<CiLock size={22} className="mb-0.5 mr-1 text-blue-700" />}
          autoComplete="new-password"
        />

        {/* profile image */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <CiUser size={22} className="mb-0.5 mr-1 text-blue-700" />
            <label
              htmlFor="profile_image"
              className="text-[16px] font-semibold text-gray-700"
            >
              Profile Image (Optional)
            </label>
          </div>
          <input
            type="file"
            id="profile_image"
            accept="image/*"
            {...register("profile_image")}
            className="border border-gray-300 rounded-md py-2.5 px-2 focus:outline focus:outline-blue-500 bg-[#f8f8f8]"
          />
          {errors.profile_image && (
            <p className="text-sm text-red-500">{errors.profile_image.message}</p>
          )}
        </div>

        <div className="mt-4">
          <Button label={isPending ? "Registering..." : "Register"} type="submit" disabled={isPending} />
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;