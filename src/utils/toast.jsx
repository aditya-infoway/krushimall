import toast from 'react-hot-toast';
import { ShoppingCart, Heart, Trash2, Package, Lock, CheckCircle, X } from 'lucide-react';

// Common animation wrapper
const ToastWrapper = ({ t, children, borderColor, closeColor }) => (
  <div
    className={`${
      t.visible ? 'animate-slide-up' : 'animate-slide-down'
    } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 ${borderColor}`}
  >
    {children}
    <div className="flex border-l border-gray-100">
      <button
        onClick={() => toast.dismiss(t.id)}
        className={`w-full border border-transparent rounded-none rounded-r-2xl px-4 flex items-center justify-center text-lg font-medium ${closeColor}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  </div>
);


const IconBox = ({ bg, icon, iconColor }) => (
  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
    {icon}
  </div>
);

// Cart toasts
export const showCartAddedToast = (productName) => {
  toast.custom((t) => (
    <ToastWrapper t={t} borderColor="border-green-200" closeColor="text-green-500 hover:text-green-600 hover:bg-green-50">
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start gap-3">
          <IconBox bg="bg-green-100" icon={<ShoppingCart className="h-5 w-5 text-green-600" />} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">Added to Cart!</p>
            <p className="mt-1 text-xs text-gray-500 truncate">{productName}</p>
          </div>
        </div>
      </div>
    </ToastWrapper>
  ), {
    duration: 3000,
    position: 'bottom-right',
  });
};

export const showWishlistAddedToast = (productName) => {
  toast.custom((t) => (
    <ToastWrapper t={t} borderColor="border-red-200" closeColor="text-red-400 hover:text-red-500 hover:bg-red-50">
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start gap-3">
          <IconBox bg="bg-red-50" icon={<Heart className="h-5 w-5 text-red-500 fill-red-500" />} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">Added to Wishlist!</p>
            <p className="mt-1 text-xs text-gray-500 truncate">{productName}</p>
          </div>
        </div>
      </div>
    </ToastWrapper>
  ), {
    duration: 3000,
    position: 'bottom-right',
  });
};

export const showWishlistRemovedToast = (productName) => {
  toast.custom((t) => (
    <ToastWrapper t={t} borderColor="border-gray-200" closeColor="text-gray-400 hover:text-gray-600 hover:bg-gray-50">
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start gap-3">
          <IconBox bg="bg-gray-100" icon={<Heart className="h-5 w-5 text-gray-400" />} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">Removed from Wishlist</p>
            <p className="mt-1 text-xs text-gray-500 truncate">{productName}</p>
          </div>
        </div>
      </div>
    </ToastWrapper>
  ), {
    duration: 3000,
    position: 'bottom-right',
  });
};

export const showCartRemovedToast = (productName) => {
  toast.custom((t) => (
    <ToastWrapper t={t} borderColor="border-gray-200" closeColor="text-gray-400 hover:text-gray-600 hover:bg-gray-50">
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start gap-3">
          <IconBox bg="bg-gray-100" icon={<Trash2 className="h-5 w-5 text-gray-500" />} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">Removed from Cart</p>
            <p className="mt-1 text-xs text-gray-500 truncate">{productName}</p>
          </div>
        </div>
      </div>
    </ToastWrapper>
  ), {
    duration: 3000,
    position: 'bottom-right',
  });
};

export const showOrderPlacedToast = (orderId) => {
  toast.custom((t) => (
    <ToastWrapper t={t} borderColor="border-green-200" closeColor="text-green-500 hover:text-green-600 hover:bg-green-50">
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start gap-3">
          <IconBox bg="bg-green-100" icon={<Package className="h-5 w-5 text-green-600" />} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">Order Placed!</p>
            <p className="mt-1 text-xs text-gray-500">Order #{orderId} confirmed successfully</p>
          </div>
        </div>
      </div>
    </ToastWrapper>
  ), {
    duration: 5000,
    position: 'bottom-right',
  });
};

export const showLoginRequiredToast = () => {
  toast.custom((t) => (
    <ToastWrapper t={t} borderColor="border-amber-200" closeColor="text-amber-500 hover:text-amber-600 hover:bg-amber-50">
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start gap-3">
          <IconBox bg="bg-amber-100" icon={<Lock className="h-5 w-5 text-amber-600" />} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">Login Required</p>
            <p className="mt-1 text-xs text-gray-500">Please login to continue</p>
          </div>
        </div>
      </div>
    </ToastWrapper>
  ), {
    duration: 4000,
    position: 'bottom-right',
  });
};

export const showSuccessToast = (message) => {
  toast.custom((t) => (
    <ToastWrapper t={t} borderColor="border-green-200" closeColor="text-green-500 hover:text-green-600 hover:bg-green-50">
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start gap-3">
          <IconBox bg="bg-green-100" icon={<CheckCircle className="h-5 w-5 text-green-600" />} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">Success!</p>
            <p className="mt-1 text-xs text-gray-500">{message}</p>
          </div>
        </div>
      </div>
    </ToastWrapper>
  ), {
    duration: 3000,
    position: 'bottom-right',
  });
};