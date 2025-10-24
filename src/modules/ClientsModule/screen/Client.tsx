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
    clientsPerPage,
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
    className="w-full h-auto bg-white rounded-xl pb-4 shadow"
  >
    <rect x="20" y="20" rx="4" ry="4" width="200" height="10" />
    <rect x="20" y="45" rx="4" ry="4" width="180" height="10" />
  </ContentLoader>
  );
 
  return (
    <RootLayout search={search} setSearch={setSearch}>
      <div className="w-1/5 h-screen bg-[#E9EEF0] flex-col ">
        <div className="flex justify-between mt-8 ml-8">
          <h2 className="font-Lato text-2xl">Lista de Clientes</h2>
          <button
            className={`w-[94px] border rounded-3xl py-2 font-Lato text-base mr-4 transition duration-300 
              ${
                visibleAdd == true
                  ? "bg-gray3 text-gray1 border-gray2 "
                  : "bg-blue-500 text-white border-blue-500 hover:bg-blue-800 hover:border-blue-800"
              }`}
              onClick={() => {
                setVisibleAdd(true);
                setVisibleEdit(false);
                setAdd(false);
                setClientSelect({
                  identification_type: "", 
                  id_number: "",
                  phone: "",
                  name: "",
                  last_name: "",
                  email: "",
                  address: "",
                  province_id: "",
                  canton_id: "",
                  district_id: "",
                });
              }}
          >
            Añadir
          </button>
        </div>

        <div className="w-full h-auto pl-8">
          <h3 className="font-Lato font-medium text-base text-gray1">
            Todos los clientes registrados <br />
            en sistema
          </h3>
        </div>

       <div className="w-full xl:h-[50%] sm:h-[40%] flex flex-col overflow-y-auto mt-8">
        <div className="space-y-2">
          {loading ? ( 
            [...Array(4)].map((_, index) => (
              <div key={index} className="w-full pl-8 pr-11 flex">
                  <ClientLoader />
              </div>
            ))
          ) : (
            currentClients.map((items) => (
              <div key={items.id_number} className="w-full pl-8 pr-11 flex">
                <div
                  className={`cursor-pointer  w-full h-auto rounded-xl pb-4 font-lato text-black text-base shadow transition duration-150 delay-75 
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
                  <h2 className="w-full ml-4 mt-4 font-medium">{items.name}</h2>
                  <h3 className="w-full ml-4 font-medium">{items.last_name}</h3>
                  <h4 className="mt-1 ml-4">{items.id_number}</h4>
                  <h5 className="mt-5 justify-end w-full flex pr-4">Facturas: {items.invoices.length}</h5>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

        <div className="w-full pl-8 flex">
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
        <h2 className="pl-8 mt-4 font-Lato font-medium text-base text-gray1">
          Hay {clients.length} clientes registrados...
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