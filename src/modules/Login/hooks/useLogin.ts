import { useState } from "react";
import { LoginRepository } from "../repositories/loginRepository";
import { PostLoginUseCase } from "../models/useCases/postLoginUseCase";
import { createAddapterLogin } from "../adapters/createAddapterLogin";
import { TLogin } from "../models/types/TLogin";
import { TUser } from "../../../models/types/TUser";
import { checkInput } from "../utils/validator";

const useLogin = () => {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const clearError = () => setError(null);

  const loginRepository = LoginRepository.getInstance();
  const postLoginUseCase = new PostLoginUseCase(loginRepository);

  const requestUser = async (data: TLogin) => {
  try {
    checkInput(data.username, data.password); 
    setLoading(true);
    const result = await postLoginUseCase.execute(data);
    const formatted: TUser = createAddapterLogin(result);
    setUser(formatted);
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError(String(err));
    }
  } finally {
    setLoading(false);
  }
};

  return { requestUser, user, loading, error, clearError, refresh: requestUser };
};

export default useLogin;
