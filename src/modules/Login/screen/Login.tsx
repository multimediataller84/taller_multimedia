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

  const { requestUser, user, loading, error, clearError } = useLogin();

  useEffect(() => {
    if (user) {
      navigate("/product", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data: TLogin) => {
    await requestUser(data);
  };

  return (
    <div className="flex flex-col absolute justify-center items-center size-full bg-white">
      <div className="size-full justify-center items-center flex flex-col">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-Lato">Iniciar Sesión</h1>
          <div className="flex flex-col space-y-2">
            <h2 className="text-base font-lato font-medium text-[#1C1C1C]">Bienvenido a su sistema de </h2>
          <h3 className="text-base font-lato font-medium text-[#1C1C1C">facturación</h3>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex-col flex mt-8 h-auto space-y-3">
          
          <div className="relative w-[284px] flex">
          <input
            type="text"
            id="username"
            placeholder=" "
            {...register("username", {
              required: "Username is required",
              onChange: () => clearError(),
            })}
            className={`peer border w-full h-[48px] rounded-3xl px-4 bg-white 
              ${
                errors.username || error
                  ? "border-red-500 outline-red-500"
                  : "border-gray2 outline-none"
              }`}
          />
          <label
            htmlFor="username"
            className={`absolute flex -translate-y-1/2 px-1 left-4 top-0 bg-white transition-colors
              ${
                errors.username || error
                  ? "text-red-500"
                  : "peer-focus:text-blue-500 text-gray1"
              }`}
          >
            Username
          </label>
        </div>

        <div className="relative w-[284px] flex">
          <input
            type="password"
            id="password"
            placeholder=" "
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            onChange: () => clearError(),
            })}
            className={`peer border w-full h-[48px] rounded-3xl px-4 bg-white 
              ${
                errors.password || error
                  ? "border-red-500 outline-red-500"
                  : "border-gray2 outline-none"
              }`}
          />
          <label
            htmlFor="password"
            className={`absolute flex -translate-y-1/2 px-1 left-4 top-0 bg-white transition-colors
              ${
                errors.password || error
                  ? "text-red-500"
                  : "peer-focus:text-blue-500 text-gray1"
              }`}
          >
            Password
          </label>
        </div>
           
        {loading ? (
          <div className="w-full  flex justify-center py-2">
            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin bg-blue-500"></div>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full h-[48px]  hover:bg-blue-500 bg-black  text-white font-semibold py-2 rounded-3xl transition duration-300 delay-75"
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