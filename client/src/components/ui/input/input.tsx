/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { type FC } from "react";
import { LuAsterisk } from "react-icons/lu";

type IProps = {
  register: any;
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  type?: "text" | "number" | "password" | "email";
  icon?: React.ReactNode;
  error?: string;
  required?: boolean;
  autoComplete?: string;
};

const Input: FC<IProps> = ({
  id,
  register,
  name,
  placeholder = "Start typing..",
  type = "text",
  label,
  icon,
  error,
  autoComplete,
}) => {
  return (
    <div className="flex flex-col ">
      <div className="flex items-center mb-1">
        {icon && icon}
        <label
          htmlFor={id}
          className="text-[16px] font-semibold text-gray-700 "
        >
          {label}
        </label>
        <LuAsterisk className="mb-3 text-red-500" />
      </div>
      <input
        placeholder={placeholder}
        type={type}
        id={id}
        autoComplete={autoComplete}
        {...register(name)}
        className={`border  rounded-md py-2.5 px-2  focus:outline ${
          error
            ? "focus:outline-red-500 border-red-500"
            : "focus:outline-blue-500 border-gray-300"
        }  bg-[#f8f8f8]`}
      />
      <p className="text-sm text-red-500 h-1">{error ? error : ""}</p>
    </div>
  );
};

export default Input;