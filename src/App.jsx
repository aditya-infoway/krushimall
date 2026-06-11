import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Service from "./pages/Service";
import Help from "./pages/Help";
import TrackOrder from "./pages/ProductTracking";
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
import CategoryPage from "./pages/CategoryPage";
import SubCategoryPage from "./pages/SubCategoryPage";
import TractorCompare from "./pages/TractorCompare";
import TractorDetail from "./pages/TractorDetail";
import NewTractors from "./pages/NewTractors";
import OldTractors from "./pages/OldTractors";
import Orders from "./pages/Orders";
import ProductTracking from "./pages/ProductTracking";
import TractorList from "./pages/TractorList";
import BookingService from "./pages/BookingService";
import Profile from "./pages/Profile";
import BookingHistory from "./pages/BookingHistory";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <WishlistProvider>
            <Toaster
              position="bottom-right"
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
                  <Route path="/contact" element={<Contact />} />
                  <Route path="service" element={<Service />} />
                  <Route path="booking" element={<BookingService />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/booking-history" element={<BookingHistory />} />
                  <Route path="/tractorcompare" element={<TractorCompare />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route
                    path="/track-product/:orderId/:productId"
                    element={<ProductTracking />}
                  />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/spare-parts" element={<SpareParts />} />
                  <Route path="/tractors" element={<TractorList />} />
                  <Route path="/new-tractors" element={<NewTractors />} />
                  <Route path="/old-tractors" element={<OldTractors />} />

                  <Route
                    path="/category/:categoryName"
                    element={<CategoryPage />}
                  />
                  <Route
                    path="/category/:categoryName/:subCategoryName"
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
                      <div className="p-10 text-3xl font-bold">Tata Motors</div>
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
                      <div className="p-10 text-3xl font-bold">All Makers</div>
                    }
                  />
                </Routes>
              </main>

              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
