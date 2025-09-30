import EditProfile from "../../Profile/components/editProfile";
import AddProfile from "../components/addProfile";
import { RootLayout } from "../../../_Layouts/RootLayout";
import { useProfile } from "../hooks/useProfile";
import ContentLoader from 'react-content-loader'

export const Profile = () => {
  const {
    searchProfiles,
    setSearchProfiles,
    handleAddProfile,
    handleChange,
    handleDelete,
    handleSave,
    visibleAddProfile,
    setVisibleAddProfile,
    setVisibleEditProfile,
    setProfileSelect,
    currentProfiles,
    profileSelect,
    activePage,
    profiles,
    setActivePage,
    addProfile,
    editProfile,
    visibleEditProfile,
    loading,
    setLoading
  } = useProfile();

  const ProfileLoader = () => (
  <ContentLoader
    speed={2}
    width="100%"
    height="auto"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    className="w-full"
  >
    <rect x="20" y="20" rx="4" ry="4" width="200" height="5" />
    <rect x="20" y="45" rx="4" ry="4" width="180" height="5" />
  </ContentLoader>
  );


  return (
    <RootLayout search={searchProfiles} setSearch={setSearchProfiles}>
      <div className="w-1/5 bg-[#E9EEF0] flex-col  ">
        <div className="flex justify-between mt-8 ml-8">
          <h2 className="font-Lato text-2xl">Lista de Perfiles</h2>
          <button
            className={`w-[94px] border rounded-3xl py-2 font-Lato text-base mr-4 transition duration-300 
                      ${
                        visibleAddProfile == true
                          ? "bg-white text-gray1 border-gray2 hover:bg-gray2 hover:border-gray2"
                          : "bg-blue-500 text-white border-blue-500 hover:bg-blue-800 hover:border-blue-800"
                      }`}
            onClick={() => {
              setVisibleAddProfile(true);
              setVisibleEditProfile(false);
              setProfileSelect({
                name: "",
                username: "",
                password: "",
                role_id: 0,
              });
            }}
          >
            Añadir
          </button>
        </div>

        <div className="w-full h-auto pl-8">
          <h3 className="font-Lato font-medium text-base text-gray1">
            Todos los perfiles registrados <br />
            en sistema
          </h3>
        </div>

        <div className="w-full xl:h-[60%] sm:h-[40%] flex flex-col overflow-y-auto mt-8 ">
          <div className="space-y-2">
            {loading ? ( 
            [...Array(5)].map((_, index) => (
              <div key={index} className="w-full pl-8 pr-11 flex">
                <div className="w-full rounded-xl pb-4 shadow bg-white">
                  <ProfileLoader />
                </div>
              </div>
            ))
          ) : ( 
            currentProfiles.map((items) => (
              <div className="w-full pl-8 pr-18 flex">
                <div
                  className={`w-full h-auto rounded-xl pb-4 font-lato text-black text-base shadow transition duration-150 delay-75 
                            ${
                              profileSelect === items
                                ? "bg-blue-500 text-white hover:bg-blue-800"
                                : "bg-white text-black hover:bg-gray2"
                            }
                            `}
                  onClick={() => {
                    setProfileSelect(items);
                    setVisibleEditProfile(true);
                    setVisibleAddProfile(false);
                  }}
                >
                  <h2 className="w-full h-auto ml-4 mt-4 font-medium">
                    {items.username}
                  </h2>
                  <h3 className="mt-1 ml-4">
                    {" "}
                    {items.role_id === 1 ? "Administrador" : "Empleado"}
                  </h3>
                </div>
              </div>
            ))
          )}


          </div>
        </div>

        <div className="pl-8 pr-18 pt-4 justify-between w-full flex  font-Lato font-medium">
          {[1, 2, 3, "...", 8].map((num, index) => (
            <button
              key={index}
              className={`size-[42px] border rounded-full active:outline-0 
                        ${
                          activePage === num
                            ? "bg-blue-500 text-white"
                            : "bg-white border-gray2 text-gray1"
                        }`}
              onClick={() => typeof num === "number" && setActivePage(num)}
            >
              {num}
            </button>
          ))}
        </div>
        <h2 className="pl-8 mt-4 font-Lato font-medium text-base text-gray1">
          Mostrando 10 de {profiles.length} resultados...
        </h2>
      </div>

      {visibleEditProfile && (
        <EditProfile
          profileSelect={profileSelect}
          editProfile={editProfile}
          handleSave={handleSave}
          handleChange={handleChange}
          handleDelete={handleDelete}
        />
      )}

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
    </RootLayout>
  );
};
