export default function confirmationDeleteCashRegister() {

    return(
        <div className="flex relative w-[70%]  justify-center items-center flex-col">
            <div className="bg-white w-auto h-48 -translate-y-20 px-11 items-center rounded-2xl shadow">
                <div className="h-full items-center flex-col flex justify-center w-full">
                    <div className="w-full justify-center flex mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-12 stroke-red-500">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <h2 className="w-full text-2xl font-Lato font-medium">Caja Eliminada</h2>
                    <h3 className="w-full text-2xl font-Lato font-medium text-center">Correctamente</h3>
                </div>       
            </div>
        </div>
    )
}
