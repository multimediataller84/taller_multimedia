import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getRoleAuth } from "../utils/getRoleAuth";

const navItems = [
  { name: "Dashboard", icon: "", path: "/dashboard", visibility: "admin" },
  { name: "Facturas", icon: "", path: "/invoices", visibility: "all" },
  { name: "Clientes", icon: "", path: "/clients", visibility: "all" },
  { name: "Inventario", icon: "", path: "/product", visibility: "all" },
  { name: "Impuestos", icon: "", path: "/taxes", visibility: "admin"},
  { name: "Perfiles", icon: "", path: "/profiles", visibility: "admin"}
];

export const Sidebar = () => {
  const location = useLocation();

  const role = getRoleAuth();
  const filterItems = (role !== "admin") ? navItems.filter((i) => i.visibility !== "admin") : navItems

  return (

    <div className="w-[10%] bg-white flex flex-col justify-between h-screen" >

      <div>
        <div className="ml-4">
          <nav className="mt-4 flex flex-col space-y-1">
            {filterItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-5 py-2.5 rounded-3xl transition-colors self-start hover:text-white
                ${
                  location.pathname === item.path
                    ? "bg-blue-500 text-white "
                    : "hover:bg-blue-500"
                }`}
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
