import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Service from "./pages/Service";
import Help from "./pages/Help";
// import TrackOrder from "./pages/ProductTracking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { WishlistProvider } from "./context/WishlistContext";
import Wishlist from "./pages/Wishlist";
import SpareParts from "./pages/SpareParts";
import SubSubCategory  from "./pages/SubsubCategory.jsx";
import SubCategoryPage from "./pages/SubCategoryPage";
import TractorCompare from "./pages/TractorCompare";
import TractorDetail from "./pages/TractorDetail";
import UsedTractorDetails from "./pages/usedTractorDetail.jsx";
import NewTractors from "./pages/NewTractors";
import OldTractors from "./pages/OldTractors";
import Orders from "./pages/Orders";
import ProductTracking from "./pages/ProductTracking";
import TractorList from "./pages/TractorList";
import BookingService from "./pages/BookingService";
import Profile from "./pages/Profile";
import BookingHistory from "./pages/BookingHistory";
import { Toaster } from "react-hot-toast";
import AllCategories from "./pages/AllCategories";
import BecomeVendor from "./pages/BecomeVendor";
import VendorProfile from "./pages/VendorProfile";
import VendorLogin from "./pages/VendorLogin";
import WebsiteVariant from "./pages/websitevariant/index.jsx";
import VendorFollowup from "./pages/Vendorfollowup.jsx";
// import { requestNotificationPermission } from "./firebase-messaging";
import UsedWebsiteVariant from "./pages/usedwebsitevariant/index.jsx";
import BottomNavigation from "./components/BottomNavigation.jsx";
import splashImage from "./assets/app-assets/splash.png";
import CategoryDetail from "./pages/CategoryDetail";
import Equipment from "./pages/Equipments.jsx";
import EquipmentDetails from "./pages/EquipmentDetails.jsx";
import AllBrands from "./pages/AllBrands";
// ...

function App() {
  const [showSplash, setShowSplash] = useState(false);

  // Effect 1: hide native splash immediately, nothing else runs before this
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      SplashScreen.hide().catch(() => {});
    }
  }, []);

  // Effect 2: show your own full-screen splash overlay + notifications
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    setShowSplash(true);

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 999999,
            backgroundColor: "#ffffff",
          }}
        >
          <img
            src={splashImage}
            alt="KrushiMall"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

     <Router basename={Capacitor.isNativePlatform() ? "/" : "/krushimall/"}>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            <WishlistProvider>
              <Toaster
                position="top-right"
                containerStyle={{
                  top: 120, // Adjust according to your navbar height
                }}
                toastOptions={{
                  duration: 3000,
                }}
              />
              <div className="min-h-screen flex flex-col ">
                <Navbar />

                <div className="h-16 md:h-20 "></div>
                <main className="flex-1">
                  <Routes>
                    {/* Main Pages */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/tractor/:id" element={<TractorDetail />} />
                    <Route
                      path="/used-tractor/:id"
                      element={<UsedTractorDetails />}
                    />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="service" element={<Service />} />
                    <Route path="booking" element={<BookingService />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/become-vendor" element={<BecomeVendor />} />
                    <Route path="/vendor-profile" element={<VendorProfile />} />
                    <Route path="/vendor-login" element={<VendorLogin />} />
                    <Route
                      path="/vendor/followup/:id"
                      element={<VendorFollowup />}
                    />
                    <Route path="/category/:id" element={<CategoryDetail />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route
                      path="/vendor/add-product"
                      element={<WebsiteVariant />}
                    />
                    <Route
                      path="/vendor/edit-product/:id"
                      element={<WebsiteVariant />}
                    />
                    <Route
                      path="/vendor/add-used-product"
                      element={<UsedWebsiteVariant />}
                    />

                    <Route
                      path="/vendor/edit-used-product/:id"
                      element={<UsedWebsiteVariant />}
                    />
                    <Route path="/help" element={<Help />} />
                    <Route
                      path="/booking-history"
                      element={<BookingHistory />}
                    />
                    <Route
                      path="/tractorcompare"
                      element={<TractorCompare />}
                    />
                    <Route path="/orders" element={<Orders />} />
                    <Route
                      path="/track-product/:orderId/:productId"
                      element={<ProductTracking />}
                    />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/spare-parts" element={<SpareParts />} />
                    <Route path="/categories" element={<AllCategories />} />
                    <Route path="/equipment" element={<Equipment />} />
                    <Route path="/equipment/:id" element={<EquipmentDetails />} />
                    <Route path="/all-brands" element={<AllBrands />} />
                    <Route path="/tractors" element={<TractorList />} />
                    <Route path="/new-tractors" element={<NewTractors />} />
                    <Route path="/old-tractors" element={<OldTractors />} />

                    <Route
                      path="/subsubcategory/:subCategoryName"
                      element={<SubSubCategory  />}
                    />
                    <Route
                      path="/category/:subCategoryName"
                      element={<SubCategoryPage />}
                    />

                    {/* Categories */}
                    <Route
                      path="/categories/engine"
                      element={
                        <div className="p-10 text-3xl font-bold text-white">
                          Engine Parts
                        </div>
                      }
                    />
                    <Route
                      path="/categories/brakes"
                      element={
                        <div className="p-10 text-3xl font-bold text-white">
                          Brakes & Suspension
                        </div>
                      }
                    />
                    <Route
                      path="/categories/transmission"
                      element={
                        <div className="p-10 text-3xl font-bold text-white">
                          Transmission
                        </div>
                      }
                    />
                    <Route
                      path="/categories/electricals"
                      element={
                        <div className="p-10 text-3xl font-bold text-white">
                          Electricals
                        </div>
                      }
                    />
                    <Route
                      path="/categories/body"
                      element={
                        <div className="p-10 text-3xl font-bold text-white">
                          Body Parts
                        </div>
                      }
                    />
                    <Route
                      path="/categories/oils"
                      element={
                        <div className="p-10 text-3xl font-bold text-white">
                          Oils & Fluids
                        </div>
                      }
                    />
                    <Route
                      path="/categories/exhaust"
                      element={
                        <div className="p-10 text-3xl font-bold text-white">
                          Exhaust System
                        </div>
                      }
                    />
                    <Route
                      path="/categories/cooling"
                      element={
                        <div className="p-10 text-3xl font-bold text-white">
                          Cooling System
                        </div>
                      }
                    />

                    {/* Car Makers */}
                    <Route
                      path="/makers/maruti-suzuki"
                      element={
                        <div className="p-10 text-3xl font-bold">
                          Maruti Suzuki
                        </div>
                      }
                    />
                    <Route
                      path="/makers/hyundai"
                      element={
                        <div className="p-10 text-3xl font-bold">Hyundai</div>
                      }
                    />
                    <Route
                      path="/makers/tata"
                      element={
                        <div className="p-10 text-3xl font-bold">
                          Tata Motors
                        </div>
                      }
                    />
                    <Route
                      path="/makers/mahindra"
                      element={
                        <div className="p-10 text-3xl font-bold">Mahindra</div>
                      }
                    />
                    <Route
                      path="/makers/toyota"
                      element={
                        <div className="p-10 text-3xl font-bold">Toyota</div>
                      }
                    />
                    <Route
                      path="/makers/honda"
                      element={
                        <div className="p-10 text-3xl font-bold">Honda</div>
                      }
                    />
                    <Route
                      path="/makers"
                      element={
                        <div className="p-10 text-3xl font-bold">
                          All Makers
                        </div>
                      }
                    />
                  </Routes>
                </main>

                <Footer />

                <BottomNavigation />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
