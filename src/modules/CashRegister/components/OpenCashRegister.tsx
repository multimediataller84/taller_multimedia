import { useState, useMemo } from "react";
import { useProfile } from "../../Profile/hooks/useProfile";
import { TOpenRegister } from "../models/interfaces/ICashRegisterService";

interface OpenCashRegisterProps {
  visibleOpen: boolean;
  setVisibleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cashRegisterSelect: any;
  setCashRegisterSelect: React.Dispatch<React.SetStateAction<any>>;
  handleOpenCashRegister: (id: number, data: TOpenRegister) => Promise<void>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setVisibleInfoCashRegister: React.Dispatch<React.SetStateAction<boolean>>;  
}

export default function OpenCashRegister(props: OpenCashRegisterProps) {
  const { profiles, loading } = useProfile();
  const [searchProfile, setSearchProfile] = useState("");

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) =>
      `${p.username} ${p.name}`.toLowerCase().includes(searchProfile.toLowerCase())
    );
  }, [searchProfile, profiles]);

   const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
    const validateOnSave = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!props.cashRegisterSelect?.opening_amount) {
      newErrors.opening_amount = "El monto de apertura es necesario";
    } 

    if (!props.cashRegisterSelect?.user_id) {
      newErrors.user_id = "El empleado es necesario";
    } 

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center flex-col bg-black/50"
      onClick={() => props.setVisibleOpen(false)}
    >
      <div
        className="bg-white w-[30%] h-[70%] rounded-2xl shadow flex flex-col p-8 space-y-8"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-lato font-medium">Abrir Caja</h1>
          <div className="space-x-4">
          <button
            className="w-[94px] py-2 rounded-3xl font-Lato font-bold bg-blue-500 hover:bg-blue-600 text-white"
            onClick={ () => {
                if (validateOnSave()) {
                  props.handleOpenCashRegister(
                props.cashRegisterSelect?.id,
                {
                  opening_amount: props.cashRegisterSelect?.opening_amount,
                  user_id: props.cashRegisterSelect?.user_id,
                }
              );
              props.setCashRegisterSelect(null);
              props.setVisibleOpen(false);
              props.setVisibleInfoCashRegister(false);
              }
            }}
          >
            Abrir
          </button>
            <button
              className="w-[94px] py-2 rounded-3xl font-Lato font-bold bg-black text-white border-black hover:border-gray-700 hover:bg-gray-700"
              onClick={() => props.setVisibleOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </div>

          <label htmlFor="opening_amount" className="text-base text-black font-medium font-lato">
            Monto Abrir
          </label>
          <input className={`w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-medium text-base transition-colors ${errors.opening_amount ? "border-red-500" : "border-gray2"} focus:outline-2 focus:outline-blue-500`}
            type="text"
            id="opening_amount"
            name="opening_amount"
            value={props.cashRegisterSelect?.opening_amount || ""}
            onChange={(e) => {
                props.handleChange(e); 
              if (errors.opening_amount) {
                        setErrors((prev) => ({ ...prev, opening_amount: "" })); 
                }
              }}
            placeholder="Monto Abrir"
          />
           {errors.opening_amount && <p className="text-red-500 font-lato text-sm">{errors.opening_amount}</p>}

        <div className="flex flex-col space-y-2 ">
          <label htmlFor="searchProfile" className="text-base text-black font-medium font-lato">
            Empleado
          </label>
          <input className={`w-full py-2 border rounded-3xl px-4 text-gray1 bg-white font-medium text-base transition-colors
              ${errors.user_id
                  ? "border-red-500"
                  : props.cashRegisterSelect?.user_id && props.cashRegisterSelect.user_id > 0
                  ? "border-blue-500"
                  : "border-gray2"
              }
              focus:outline-2 focus:outline-blue-500`}
            type="text"
            placeholder="Buscar perfil"
            value={searchProfile}
            onChange={(e) => setSearchProfile(e.target.value)}
          />
          {errors.user_id && <p className="text-red-500 font-lato text-sm">{errors.user_id}</p>}
        </div>

        <div className="flex flex-col overflow-y-auto h-[30%] space-y-2">
          {loading ? (
            <div className="w-full h-[48px] flex justify-center ">
              <div className="translate-y-15 w-6 h-6 border-2 border-t-transparent rounded-full animate-spin border-blue-500"></div>
            </div>
          ) : (
            filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className={`cursor-pointer rounded-xl px-4 py-3 shadow transition mr-18
                ${
                  props.cashRegisterSelect?.user_id === profile.id
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-gray-200"
                }`}
                onClick={() => {
                  props.setCashRegisterSelect({
                    ...props.cashRegisterSelect,
                    user_id: profile.id,
                    employee_name: profile.username,
                  });
                    setErrors((prev) => ({ ...prev, user_id: "" }));
                }}
              >
                <h2 className="font-medium">{profile.username}</h2>
                <p className="text-sm opacity-80">
                  {profile.role_id === 1 ? "Administrador" : "Empleado"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
