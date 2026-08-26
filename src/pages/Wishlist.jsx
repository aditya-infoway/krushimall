// src/pages/Wishlist.jsx
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  Star,
  X,
  Clock,
} from "lucide-react";
import {
  showCartAddedToast,
  showWishlistRemovedToast,
  showSuccessToast,
} from "../utils/toast";

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

    if (product.type === "variant") {
      // Tractor/variant items cart me nahi jaate — enquiry-based flow hai
      return;
    }

    addToCart(product, 1);
    removeFromWishlist(product.id, product.type); // ✅ type add kiya
    showCartAddedToast(product.name);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[80vh] bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Wishlist is empty
          </h2>
          <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
            Explore our collection and save your favorite items here
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-4">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46">
          <div className="flex items-center justify-between py-4 md:py-5">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-lg">
                <Heart className="h-5 w-5 text-green-600 fill-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Wishlist</h1>
                <p className="text-xs text-gray-500">
                  {wishlistItems.length}{" "}
                  {wishlistItems.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                clearWishlist();
                showSuccessToast("Wishlist cleared");
              }}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-6 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {wishlistItems.map((product) => (
            <div
              key={`${product.type}-${product.id}`}
              className="group bg-white rounded-xl border border-gray-200 hover:border-green-400 overflow-hidden transition-all duration-200 hover:shadow-lg"
            >
              {/* Image */}
              <Link
                to={`/product/${product.id}`}
                className="block relative bg-gray-50"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                  />
                </div>

                {/* Quick action overlay */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(product.id, product.type);
                    showWishlistRemovedToast(product.name);
                  }}
                  className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm hover:bg-white hover:shadow transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5 text-gray-500 hover:text-red-500 transition-colors" />
                </button>

                {/* Stock badge */}
                {product.stockStatus && (
                  <span
                    className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                      product.stockStatus === "in_stock"
                        ? "bg-green-100 text-green-700"
                        : product.stockStatus === "limited_stock"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stockStatus === "in_stock" && "In Stock"}
                    {product.stockStatus === "limited_stock" && "Limited"}
                    {product.stockStatus === "out_of_stock" && "Out of Stock"}
                  </span>
                )}
              </Link>

              {/* Content */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">
                      {product.brand}
                    </div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-medium text-gray-800 hover:text-green-600 transition-colors text-sm line-clamp-2 leading-snug">
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                </div>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium text-gray-700 ml-1">
                        {product.rating}
                      </span>
                    </div>
                    {product.reviewCount && (
                      <span className="text-xs text-gray-400">
                        ({product.reviewCount})
                      </span>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Add to Cart */}
                {product.type === "product" && (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
