import { RootLayout } from "../../../_Layouts/RootLayout";
import { useCashRegister } from "../hooks/useCashRegister";
import ContentLoader from 'react-content-loader'
import InfoCashRegister from "../components/infoCashRegister";
import AddCashRegister from "../components/addCashRegister";
import Pagination from "../../../components/pagination";
import { getRoleAuth } from "../../../utils/getRoleAuth";
import { getNameAuth } from "../../../utils/getNameAuth";
import logo2 from "../../../components/utils/logo2.svg";
import ConfirmationAddCashRegister from "../components/confirmationAddCashRegister";
import ConfirmationCloseCashRegister from "../components/confirmationCloseCashRegister";
import ConfirmationDeleteCashRegister from "../components/confirmationDeleteCashRegister";
import ConfirmationOpenCashRegister from "../components/confirmationOpenCashRegister";

export const CashRegister = () => {
    
    const {
        cashRegister,
        cashRegisterSelect,
        setCashRegisterSelect,
        loading,
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
        confirmationAddCashRegister, 
        setConfirmationAddCashRegister,
        confirmationCloseCashRegister, 
        setConfirmationCloseCashRegister,
        confirmationDeleteCashRegister, 
        setConfirmationDeleteCashRegister,
        confirmationOpenCashRegister, 
        setConfirmationOpenCashRegister,
        errorMessage, 
        setErrorMessage
    } = useCashRegister();

    const role = getRoleAuth();
    const name = getNameAuth();

    const hasCashRegister = currentCashRegister.some(
        (item) => item.user?.name === name
    );

    
    const filteredCashRegisters =
    role === "employee"
        ? currentCashRegister.filter(
            (item) => item.user?.name === name
        )
        : currentCashRegister;

    const CashRegisterLoader = () => (
        <ContentLoader
            speed={2}
            foregroundColor="#ecebeb"
            className="w-full h-19 sm:h-29 md:h-34 2xl:h-38 bg-white rounded-xl pb-4 shadow">
            <rect x="20" y="20" rx="4" ry="4" width="60" height="10" />
            <rect x="20" y="45" rx="4" ry="4" width="40" height="10" />
        </ContentLoader>
    );

    return(
        <RootLayout search={search} setSearch={setSearch}>
            <div className="w-40 flex-shrink-0 flex-grow-0 sm:w-50 md:w-60 2xl:min-w-1/5 bg-[#E9EEF0] flex-col">
                <div className="flex justify-between items-center mt-0 ml-0 sm:mt-2 sm:ml-2 md:mt-4 md:ml-4 2xl:mt-8 2xl:ml-8">
                    <h2 className="font-Lato text-xs sm:text-sm md:text-base xl:text-base 2xl:text-2xl pl-2 pt-2 sm:pl-0 sm:pt-0 ">Lista de Cajas</h2>
                    <button disabled={role === "employee" && hasCashRegister}
                    className={`font-bold mr-0.5 sm:mr-2 py-1 xl:py-2 rounded-3xl px-2 md:px-3 w-auto xl:w-[94px] text-xs sm:text-sm md:text-base font-Lato transition duration-300 border ml-2 mt-2 sm:ml-0 sm:mt-0
                    ${
                        visibleAdd == true
                        ? "bg-gray3 text-gray1 border-gray2 "
                        : "bg-blue-500 text-white border-blue-500 hover:bg-blue-800 hover:border-blue-800"
                    }

                    ${
                        role === "employee" && hasCashRegister
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }
                        
                    `}
                    onClick={() => {
                    setConfirmationAddCashRegister(false);
                    setConfirmationCloseCashRegister(false);
                    setConfirmationDeleteCashRegister(false);
                    setConfirmationOpenCashRegister(false);
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

            <div className="w-full h-100 lg:h-120 flex flex-col overflow-y-auto mt-2 md:mt-4">
                <div className="space-y-2">
                {loading ? (
                    [...Array(4)].map((_, index) => (
                    <div key={index} className="w-full pl-2 2xl:pl-8 pr-4 2xl:pr-11 flex">
                        <CashRegisterLoader />
                    </div>
                    ))
                ) : filteredCashRegisters.length > 0 ? (
                    filteredCashRegisters.map((items) => (
                    <div key={items.id} className="w-full pl-2 2xl:pl-8 pr-4 2xl:pr-11 flex">
                        <div
                        className={`cursor-pointer w-full h-auto rounded-xl pb-4 font-lato text-black text-base shadow transition duration-150 delay-75 
                        ${
                            cashRegisterSelect?.id === items.id
                            ? "bg-blue-500 text-white hover:bg-blue-800"
                            : "bg-white text-black hover:bg-gray-200"
                        }`}
                        onClick={() => {
                            setCashRegisterSelect(items);
                            setVisibleEdit(true);
                            setVisibleAdd(false);
                            setConfirmationAddCashRegister(false);
                            setConfirmationCloseCashRegister(false);
                            setConfirmationDeleteCashRegister(false);
                            setConfirmationOpenCashRegister(false);
                        }}
                        >
                        <h2 className="w-full ml-2 md:ml-4 mt-2 md:mt-4 font-medium text-xs sm:text-sm 2xl:text-base">
                            Caja {items.id}
                        </h2>
                        <h3 className="w-full ml-2 md:ml-4 font-medium text-xs sm:text-sm 2xl:text-base opacity-80">
                            {items.user?.name || "Sin empleado"}
                        </h3>
                        <h4 className="mt-1 ml-2 md:ml-4 text-xs sm:text-sm 2xl:text-base font-medium opacity-80">
                            {new Intl.NumberFormat("es-CR", {
                            style: "currency",
                            currency: "CRC",
                            }).format(items.opening_amount)}
                        </h4>
                        <h5 className="hidden mt-2 md:mt-5 justify-end w-full sm:flex pr-2 md:pr-4 text-xs sm:text-sm 2xl:text-base">
                            {items.status === "open" ? "Abierta" : "Cerrada"}
                        </h5>
                        </div>
                    </div>
                    ))
                ) : (
                    <p className="ml-2 md:ml-4 2xl:ml-8 font-Lato font-medium text-[10px] sm:text-xs md:text-base xl:text-base text-gray1">
                    No tienes cajas asignadas.
                    </p>
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
            <h2 className={`ml-2 md:ml-4 2xl:ml-8 mt-4 font-Lato font-medium text-xs md:text-base xl:text-base text-gray1
                ${getRoleAuth() === "employee" ? "hidden": "inline"}
                `}>
            Hay {cashRegister.length} cajas registradas
            </h2>
      </div>        
    
        {!(visibleEdit || visibleAdd || confirmationAddCashRegister || confirmationCloseCashRegister || confirmationDeleteCashRegister || confirmationOpenCashRegister) && (
          <div className="flex w-full items-center justify-center bg-[#DEE8ED]">
            <img src={logo2} alt="Logo" className="opacity-20 w-40 sm:w-56 md:w-72 2xl:w-96 select-none pointer-events-none" />
          </div>
        )}

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

        {confirmationAddCashRegister && 
        <ConfirmationAddCashRegister/>}
        
        {confirmationCloseCashRegister && 
        <ConfirmationCloseCashRegister/>}
        
        {confirmationDeleteCashRegister && 
        <ConfirmationDeleteCashRegister/>}

        {confirmationOpenCashRegister && 
        <ConfirmationOpenCashRegister/>}

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