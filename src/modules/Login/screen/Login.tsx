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
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data: TLogin) => {
    await requestUser(data);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded-2xl px-8 pt-6 pb-8 w-full max-w-sm"
      >
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Your email
        </label>
        <input
          type="email"
          placeholder="example@mail.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
          className={`w-full border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded-xl py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 mb-1`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>
        )}

        <label className="block text-gray-700 text-sm font-medium mb-2">
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
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl transition duration-200"
          >
            Login
          </button>
        )}

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

        {error && <p className="text-red-500 text-sm mt-3">Error: {error}</p>}
      </form>
    </div>
  );
}
