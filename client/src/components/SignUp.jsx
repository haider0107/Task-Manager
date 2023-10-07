import React, { useEffect, useState } from "react";
import todoGif from "../assets/todo.gif";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

/*
  name
  email
  password
  confirmpassword
  age
  phone
  address
*/

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

const schema = yup.object({
  fname: yup
    .string()
    .required("Full name is required")
    .min(2, "Full name must contain 2 or more characters"),
  email: yup
    .string()
    .email("Email format is not valid")
    .required("Email is required"),
  age: yup
    .number()
    .required("Age is required")
    .typeError("Age must be a number")
    .integer()
    .min(13, "Age should be more than 13"),
  address: yup
    .string()
    .required("Address is required")
    .min(4, "Address must contain 2 or more characters"),
  phone: yup.string().required(),
  password: yup
    .string()
    .required("Password is required")
    .matches(passwordRules, { message: "Please create a stronger password" }),
  confirmPassword: yup
    .string().required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match")
    ,
});

const SignUp = () => {
  const form = useForm({
    defaultValues: {
      fname: "",
      email: "",
      age: null,
      address: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schema),
  });

  const { register, control, handleSubmit, formState, reset } = form;
  const { errors, isSubmitSuccessful } = formState;

  const onSubmit = (data) => {
    console.log("Form Data", data);
  };

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]);

  return (
    <section className=" bg-gray-50 min-h-screen flex items-center justify-center">
      <div className=" bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
        {/* Left Side */}
        <div className="md:w-1/2 px-10">
          <h1 className="font-bold text-2xl text-[#184191]">SignUp</h1>
          {/* <p className=" text-sm mt-4">Register yourself here</p> */}

          {/* Form starts */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            action="#"
            className="mt-4 flex flex-col gap-2"
          >
            <div>
              {/* Full Name */}
              <div className="relative">
                <input
                  type="text"
                  id="fname"
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-gray-100 rounded-lg border border-slate-600 appearance-none focus:outline-none focus:ring-0  peer"
                  placeholder=" "
                  {...register("fname")}
                />
                <label
                  for="fname"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Full Name
                </label>
              </div>
              <span className=" text-sm text-red-500">
                {errors.fname?.message}
              </span>
            </div>
            <div>
              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-gray-100 rounded-lg border border-slate-600 appearance-none focus:outline-none focus:ring-0  peer"
                  placeholder=" "
                  {...register("email")}
                />
                <label
                  for="email"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Email
                </label>
              </div>
              <span className=" text-sm text-red-500">
                {errors.email?.message}
              </span>
            </div>
            <div>
              {/* Age */}
              <div className="relative">
                <input
                  type="number"
                  id="age"
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-gray-100 rounded-lg border border-slate-600 appearance-none focus:outline-none focus:ring-0  peer"
                  placeholder=" "
                  {...register("age")}
                />
                <label
                  for="age"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Age
                </label>
              </div>
              <span className=" text-sm text-red-500">
                {errors.age?.message}
              </span>
            </div>
            <div>
              {/* Address */}
              <div className="relative">
                <input
                  type="text"
                  id="address"
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-gray-100 rounded-lg border border-slate-600 appearance-none focus:outline-none focus:ring-0  peer"
                  placeholder=" "
                  {...register("address")}
                />
                <label
                  for="address"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Address
                </label>
              </div>
              <span className=" text-sm text-red-500">
                {errors.address?.message}
              </span>
            </div>
            <div>
              {/* Phone */}
              <div className="relative">
                <input
                  type="text"
                  id="phone"
                  className="block px-2.5 pb-2.5 pt-4 w-full text-sm bg-gray-100 rounded-lg border border-slate-600 appearance-none focus:outline-none focus:ring-0  peer"
                  placeholder=" "
                  {...register("phone")}
                />
                <label
                  for="phone"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Phone
                </label>
              </div>
              <span className=" text-sm text-red-500">
                {errors.phone?.message}
              </span>
            </div>
            <div>
              {/* Password */}
              <div className="relative mt-2 border bg-gray-100 border-gray-600 p-3 rounded-lg">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="password"
                  className="peer placeholder-transparent bg-gray-100 focus:outline-none "
                  {...register("password")}
                />
                <label
                  for="password"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Password
                </label>
                <label
                  onClick={() => setShowPassword(!showPassword)}
                  className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer "
                  for="toggle"
                >
                  {showPassword ? "hide" : "show"}
                </label>
              </div>
              <span className=" text-sm text-red-500">
                {errors.password?.message}
              </span>
            </div>

            <div>
              {/* Confirm Password */}
              <div className="relative mt-2 border bg-gray-100 border-gray-600 p-3 rounded-lg">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="password"
                  className="peer placeholder-transparent bg-gray-100 focus:outline-none "
                  {...register("confirmPassword")}
                />
                <label
                  for="confirmPassword"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Confirm Password
                </label>
                <label
                  onClick={() => setShowPassword(!showPassword)}
                  className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer "
                  for="toggle"
                >
                  {showPassword ? "hide" : "show"}
                </label>
              </div>
              <span className=" text-sm text-red-500">
                {errors.confirmPassword?.message}
              </span>
            </div>

            <button
              // disabled={!isDirty }
              className=" bg-[#184191] text-white rounded-xl py-2 hover:scale-105 duration-300"
              type="submit"
            >
              SignUp
            </button>
          </form>
          <DevTool control={control} />

          {/* Form ends */}

          {/* Login Link */}
          <div className=" mt-3 text-sm flex justify-center items-center">
            <p className="px-1">Already have an account ? </p>
            <button className=" py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300">
              SignIn
            </button>
          </div>
          {/* Login ends */}
        </div>
        {/* Right Side */}
        <div className="md:block hidden w-1/2">
          <img className=" rounded-2xl" src={todoGif} alt="gif" />
        </div>
      </div>
    </section>
  );
};

export default SignUp;
