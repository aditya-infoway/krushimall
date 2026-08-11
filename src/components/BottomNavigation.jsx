import { NavLink } from "react-router-dom";
import { Home, Package, User, Cog } from "lucide-react";
import { GiFarmTractor } from "react-icons/gi";

const menus = [
  {
    name: "Home",
    icon: Home,
    path: "/",
  },
  {
    name: "Tractor",
    icon: GiFarmTractor,
    path: "/new-tractors",
  },
  {
    name: "All products",
    icon: Package,
    path: "/products",
  },
  {
    name: "Spare Parts",
    icon: Cog,
    path: "/spare-parts",
  },
  {
    name: "Profile",
    icon: User,
    path: "/profile",
  },
];

export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 md:hidden bg-green-600 rounded-4xl shadow-2xl overflow-hidden">
      <div className="grid grid-cols-5 h-16 p-1">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center rounded-3xl transition-all duration-200 ${
                  isActive
                    ? "bg-white text-green-600"
                    : "text-white hover:bg-green-500/50"
                }`
              }
            >
              <Icon size={20} strokeWidth={2} />

              <span className="text-[10px] mt-1 whitespace-nowrap">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}