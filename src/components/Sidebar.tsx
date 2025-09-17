import { Link, useLocation } from "react-router-dom";

const navItems = [
  { name: "Dashboard", icon: "🏠", path: "/dashboard" },
  { name: "Facturas",  icon: "📄", path: "/facturas" },
  { name: "Clientes",  icon: "👥", path: "/clientes" },
  { name: "Inventario",icon: "📦", path: "/product" },
  { name: "Impuestos", icon: "💰", path: "/impuestos" },
];

const isActivePath = (current: string, target: string) =>
  current === target || (target !== "/" && current.startsWith(target));

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside
      className="
        w-64 bg-white border-r h-screen sticky top-0
        flex flex-col justify-between
      "
    >
      <div className="p-4">
        <div className="flex items-center space-x-2 px-2 mb-3">
          <div className="h-9 w-9 rounded-full bg-gray-200 grid place-items-center text-xs">
            LOGO
          </div>
          <span className="text-lg font-semibold text-gray-800">LOGO</span>
        </div>

        <nav className="mt-2 space-y-1">
          {navItems.map((item) => {
            const active = isActivePath(location.pathname, item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                aria-current={active ? "page" : undefined}
                className={[
                  "group flex items-center gap-3 px-3 py-2 rounded-lg mx-2",
                  "transition-colors select-none",
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100",
                ].join(" ")}
              >
                <span className="text-xl leading-none">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto">
        <div className="border-t" />
        <Link
          to="/ajustes"
          className={[
            "flex items-center gap-3 px-3 py-2 rounded-lg mx-2 my-3",
            "transition-colors text-gray-700 hover:bg-gray-100",
            isActivePath(location.pathname, "/ajustes")
              ? "bg-blue-600 text-white shadow-sm"
              : "",
          ].join(" ")}
        >
          <span className="text-xl leading-none">⚙️</span>
          <span className="font-medium">Ajustes</span>
        </Link>
      </div>
    </aside>
  );
};