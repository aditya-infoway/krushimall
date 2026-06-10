// src/context/WishlistContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [showWishlistToast, setShowWishlistToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Load wishlist from localStorage when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isAuthenticated, user]);

  const addToWishlist = (product) => {
    setWishlistItems(prev => {
      // Check if product already exists
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        setToastMessage(`${product.name} is already in your wishlist!`);
        setShowWishlistToast(true);
        setTimeout(() => setShowWishlistToast(false), 3000);
        return prev;
      }
      
      setToastMessage(`${product.name} added to wishlist!`);
      setShowWishlistToast(true);
      setTimeout(() => setShowWishlistToast(false), 3000);
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => {
      const removedProduct = prev.find(item => item.id === productId);
      if (removedProduct) {
        setToastMessage(`${removedProduct.name} removed from wishlist!`);
        setShowWishlistToast(true);
        setTimeout(() => setShowWishlistToast(false), 3000);
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    setToastMessage('Wishlist cleared!');
    setShowWishlistToast(true);
    setTimeout(() => setShowWishlistToast(false), 3000);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    wishlistCount: wishlistItems.length,
    showWishlistToast,
    toastMessage,
    setShowWishlistToast
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};