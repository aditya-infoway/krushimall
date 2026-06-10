// src/pages/Wishlist.jsx
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { showCartAddedToast, showWishlistRemovedToast, showSuccessToast } from "../utils/toast";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

 const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/wishlist");
      return;
    }
    addToCart(product, 1);
    removeFromWishlist(product.id);
    showCartAddedToast(product.name); // <-- Triggers your custom cart toast
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-600 mb-6">
            Save items you love to your wishlist
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-2 lg:py-8  md:pt-20 lg:pt-28 ">
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">My  <span className="text-transparent bg-clip-text bg-green-600">

               Wishlist
               </span>
               </h1>
            <p className="text-gray-600 mt-1">
              {wishlistItems.length} items saved
            </p>
          </div>
          <button
           onClick={() => {
    clearWishlist();
    showSuccessToast("Wishlist cleared completely"); 
  }}
            
            className="cursor-pointer text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Wishlist
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <Link to={`/product/${product.id}`}>
                <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>

              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">
                  {product.brand} • {product.partNumber}
                </div>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-medium text-gray-900 hover:text-green-600 transition-colors mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-end gap-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 cursor-pointer bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                  <button
                   onClick={() => {
    removeFromWishlist(product.id);
    showWishlistRemovedToast(product.name); 
  }}
                    className="p-2.5 cursor-pointer border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Remove from Wishlist"
                  >
                    <Heart className="h-4 w-4 text-green-500 fill-green-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
