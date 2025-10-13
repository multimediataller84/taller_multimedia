import { RootLayout } from "../../../_Layouts/RootLayout";
import { useCashRegister } from "../hooks/useCashRegister";
import ContentLoader from 'react-content-loader'
import InfoCashRegister from "../components/infoCashRegister";
import AddCashRegister from "../components/addCashRegister";
import Pagination from "../../../components/pagination";

export const CashRegister = () => {
    
    const {
        cashRegister,
        setCashRegister,
        cashRegisterSelect,
        setCashRegisterSelect,
        loading,
        setLoading,
        edit,
        setEdit,
        visibleEdit,
        setVisibleEdit,
        add,
        setAdd,
        visibleAdd,
        setVisibleAdd,
        activePage,
        setActivePage,
        search,
        setSearch,
        currentCashRegister,
        handleAddCashRegister,
        handleChange,
        handleOpenCashRegister,
        visibleOpen,
        setVisibleOpen,
        handleCloseCashRegister,
        visibleClose,
        setVisibleClose,
        handleDelete,
        totalPages,
        canPrev,
        canNext,
        goPrev,
        goNext,
        pagesDisplay,
    } = useCashRegister();

    const CashRegisterLoader = () => (
        <ContentLoader
            speed={2}
            foregroundColor="#ecebeb"
            className="w-full h-auto bg-white rounded-xl pb-4 shadow">
            <rect x="20" y="20" rx="4" ry="4" width="200" height="10" />
            <rect x="20" y="45" rx="4" ry="4" width="180" height="10" />
        </ContentLoader>
    );

    return(
         <RootLayout search={search} setSearch={setSearch}>
        <div className="w-1/5 h-screen bg-[#E9EEF0] flex-col ">
            <div className="flex justify-between mt-8 ml-8">
            <h2 className="font-Lato text-2xl">Lista de Cajas</h2>
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
                setCashRegisterSelect({
                          amount: 0,
                          opening_amount: 0,
                          closing_amount: 0,
                          status: "closed",
                          user_id: 0,
                });
                }}
            >
                Añadir
            </button>
            </div>

            <div className="w-full h-auto pl-8">
            <h3 className="font-Lato font-medium text-base text-gray1">
                Todas las cajas registradas <br />
                en sistema
            </h3>
            </div>

            <div className="w-full xl:h-[50%] sm:h-[40%] flex flex-col overflow-y-auto mt-8 ">
            <div className="space-y-2">
                {loading ? ( 
                [...Array(4)].map((_, index) => (
                <div key={index} className="w-full pl-8 pr-11 flex">
                    <CashRegisterLoader />
                </div>
                ))
            ) : ( 
                currentCashRegister.map((items) => (
                <div className="w-full pl-8 pr-11 flex">
                    <div
                    className={`cursor-pointer w-full h-auto rounded-xl pb-4 font-lato text-black text-base shadow transition duration-150 delay-75 
                                ${
                                cashRegisterSelect?.id === items.id
                                    ? "bg-blue-500 text-white hover:bg-blue-800"
                                    : "bg-white text-black hover:bg-gray-200"
                                }
                                `}
                    onClick={() => {
                        setCashRegisterSelect(items);
                        setVisibleEdit(true);
                        setVisibleAdd(false);
                        setEdit(false);
                    }}
                    >
                    <h2 className="w-full h-auto ml-4 mt-4 font-Lato font-bold">
                        Caja {items.id}
                    </h2>
                    <h3 className="mt-1 ml-4 font-Lato">
                          {items.user?.name || "Sin usuario"}
                    </h3>
                    <h4 className="mt-1 ml-4 font-Lato">
                        {new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(items.opening_amount)}
                    </h4>
                    <h5 className="mt-5 justify-end w-full flex pr-4 font-Lato font-bold">
                        {items.status === "open" ? "Abierta": "Cerrada"}
                    </h5>
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
            Mostrando 10 de {cashRegister.length} resultados...
            </h2>
      </div>        
    
        {visibleEdit && <InfoCashRegister
          cashRegisterSelect = {cashRegisterSelect}
          setCashRegisterSelect = {setCashRegisterSelect}
          setVisibleInfoCashRegister = {setVisibleEdit}
          handleChange = {handleChange}
          handleOpenCashRegister = {handleOpenCashRegister}
          visibleOpen = {visibleOpen}
          setVisibleOpen = {setVisibleOpen}
          handleCloseCashRegister = {handleCloseCashRegister}
          visibleClose = {visibleClose}
          setVisibleClose = {setVisibleClose}
          handleDelete = {handleDelete}
        />}

        {visibleAdd && <AddCashRegister
            visibleAdd = {visibleAdd}
            setVisibleAdd = {setVisibleAdd} 
            cashRegisterSelect = {cashRegisterSelect}
            setCashRegisterSelect = {setCashRegisterSelect}
            add = {add}
            handleAddCashRegister = {handleAddCashRegister}
            handleChange = {handleChange}
        />}
                  
        </RootLayout>
    );
}