import { RootLayout } from "../../../_Layouts/RootLayout";

import { useState } from "react";

export const CashRegister = () => {
    const [search, setSearch] = useState("");

    return(
         <RootLayout search={search} setSearch={setSearch}>
                  

                  
        </RootLayout>
    );
}