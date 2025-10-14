import { useState, useMemo } from "react";
import { useProfile } from "../../Profile/hooks/useProfile";

interface AddCashRegisterProps {
  visibleAdd: boolean;
  setVisibleAdd: React.Dispatch<React.SetStateAction<boolean>>;
  cashRegisterSelect: any;
  setCashRegisterSelect: React.Dispatch<React.SetStateAction<any>>;
  add: boolean;
  handleAddCashRegister: (newCashRegister: any) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export default function AddCashRegister(props: AddCashRegisterProps) {
  const { profiles, loading } = useProfile();
  const [searchProfile, setSearchProfile] = useState("");

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) =>
      `${p.username} ${p.name}`.toLowerCase().includes(searchProfile.toLowerCase())
    );
  }, [searchProfile, profiles]);

  return (
    <div
      className="fixed inset-0 flex justify-center items-center flex-col bg-black/50"
      onClick={() => props.setVisibleAdd(false)}
    >
      <div
        className="bg-white w-[30%] h-[60%] rounded-2xl shadow flex flex-col p-8 space-y-8"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-lato font-medium">Añadir Caja</h1>
          <div className="space-x-4">
            <button className="w-[94px] py-2 rounded-3xl font-Lato font-bold bg-black text-white"
            onClick={() => props.handleAddCashRegister(props.cashRegisterSelect)}
            >
              Añadir
            </button>
            <button
              className="w-[94px] py-2 rounded-3xl font-Lato font-bold bg-black text-white"
              onClick={() => props.setVisibleAdd(false)}
            >
              Cancelar
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-3 ">
          <label htmlFor="amount" className="text-base text-black font-medium font-lato">
            Monto Inicial
          </label>
          <input
            className="w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-normal text-base focus:outline-blue-500"
            type="number"
            id="amount"
            name="amount"
            value={props.cashRegisterSelect?.amount || ""}
            onChange={(e) => {
                props.handleChange(e); }}
            placeholder="Monto"
          />

          <label htmlFor="opening_amount" className="text-base text-black font-medium font-lato">
            Monto Abrir
          </label>
          <input
            className="w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-normal text-base focus:outline-blue-500"
            type="text"
            id="opening_amount"
            name="opening_amount"
            value={props.cashRegisterSelect?.opening_amount || ""}
            onChange={(e) => {
                props.handleChange(e); }}
            placeholder="Monto Abrir"
          />
        </div>

        <div className="flex flex-col space-y-2 ">
          <label htmlFor="searchProfile" className="text-base text-black font-medium font-lato">
            Empleado
          </label>
          <input
            className="w-full py-2 border rounded-3xl px-4 text-gray1 border-gray2 bg-white font-normal text-base focus:outline-blue-500"
            type="text"
            placeholder="Buscar perfil"
            value={searchProfile}
            onChange={(e) => setSearchProfile(e.target.value)}
          />
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
                className={`cursor-pointer rounded-xl mr-18 px-4 py-3 shadow transition
                ${
                  props.cashRegisterSelect?.user_id === profile.id
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-gray-200"
                }`}
                onClick={() =>
                  props.setCashRegisterSelect({
                    ...props.cashRegisterSelect,
                    user_id: profile.id,
                    employee_name: profile.username,
                  })
                }
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
