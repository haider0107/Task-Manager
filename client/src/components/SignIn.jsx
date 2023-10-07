import React from "react";
import todoGif from "../assets/todo.gif";
import { AiOutlineGooglePlus } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

function SignIn() {
  const form = useForm();

  const { register, control, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = (data) => {
    console.log("Form Data", data);
  };

  return (
    <section className=" bg-gray-50 min-h-screen flex items-center justify-center">
      <div className=" bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
        {/* Left Side */}
        <div className="md:w-1/2 px-10">
          <h1 className="font-bold text-2xl text-[#184191]">SignIn</h1>
          <p className=" text-sm mt-4">
            If you are already member, please Login
          </p>

          {/* Form starts */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            action="#"
            className="flex flex-col gap-4"
          >
            <input
              className="p-2 mt-8 rounded-xl border"
              type="email"
              id="email"
              placeholder="Email"
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Invalid email format",
                },
              })}
            />
            <span className=" text-sm text-red-500">{errors.email?.message}</span>
            <div className="relative">
              <input
                className=" p-2 rounded-xl border w-full"
                type="password"
                id="password"
                placeholder="Password"
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                })}
              />
            </div>
            <span className=" text-sm text-red-500">{errors.password?.message}</span>
            <button
              className=" bg-[#184191] text-white rounded-xl py-2 hover:scale-105 duration-300"
              type="submit"
            >
              Sign In
            </button>
          </form>
          <DevTool control={control} />
          {/* Form ends */}

          {/* SSO starts */}
          <div className="mt-10 grid grid-cols-3 items-center text-gray-500">
            <hr className=" border-gray-500" />
            <p className=" text-center text-sm">OR</p>
            <hr className=" border-gray-500" />
          </div>
          <button className=" bg-white border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300">
            <AiOutlineGooglePlus className="inline mr-3 text-4xl" /> Login with
            google
          </button>
          {/* SSO ends */}

          <p className=" mt-5 text-sm border-b border-gray-400 py-4">
            Forget password ?{" "}
          </p>

          {/* Registration Link */}
          <div className=" mt-3 text-sm flex justify-center items-center">
            <p className="px-1">Don't have an account ? </p>
            <button className=" py-2 px-5 bg-white border rounded-xl hover:scale-105 duration-300">
              Registration
            </button>
          </div>
          {/* Registration ends */}
        </div>
        {/* Right Side */}
        <div className="md:block hidden w-1/2">
          <img className=" rounded-2xl" src={todoGif} alt="gif" />
        </div>
      </div>
    </section>
  );
}

export default SignIn;
