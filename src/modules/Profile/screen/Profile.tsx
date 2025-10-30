import EditProfile from "../../Profile/components/editProfile";
import AddProfile from "../components/addProfile";
import { RootLayout } from "../../../_Layouts/RootLayout";
import { useProfile } from "../hooks/useProfile";
import ContentLoader from 'react-content-loader'
import ConfirmationAddProfile from "../components/confirmationAddProfile";
import ConfirmationDeleteProfile from "../components/confirmationDeleteProfile";
import ConfirmationEditProfile from "../components/confirmationEditProfile";
import Pagination from "../../../components/pagination";

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
    setAddProfile,
    editProfile,
    setEditProfile,
    visibleEditProfile,
    loading,
    confirmationAddProfile,
    setConfirmationAddProfile,
    confirmationEditProfile,
    setConfirmationEditProfile,
    confirmationDeleteProfile,
    setConfirmationDeleteProfile,
    totalPages,
    canPrev,
    canNext,
    goPrev,
    goNext,
    pagesDisplay
  } = useProfile();

  const ProfileLoader = () => (
    <ContentLoader
      speed={2}
      foregroundColor="#ecebeb"
      className="w-full h-18 sm:h-21 md:h-26 2xl:h-29 bg-white rounded-xl pb-4 shadow"
    >
    <rect x="20" y="20" rx="4" ry="4" width="60" height="10" />

    </ContentLoader>
  );

  return (
    <RootLayout search={searchProfiles} setSearch={setSearchProfiles}>
      <div className="w-40 flex-shrink-0 flex-grow-0 sm:w-50 md:w-60 2xl:min-w-1/5 bg-[#E9EEF0] flex-col">
        <div className="flex justify-between items-center mt-0 ml-0 sm:mt-2 sm:ml-2 md:mt-4 md:ml-4 2xl:mt-8 2xl:ml-8">
          <h2 className="font-Lato text-xs sm:text-sm md:text-base xl:text-base 2xl:text-2xl pl-2 pt-2 sm:pl-0 sm:pt-0 ">Lista de Perfiles</h2>
          <button
            className={`font-bold py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato transition duration-300 border ml-2 mt-2 sm:ml-0 sm:mt-0
                      ${
                        visibleAddProfile == true
                          ? "bg-gray3 text-gray1 border-gray2 "
                          : "bg-blue-500 text-white border-blue-500 hover:bg-blue-800 hover:border-blue-800"
                      }`}
            onClick={() => {
              setVisibleAddProfile(true);
              setVisibleEditProfile(false);
              setAddProfile(false);
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

        <div className="w-full h-auto ml-2 mt-2 md:ml-4 2xl:ml-8">
          <h3 className="font-Lato font-medium text-[10px] sm:text-xs md:text-base xl:text-base text-gray1 ">
            Todos los perfiles registrados <br />
            en sistema
          </h3>
        </div>

        <div className="w-full h-100 lg:h-120 flex flex-col overflow-y-auto mt-2 md:mt-4">
          <div className="space-y-2">
            {loading ? ( 
            [...Array(4)].map((_, index) => (
              <div key={index} className="w-full pl-2 2xl:pl-8 pr-4 2xl:pr-11 flex">
                  <ProfileLoader />
              </div>
            ))
          ) : ( 
            currentProfiles.map((items) => (
              <div key={items.id} className="w-full pl-2 2xl:pl-8 pr-4 2xl:pr-11 flex">
                <div
                  className={`cursor-pointer w-full h-auto rounded-xl pb-2 font-lato text-black text-base shadow transition duration-150 delay-75 
                            ${
                              profileSelect?.id === items.id
                                ? "bg-blue-500 text-white hover:bg-blue-800"
                                : "bg-white text-black hover:bg-gray-200"
                            }
                            `}
                  onClick={() => {
                    setProfileSelect(items);
                    setVisibleEditProfile(true);
                    setVisibleAddProfile(false);
                    setConfirmationAddProfile(false);
                    setConfirmationDeleteProfile(false);
                    setConfirmationEditProfile(false);
                    setEditProfile(false);
                  }}
                >
                  <h2 className="w-full ml-2 md:ml-4 mt-2 md:mt-4 font-medium text-xs sm:text-sm 2xl:text-base">
                    {items.username}
                  </h2>
                  <h3 className="w-full ml-2 md:ml-4 text-xs sm:text-sm 2xl:text-base opacity-80">{items.name}</h3>
                  <h4 className="mt-2 md:mt-5 justify-end w-full flex pr-2 md:pr-4 text-xs sm:text-sm 2xl:text-base">
                    {" "}
                    {items.role_id === 1 ? "Administrador" : "Empleado"}
                  </h4>
                </div>
              </div>
            ))
          )}
          </div>
        </div>

        <div className="w-full flex pl-2 2xl:pl-8">
        <Pagination
        totalPages={totalPages}
        activePage={activePage}
        setActivePage={setActivePage}
        canPrev={canPrev}
        canNext={canNext}
        goPrev={goPrev}
        goNext={goNext}
        pagesDisplay={pagesDisplay}
        />
        </div>
        <h2 className="ml-2 md:ml-4 2xl:ml-8 mt-4 font-Lato font-medium text-xs md:text-base xl:text-base text-gray1">
         Hay {profiles.length} perfiles registrados
        </h2>
      </div>

      {confirmationAddProfile && 
      (<ConfirmationAddProfile/>)}

      {confirmationDeleteProfile && 
      (<ConfirmationDeleteProfile/>)}

      {confirmationEditProfile &&
      (<ConfirmationEditProfile/>)}

      {visibleEditProfile && (
        <EditProfile
          profileSelect={profileSelect}
          setProfileSelect={setProfileSelect}
          setVisibleEditProfile={setVisibleEditProfile}
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
