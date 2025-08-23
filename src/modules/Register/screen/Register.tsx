import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TRegister } from "../models/types/TRegister";
import useRegister from "../hooks/useRegister";
import { useEffect } from "react";

export default function Register() {
  const navigate = useNavigate();
  const { requestUser, user, loading, error } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TRegister>();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data: TRegister) => {
    await requestUser(data);
  };

  const password = watch("password");

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded-2xl px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          Create Account
        </h2>

        <label className="block text-gray-700 text-sm font-medium mb-2">
          Name
        </label>
        <input
          type="text"
          placeholder="Your name"
          {...register("name", { required: "Name is required" })}
          className={`w-full border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded-xl py-2 px-3 text-gray-800 mb-2`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>
        )}

        <label className="block text-gray-700 text-sm font-medium mb-2">
          Lastname
        </label>
        <input
          type="text"
          placeholder="Lastname"
          {...register("last_name", { required: "Lastname is required" })}
          className={`w-full border ${
            errors.last_name ? "border-red-500" : "border-gray-300"
          } rounded-xl py-2 px-3 text-gray-800 mb-2`}
        />
        {errors.last_name && (
          <p className="text-red-500 text-sm mb-2">
            {errors.last_name.message}
          </p>
        )}

        <label className="block text-gray-700 text-sm font-medium mb-2">
          Username
        </label>
        <input
          type="text"
          placeholder="Username"
          {...register("username", { required: "Username is required" })}
          className={`w-full border ${
            errors.username ? "border-red-500" : "border-gray-300"
          } rounded-xl py-2 px-3 text-gray-800 mb-2`}
        />
        {errors.username && (
          <p className="text-red-500 text-sm mb-2">{errors.username.message}</p>
        )}

        <label className="block text-gray-700 text-sm font-medium mb-2">
          Email
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
          } rounded-xl py-2 px-3 text-gray-800 mb-2`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
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
          } rounded-xl py-2 px-3 text-gray-800 mb-2`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password.message}</p>
        )}

        <label className="block text-gray-700 text-sm font-medium mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          {...register("password_confirmation", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          className={`w-full border ${
            errors.password_confirmation ? "border-red-500" : "border-gray-300"
          } rounded-xl py-2 px-3 text-gray-800 mb-2`}
        />
        {errors.password_confirmation && (
          <p className="text-red-500 text-sm mb-2">
            {errors.password_confirmation.message}
          </p>
        )}

        {loading ? (
          <div className="w-full flex justify-center py-2">
            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin bg-red-500"></div>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-xl transition duration-200 mt-2"
          >
            Create Account
          </button>
        )}

        <div className="flex justify-center mt-4 text-sm">
          <span className="text-gray-500">Do you have an account? </span>
          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="ml-1 text-blue-600 hover:underline font-medium"
          >
            Login
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-3">Error: {error}</p>}
      </form>
    </div>
  );
}
