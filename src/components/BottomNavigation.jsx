import { NavLink } from "react-router-dom";
import { Home, Search, Package, ShoppingCart, User, Cog } from "lucide-react";
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg md:hidden">
      <div className="grid grid-cols-5 h-16">
        {menus.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center transition-colors ${
                  isActive ? "text-green-600" : "text-gray-500"
                }`
              }
            >
              <Icon size={22} />
              <span className="text-[11px] mt-1">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
