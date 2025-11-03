import EditClient from "../components/editClient";
import AddClient from "../components/addClient";
import { RootLayout } from "../../../_Layouts/RootLayout";
import { useClient } from "../hooks/useClient";
import ContentLoader from 'react-content-loader'
import ConfirmationEditClient from "../components/confirmationEditClient";
import ConfirmationAddClient from "../components/confirmationAddClient";
import ConfirmationDeleteClient from "../components/confirmationDeleteClient"
import Pagination from "../../../components/pagination";

export const Client = () => {

  const {
    search,
    setSearch,
    visibleAdd,
    setVisibleAdd,
    setVisibleEdit,
    setClientSelect,
    currentClients,
    clientSelect,
    activePage,
    setActivePage,
    visibleEdit,
    clients,
    edit,
    setEdit,
    add,
    setAdd,
    handleSave,
    handleChange,
    handleAddClient,
    handleDelete,
    loading,
    confirmationEditClient,
    setConfirmationEditClient,
    confirmationAddClient,
    setConfirmationAddClient,
    confirmationDeleteClient,
    setConfirmationDeleteClient,
    totalPages,
    canPrev,
    canNext,
    goPrev,
    goNext,
    pagesDisplay,
    provinces,
    cantons,
    districts,
    loadingLocations,
  } = useClient();

  const ClientLoader = () => (
  <ContentLoader
    speed={2}
    foregroundColor="#ecebeb"
    className="w-full h-19 sm:h-29 md:h-34 2xl:h-38 bg-white rounded-xl pb-4 shadow"
  >
    <rect x="20" y="20" rx="4" ry="4" width="60" height="10" />
    <rect x="20" y="45" rx="4" ry="4" width="40" height="10" />
  </ContentLoader>
  );
 
  return (
    <RootLayout search={search} setSearch={setSearch}>
      <div className="w-40 flex-shrink-0 flex-grow-0 sm:w-50 md:w-60 2xl:min-w-1/5 bg-[#E9EEF0] flex-col">
        <div className="flex justify-between items-center mt-0 ml-0 sm:mt-2 sm:ml-2 md:mt-4 md:ml-4 2xl:mt-8 2xl:ml-8">
          <h2 className="font-Lato text-xs sm:text-sm md:text-base xl:text-base 2xl:text-2xl pl-2 pt-2 sm:pl-0 sm:pt-0 ">Lista de Clientes</h2>
          <button
            className={`font-bold py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato transition duration-300 border ml-2 mt-2 sm:ml-0 sm:mt-0
              ${
                visibleAdd == true
                  ? "bg-gray3 text-gray1 border-gray2 "
                  : "bg-blue-500 text-white border-blue-500 hover:bg-blue-800 hover:border-blue-800"
              }`}
              onClick={() => {
                setVisibleAdd(true);
                setVisibleEdit(false);
                setAdd(false);
                setConfirmationEditClient(false);
                setConfirmationAddClient(false);
                setConfirmationDeleteClient(false);   
                setClientSelect({
                  name: "",
                  last_name: "",
                  address: "",
                  identification_type: "", 
                  id_number: "",
                  email: "",
                  phone: "",
                  province_id: "",
                  canton_id: "",
                  district_id: "",
                });
              }}
          >
            Añadir
          </button>
        </div>

        <div className="w-full h-auto ml-2 mt-2 md:ml-4 2xl:ml-8">
          <h3 className="font-Lato font-medium text-[10px] sm:text-xs md:text-base xl:text-base text-gray1 ">
            Todos los clientes registrados <br />
            en sistema
          </h3>
        </div>

       <div className="w-full h-100 lg:h-120 flex flex-col overflow-y-auto mt-2 md:mt-4">
        <div className="space-y-2">
          {loading ? ( 
            [...Array(4)].map((_, index) => (
              <div key={index} className="w-full pl-2 2xl:pl-8 pr-4 2xl:pr-11 flex">
                  <ClientLoader />
              </div>
            ))
          ) : (
            currentClients.map((items) => (
              <div key={items.id_number} className="w-full pl-2 2xl:pl-8 pr-4 2xl:pr-11 flex">
                <div
                  className={`cursor-pointer w-full h-auto rounded-xl pb-4 font-lato text-black text-base shadow transition duration-150 delay-75 
                    ${
                      clientSelect?.id === items.id
                        ? "bg-blue-500 text-white hover:bg-blue-800"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                  onClick={() => {
                    setClientSelect(items);
                    setVisibleEdit(true);
                    setVisibleAdd(false);
                    setEdit(false);
                    setConfirmationEditClient(false);
                    setConfirmationAddClient(false);
                    setConfirmationDeleteClient(false);   
                  }}
                >
                  <h2 className="w-full ml-2 md:ml-4 mt-2 md:mt-4 font-medium text-xs sm:text-sm 2xl:text-base">{items.name}</h2>
                  <h3 className="w-full ml-2 md:ml-4 font-medium text-xs sm:text-sm 2xl:text-base">{items.last_name}</h3>
                  <h4 className="mt-1 ml-2 md:ml-4 font-medium text-xs sm:text-sm 2xl:text-base opacity-80">{items.id_number}</h4>
                  <h5 className="hidden mt-2 md:mt-5 justify-end w-full sm:flex pr-2 md:pr-4 text-xs sm:text-sm 2xl:text-base">Facturas: {items.invoices.length}</h5>
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
          Hay {clients.length} clientes registrados
        </h2>
      </div>

      {visibleEdit && (
        <EditClient
          clientSelect={clientSelect}
          setClientSelect={setClientSelect}
          setVisibleEdit={setVisibleEdit}
          edit={edit}
          handleSave={handleSave}
          handleChange={handleChange}
          handleDelete={handleDelete}
          provinces={provinces}
          cantons={cantons}
          districts={districts}
          loadingLocations={loadingLocations}
        />
      )}

      {confirmationEditClient &&
      (<ConfirmationEditClient/>)}
      
      {confirmationAddClient && 
      (<ConfirmationAddClient/>)}

      {confirmationDeleteClient && 
      (<ConfirmationDeleteClient/>)}

      {visibleAdd && (
        <AddClient
          visibleAdd={visibleAdd}
          setVisibleAdd={setVisibleAdd}
          clientSelect={clientSelect}
          setClientSelect={setClientSelect}
          add={add}
          handleAddClient={handleAddClient}
          handleChange={handleChange}
          provinces={provinces}
          cantons={cantons}
          districts={districts}
          loadingLocations={loadingLocations}
        />
      )}

      
    </RootLayout>
  );
};


/*
bg-[#E9EEF0]

*/