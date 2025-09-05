import { useState } from "react";
import { RegisterRepository } from "../repositories/registerRepository";
import { PostRegisterUseCase } from "../models/useCases/postRegisterUseCase";
import { createAddapterRegister } from "../adapters/createAddapterRegister";
import { TRegister } from "../models/types/TRegister";
import { validateEmail, checkInput, checkPassword } from "../utils/validator";

const useRegister = () => {
  const [user, setUser] = useState<TRegister | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const registerRepository = RegisterRepository.getInstance();
  const postRegisterUseCase = new PostRegisterUseCase(registerRepository);

  const requestUser = async (data: TRegister) => {
    try {
      checkInput(
        data.email,
        data.password,
        data.username,
        data.last_name,
        data.name,
        data.password_confirmation
      );
      checkPassword(data.password, data.password_confirmation);
      validateEmail(data.email);
      setLoading(true);

      data.role_id = 2;
      const result = await postRegisterUseCase.execute(data);
      const formatted: TRegister = createAddapterRegister(result);

      setUser(formatted);
      setError(null);
      
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

  return {
    requestUser,
    user,
    loading,
    error,
  };
};

export default useRegister;
