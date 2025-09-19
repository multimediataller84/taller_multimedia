import { Navbar } from "../../../components/navbar"
import { Sidebar } from "../../../components/Sidebar";
import EditProfile from "../../Profile/components/editProfile"
import AddProfile from "../components/addProfile";

import { useEffect, useState } from "react";
import { TUserEndpoint } from "../models/types/TUserEndpoint";
import {TUser} from "../models/types/TUser"
import { ProfileRepository } from "../repositories/profileRepository";
import { UseCasesController } from "../controllers/useCasesController";

const repository = ProfileRepository.getInstance();

const useCases = new UseCasesController(repository);

export const Profile = () => {

  const [profiles, setProfiles] = useState<TUserEndpoint[]>([]);
  const [profileSelect, setProfileSelect] = useState<any>(null);

  const [editProfile, setEditProfile] = useState(false);
  const [visibleEditProfile, setVisibleEditProfile] = useState(false); 

  const [addProfile, setAddProfile] = useState(false); 
  const [visibleAddProfile, setVisibleAddProfile] = useState(false);

  const [activePage, setActivePage] = useState(1);
  const profilesPerPage = 10; 
  const indexOfLastProfile = activePage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile- profilesPerPage;
  const currentProfiles = profiles.slice(indexOfFirstProfile, indexOfLastProfile);

    useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await useCases.getAll.execute()
        setProfiles(data);
      } catch (error) {
        console.error("Error al cargar perfiles:", error);
      }
    };
    fetchClients();
  }, []);

  const handleAddProfile = async (newUser: TUser) => {
  try {
    await useCases.post.execute(newUser);  

    const data = await useCases.getAll.execute(); 
    setProfiles(data);

    setVisibleAddProfile(false);
    setProfileSelect(null);
  } catch (error) {
    console.error("Error al crear perfil:", error);
  }
};

  const handleSave = async () => {
  if (!profileSelect) return;
  try {
    const updated = await useCases.patch.execute(profileSelect.id, profileSelect);
    setProfiles(prev => prev.map(c => (c.id === updated.id ? updated : c)));

    setEditProfile(false);

    if (editProfile) {
      setVisibleAddProfile(false);
      setVisibleEditProfile(false)
    }
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
  }
};

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  setProfileSelect((prev: any) => ({
    ...prev,
    [name]: value,
  }));

  if (value.trim() === "") {
    setEditProfile(false);
    setAddProfile(false);
  } else {
    setEditProfile(true);
    setAddProfile(true);
  }
};

const handleDelete = async (id: number) => {
  try {
    await useCases.delete.execute(id);
    setProfiles(prev => prev.filter(c => c.id !== id));
    setEditProfile(false);
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
  }
};

    return(

        <div className="flex absolute flex-col w-screen h-screen overflow-x-hidden">

              <div className="bg-[#DEE8ED] absolute size-full flex flex-col">
                <div>
                <Navbar></Navbar>
                </div>
                
                <div className="flex w-full h-full bg-[#DEE8ED]">
                  <Sidebar></Sidebar>
                  <div className="w-[378px] h-full bg-[#E9EEF0]">
                    <div className="pl-8 mt-8 flex  justify-between">
                      <h2 className="font-Lato text-2xl">Lista de Perfiles</h2>
                      <button className={`w-[94px] border rounded-3xl py-2 font-Lato text-base mr-4 transition duration-300 
                      ${visibleAddProfile == true ? "bg-white text-gray1 border-gray2 hover:bg-gray2 hover:border-gray2" 
                      : 
                      "bg-blue-500 text-white border-blue-500 hover:bg-blue-800 hover:border-blue-800" }`}
                      onClick={() => {
                        setVisibleAddProfile(true);
                        setVisibleEditProfile(false);
                        setProfileSelect({
                            name: "",
                            username: "",
                            password: "",
                            role_id: 0
                        });
                        }}
                      >Añadir</button>
                    </div>
        
                    <div className="w-full h-auto pl-8">
                      <h3 className="font-Lato font-medium text-base text-gray1">Todos los perfiles registrados <br />en sistema</h3>
                    </div>
        
                    <div className="w-full sm:h-96 xl:h-[520px] flex flex-col overflow-y-auto mt-11">
                      <div className="space-y-2">
                        {currentProfiles.map((items) => (
                          <div className="w-full pl-8 pr-18 flex">
                            <div className={`w-full h-auto rounded-xl pb-4 font-lato text-black text-base shadow transition duration-300 
                            ${profileSelect === items ? "bg-blue-500 text-white" : "bg-white text-black"}
                            `}
                              onClick={() => {
                                setProfileSelect(items);
                                setVisibleEditProfile(true);
                                setVisibleAddProfile(false)
                              }}>
                              <h2 className="w-full h-auto ml-4 mt-4 font-medium">{items.username}</h2>
                              <h3 className="mt-1 ml-4">  {items.role_id === 1 ? "Administrador" : "Empleado"}</h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
        
                    <div className="pl-8 mt-6 mb-8 pr-19 w-full flex justify-between font-Lato font-medium">
                      {[1, 2, 3, "...", 8].map((num, index) => (
                        <button
                        key={index}
                        className={`size-[42px] border rounded-full active:outline-0 
                        ${activePage === num 
                        ? "bg-blue-500 text-white" 
                        : "bg-white border-gray2 text-gray1"}`}
                        onClick={() => typeof num === "number" && setActivePage(num)}
                        >
                          {num}
                        </button>
                        ))}
                    </div>
                    <h2 className="pl-8 font-Lato font-medium text-base text-gray1">Mostrando 10 de {profiles.length} resultados...</h2>
                  </div>
                  
                  {visibleEditProfile && <EditProfile
                    profileSelect={profileSelect}
                    editProfile={editProfile}
                    handleSave={handleSave}
                    handleChange={handleChange} 
                    handleDelete={handleDelete}
                  />}

                    {visibleAddProfile && (
                    <AddProfile
                        visibleAddProfile={visibleAddProfile}
                        setVisibleAddProfile={setVisibleAddProfile}
                        profileSelect={profileSelect}
                        setProfileSelect={setProfileSelect}
                        addProfile={addProfile}
                        handleAddProfile={handleAddProfile}
                        handleChange={handleChange}
                    />
                    )}
                    
                </div>
              </div>
            </div>
    );


}


