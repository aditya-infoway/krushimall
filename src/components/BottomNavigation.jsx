import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Home, Package, User, Cog } from "lucide-react";
import { GiFarmTractor } from "react-icons/gi";
import { useAuth } from "../context/AuthContext";

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
    protected: true,
  },
];

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [isVendorLoggedIn, setIsVendorLoggedIn] = useState(
    localStorage.getItem("isVendorLoggedIn") === "true",
  );

  useEffect(() => {
    setIsVendorLoggedIn(localStorage.getItem("isVendorLoggedIn") === "true");
  }, [location.pathname, isAuthenticated]);

  useEffect(() => {
    const syncVendorStatus = () => {
      setIsVendorLoggedIn(localStorage.getItem("isVendorLoggedIn") === "true");
    };

    window.addEventListener("vendorAuthChanged", syncVendorStatus);

    return () =>
      window.removeEventListener("vendorAuthChanged", syncVendorStatus);
  }, []);

  const handleProfileClick = (item, e) => {
    if (!item.protected) return;

    e.preventDefault();

    if (isAuthenticated) {
      navigate("/profile");
    } else if (isVendorLoggedIn) {
      navigate("/vendor-profile");
    } else {
      navigate(`/login?redirect=${item.path}`);
    }
  };

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 md:hidden bg-green-600 rounded-4xl shadow-2xl overflow-hidden">
      <div className="grid grid-cols-5 h-16 p-1">
        {menus.map((item) => {
          const Icon = item.icon;

          // Profile tab active hoga: user login -> /profile pe,
          // vendor login -> /vendor-profile pe.
          const isActiveOverride = item.protected
            ? (isAuthenticated && location.pathname === item.path) ||
              (isVendorLoggedIn && location.pathname === "/vendor-profile")
            : null;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={(e) => handleProfileClick(item, e)}
              className={({ isActive }) => {
                const active =
                  isActiveOverride !== null ? isActiveOverride : isActive;

                return `flex flex-col items-center justify-center rounded-3xl transition-all duration-200 ${
                  active
                    ? "bg-white text-green-600"
                    : "text-white hover:bg-green-500/50"
                }`;
              }}
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