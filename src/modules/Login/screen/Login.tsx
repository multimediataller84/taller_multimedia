import { useForm } from "react-hook-form";
import { TLogin } from "../models/types/TLogin";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLogin>();

  const { requestUser, user, loading, error } = useLogin();

  useEffect(() => {
    if (user) {
      navigate("/product", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data: TLogin) => {
    await requestUser(data);
  };

  return (
    <div className="flex flex-col absolute justify-center items-center size-full bg-backgroundBlue">
      <div className="size-full justify-center items-center flex flex-col">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-Lato">Iniciar Sesión</h1>
          <h2 className="text-base font-lato font-medium text-[#1C1C1C]">Bienvenido a su sistema de <br /> facturación</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-col flex mt-8 h-auto">

            {errors.username && (
              <p className="text-red-500 text-sm font-Lato">{errors.username.message}</p>
            )}
            <input
              type="username"
              placeholder="Username"
              {...register("username", {
                required: "username is required",
              })}
              className={`border w-[284px] h-[48px] rounded-3xl px-4 border-gray2 bg-white placeholder:text-gray1 mb-6
                ${errors.username ? "border-red-500" : "border-gray-300"} text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 mb-1`}
            />

            
          {errors.password && (
            <p className="text-red-500 text-sm font-Lato">{errors.password.message}</p>
          )}
          <input
            type="password"
            placeholder="Contraseña"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className={`border w-[284px] h-[48px] rounded-3xl px-4 border-gray2 bg-white placeholder:text-gray1 mb-8
              ${errors.password ? "border-red-500" : "border-gray-300"
            } text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 mb-1`}
          />
          
          

        {loading ? (
          <div className="w-full  flex justify-center py-2">
            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin bg-blue-500"></div>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full h-[48px]  hover:bg-blue-500 bg-black  text-white font-semibold py-2 rounded-3xl transition duration-200"
          >
            Login
          </button>
        )}



        {error && <p className="text-red-500 text-sm font-lato text-center mt-4">{error}</p>}
        
        </form>
      </div>



 
    </div>
  );
}


/*
        <div className="flex justify-center mt-4 text-sm">
          <span className="text-gray-500">Don’t have an account? </span>
          <button
            type="button"
            onClick={() => navigate("/register", { replace: true })}
            className="ml-1 text-blue-600 hover:underline font-medium"
          >
            Sign up
          </button>
        </div>



             <form
        onSubmit={handleSubmit(onSubmit)}
        className=""
      >
        <label className="w-16 h-[48px]">
          Your username
        </label>
        <input
          type="username"
          placeholder="example@mail.com"
          {...register("username", {
            required: "username is required",
          })}
          className={`w-full border ${
            errors.username ? "border-red-500" : "border-gray-300"
          } rounded-xl py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 mb-1`}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mb-3">{errors.username.message}</p>
        )}


        <label className="">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className={`w-full border ${
            errors.password ? "border-red-500" : "border-gray-300"
          } rounded-xl py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 mb-1`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-3">{errors.password.message}</p>
        )}

        {loading ? (
          <div className="w-full flex justify-center py-2">
            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin bg-red-500"></div>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-red-700 text-white font-semibold py-2 rounded-xl transition duration-200"
          >
            Login
          </button>
        )}



        {error && <p className="text-red-500 text-sm mt-3">Error: {error}</p>}
      </form>
*/