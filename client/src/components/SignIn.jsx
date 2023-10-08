import React, { useEffect, useState } from "react";
import todoGif from "../assets/todo.gif";
import { AiOutlineGooglePlus } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object({
  email: yup
    .string()
    .email("Email format is not valid")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

function SignIn() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    async function authCheck() {
      try {
        let res = await axios.get("/api/user/auth", {
          headers: {
            "auth-token": JSON.parse(localStorage.getItem("token")),
          },
        });
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
        localStorage.removeItem("token");
      }
    }
    authCheck();
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [s, setS] = useState(false);
  const navigate = useNavigate();

  const { register, control, handleSubmit, formState, setError } = form;
  const { errors } = formState;

  const onSubmit = async (data) => {
    try {
      let res = await axios.post("/api/user/login", data);

      setS(true);
      setTimeout(() => {
        localStorage.setItem("token", JSON.stringify(res.data.token));
        navigate("/dashboard");
      }, [3000]);
    } catch (error) {
      if (error.response) {
        const serverErrorData = error.response.data;
        console.log(serverErrorData);

        // Update the form's error state with server errors
        setError("serverError", {
          type: "server",
          message: serverErrorData.error, // Customize the message based on the server response
        });
      } else {
        console.error("Error submitting form:", error);
      }
    }
  };

  return (
    <section className=" bg-gray-50 min-h-screen flex items-center justify-center">
      <div className=" bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
        {/* Left Side */}
        <div className="md:w-1/2 px-10">
          <h1 className="font-bold text-2xl text-[#184191]">SignIn</h1>
          {s ? (
            <p className="text-sm mt-4 p-1 bg-[#184191] text-white rounded-lg text-center">
              SignIn Successfully !!!
            </p>
          ) : (
            ""
          )}
          {errors.serverError && (
            <p className=" text-sm mt-4 p-1 bg-red-600 text-white rounded-lg text-center">
              {errors.serverError.message}
            </p>
          )}

          {/* Form starts */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            action="#"
            className="mt-4 flex flex-col gap-4"
          >
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
                  htmlFor="email"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Email
                </label>
              </div>
              <span className=" text-[10px] text-red-500">
                {errors.email?.message}
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
                  htmlFor="password"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-100 px-2 peer-focus:px-2 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Password
                </label>
                <label
                  onClick={() => setShowPassword(!showPassword)}
                  className="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer "
                  htmlFor="toggle"
                >
                  {showPassword ? "hide" : "show"}
                </label>
              </div>
              <span className=" text-[10px] text-red-500">
                {errors.password?.message}
              </span>
            </div>
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

          <p className=" mt-5 text-sm border-b border-gray-400 py-4 hover:cursor-pointer">
            Forget password ?{" "}
          </p>

          {/* Registration Link */}
          <div className=" mt-3 text-sm flex justify-center items-center">
            <p className="px-1">Don't have an account ? </p>
            <button
              onClick={() => {
                navigate("/registration");
              }}
              className=" py-2 px-5 bg-white border rounded-xl hover:scale-105 duration-300"
            >
              SignUp
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
