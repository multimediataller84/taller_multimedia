import { useState } from "react";
import { LoginRepository } from "../repositories/loginRepository";
import { PostLoginUseCase } from "../models/useCases/postLoginUseCase";
import { createAddapterLogin } from "../adapters/createAddapterLogin";
import { TLogin } from "../models/types/TLogin";
import { TUser } from "../../../models/types/TUser";
import { validateEmail, checkInput } from "../utils/validator";

const useLogin = () => {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loginRepository = LoginRepository.getInstance();
  const postLoginUseCase = new PostLoginUseCase(loginRepository);

  const requestUser = async (data: TLogin) => {
    try {
      checkInput(data.email, data.password);
      validateEmail(data.email);
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

  return { requestUser, user, loading, error, refresh: requestUser };
};

export default useLogin;
