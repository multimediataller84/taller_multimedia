import EditProfile from "../../Profile/components/editProfile";
import AddProfile from "../components/addProfile";
import { RootLayout } from "../../../_Layouts/RootLayout";
import { useProfile } from "../hooks/useProfile";
import ContentLoader from 'react-content-loader'
import ConfirmationAddProfile from "../components/confirmationAddProfile";
import ConfirmationDeleteProfile from "../components/confirmationDeleteProfile";
import ConfirmationEditProfile from "../components/confirmationEditProfile";
import Pagination from "../../../components/pagination";
import logo2 from "../../../components/utils/logo2.svg";

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
    pagesDisplay,
    errorMessage,
    setErrorMessage
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
            className={`font-bold mr-0.5 sm:mr-2 py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato transition duration-300 border ml-2 mt-2 sm:ml-0 sm:mt-0
                      ${
                        visibleAddProfile == true
                          ? "bg-gray3 text-gray1 border-gray2 "
                          : "bg-blue-500 text-white border-blue-500 hover:bg-blue-800 hover:border-blue-800"
                      }`}
            onClick={() => {
              setErrorMessage("")
              setVisibleAddProfile(true);
              setVisibleEditProfile(false);
              setConfirmationAddProfile(false);
              setConfirmationDeleteProfile(false);
              setConfirmationEditProfile(false);
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
                    setErrorMessage("")
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
                    {items.role_id === 1 ? "Administrador" : "Cajero"}
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

      {!(visibleEditProfile || visibleAddProfile || confirmationAddProfile || confirmationDeleteProfile || confirmationEditProfile || errorMessage) && (
        <div className="flex w-full items-center justify-center bg-[#DEE8ED]">
          <img src={logo2} alt="Logo" className="opacity-20 w-40 sm:w-56 md:w-72 2xl:w-96 select-none pointer-events-none" />
        </div>
      )}

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

      {errorMessage && (
        
        <div className="flex relative w-[70%] justify-center items-center flex-col">
            <div className="bg-white w-auto h-48 -translate-y-20 px-11 items-center rounded-2xl shadow">
            <div className="h-full items-center flex-col flex justify-center w-full">
                <div className="w-full justify-center flex mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-12 stroke-red-500">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                </div>
                <div className="text-base xl:text-2xl text-center font-Lato font-medium whitespace-pre-line">{errorMessage}</div>
            </div>       
            </div>
        </div>
      )}
    </RootLayout>
  );
};
