import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Clock,
  ArrowLeft,
  Calendar,
  User,
  Phone,
  IndianRupee,
  Download,
  Share2,
  AlertCircle,
} from "lucide-react";

const ProductTracking = () => {
  const { orderId, productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData = {
        order: {
          id: orderId,
          date: "18 May, 2026",
        },
        product: {
          id: parseInt(productId),
          name:
            productId === "1"
              ? "Air Filter Element"
              : productId === "2"
                ? "Oil Filter"
                : "Clutch Plate",
          brand:
            productId === "1"
              ? "Massey Ferguson"
              : productId === "2"
                ? "Mahindra"
                : "Swaraj",
          price: productId === "1" ? 450 : productId === "2" ? 350 : 1850,
          quantity: productId === "1" ? 2 : 1,
          image: "https://picsum.photos/id/103/100/100",
          sku:
            productId === "1"
              ? "MF-AF-101"
              : productId === "2"
                ? "MH-OF-202"
                : "SW-CP-303",
        },
        tracking: {
          status:
            productId === "1"
              ? "Delivered"
              : productId === "2"
                ? "In Transit"
                : "Processing",
          trackingNumber:
            productId === "1"
              ? "EL987654321IN"
              : productId === "2"
                ? "EL987654322IN"
                : "EL987654323IN",
          carrier: "Express Logistics",
          estimated:
            productId === "1"
              ? "20 May, 2026"
              : productId === "2"
                ? "22 May, 2026"
                : "25 May, 2026",
          currentLocation:
            productId === "1"
              ? "Delivered"
              : productId === "2"
                ? "Mumbai Hub"
                : "Warehouse",
          deliveredDate: productId === "1" ? "20 May, 2026" : null,
          steps:
            productId === "1"
              ? [
                  {
                    status: "Order Placed",
                    date: "18 May, 10:30 AM",
                    location: "Online",
                    completed: true,
                  },
                  {
                    status: "Order Confirmed",
                    date: "18 May, 11:45 AM",
                    location: "Warehouse",
                    completed: true,
                  },
                  {
                    status: "Packed",
                    date: "19 May, 1:00 PM",
                    location: "Mumbai Warehouse",
                    completed: true,
                  },
                  {
                    status: "Shipped",
                    date: "19 May, 3:00 PM",
                    location: "Mumbai Hub",
                    completed: true,
                  },
                  {
                    status: "In Transit",
                    date: "19 May, 8:00 PM",
                    location: "Pune Hub",
                    completed: true,
                  },
                  {
                    status: "Out for Delivery",
                    date: "20 May, 9:00 AM",
                    location: "Local Center",
                    completed: true,
                  },
                  {
                    status: "Delivered",
                    date: "20 May, 3:30 PM",
                    location: "Your Address",
                    completed: true,
                    current: true,
                  },
                ]
              : productId === "2"
                ? [
                    {
                      status: "Order Placed",
                      date: "18 May, 10:30 AM",
                      location: "Online",
                      completed: true,
                    },
                    {
                      status: "Order Confirmed",
                      date: "18 May, 11:45 AM",
                      location: "Warehouse",
                      completed: true,
                    },
                    {
                      status: "Packed",
                      date: "19 May, 3:00 PM",
                      location: "Mumbai Warehouse",
                      completed: true,
                    },
                    {
                      status: "Shipped",
                      date: "19 May, 6:00 PM",
                      location: "Mumbai Hub",
                      completed: true,
                    },
                    {
                      status: "In Transit",
                      date: "20 May, 8:00 AM",
                      location: "Delhi Hub",
                      completed: true,
                      current: true,
                    },
                    {
                      status: "Out for Delivery",
                      date: "Pending",
                      location: "Pending",
                      completed: false,
                    },
                    {
                      status: "Delivered",
                      date: "Pending",
                      location: "Pending",
                      completed: false,
                    },
                  ]
                : [
                    {
                      status: "Order Placed",
                      date: "18 May, 10:30 AM",
                      location: "Online",
                      completed: true,
                    },
                    {
                      status: "Order Confirmed",
                      date: "18 May, 11:45 AM",
                      location: "Warehouse",
                      completed: true,
                    },
                    {
                      status: "Processing",
                      date: "19 May, 10:00 AM",
                      location: "Warehouse",
                      completed: true,
                      current: true,
                    },
                    {
                      status: "Packed",
                      date: "Pending",
                      location: "Pending",
                      completed: false,
                    },
                    {
                      status: "Shipped",
                      date: "Pending",
                      location: "Pending",
                      completed: false,
                    },
                    {
                      status: "Delivered",
                      date: "Pending",
                      location: "Pending",
                      completed: false,
                    },
                  ],
        },
        shippingAddress: {
          name: "Ramesh Kumar",
          address: "123, Green Field Colony, Near Bus Stand",
          city: "Ludhiana",
          state: "Punjab",
          pincode: "141001",
          phone: "+91 98765 43210",
        },
      };
      setProductData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [orderId, productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading tracking details...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      Delivered: "text-green-600",
      "In Transit": "text-blue-600",
      Processing: "text-yellow-600",
      "Out for Delivery": "text-orange-600",
    };
    return colors[status] || "text-gray-600";
  };

  return (
    <div className="min-h-screen lg:mt-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 sticky top-0 z-10">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-10">
          <div className="flex items-center gap-4">
            <Link
              to="/orders"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                Track  <span className="text-transparent bg-clip-text bg-green-600">
                  
                  Your Product
                  </span> 
              </h1>
              <p className="text-sm text-gray-500">
                Order #{productData.order.id} • {productData.product.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-10">
        {/* Product Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={productData.product.image}
                alt={productData.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {productData.product.name}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    {productData.product.brand}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    SKU: {productData.product.sku}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{productData.product.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {productData.product.quantity}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Status Banner */}
        <div
          className={`rounded-2xl p-6 mb-6 border ${
            productData.tracking.status === "Delivered"
              ? "bg-green-50 border-green-200"
              : productData.tracking.status === "In Transit"
                ? "bg-blue-50 border-blue-200"
                : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {productData.tracking.status === "Delivered" ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : productData.tracking.status === "In Transit" ? (
                  <Truck className="h-6 w-6 text-blue-600" />
                ) : (
                  <Package className="h-6 w-6 text-yellow-600" />
                )}
                <span
                  className={`font-semibold ${getStatusColor(productData.tracking.status)}`}
                >
                  {productData.tracking.status}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {productData.tracking.status === "Delivered"
                  ? "Package Delivered"
                  : productData.tracking.status === "In Transit"
                    ? "Package In Transit"
                    : "Package Being Processed"}
              </h3>
              <p className="text-gray-600 mt-1">
                {productData.tracking.status === "Delivered"
                  ? `Delivered on ${productData.tracking.deliveredDate}`
                  : `Expected delivery by ${productData.tracking.estimated}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Current Location</p>
              <p className="font-semibold text-gray-900">
                {productData.tracking.currentLocation}
              </p>
              <button className="mt-2 flex items-center gap-1 text-sm text-green-600 hover:text-green-700 ml-auto">
                <Share2 className="h-4 w-4" />
                Share Tracking
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tracking Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                Tracking History
              </h3>

              {/* Carrier Info */}
              <div className="mb-6 p-3 bg-gray-50 rounded-xl text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Carrier:</span>
                  <span className="font-medium">
                    {productData.tracking.carrier}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tracking Number:</span>
                  <span className="font-medium">
                    {productData.tracking.trackingNumber}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

                {productData.tracking.steps.map((step, index) => (
                  <div
                    key={index}
                    className="relative flex gap-4 pb-8 last:pb-0"
                  >
                    <div className="relative z-10">
                      <div
                        className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${step.completed ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}
                        ${step.current ? "ring-4 ring-green-100" : ""}
                      `}
                      >
                        {step.status === "Delivered" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : step.status.includes("Transit") ||
                          step.status === "Shipped" ? (
                          <Truck className="h-4 w-4" />
                        ) : (
                          <Package className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-semibold ${step.completed ? "text-gray-900" : "text-gray-400"}`}
                      >
                        {step.status}
                      </p>
                      {step.date !== "Pending" ? (
                        <>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {step.date}
                          </p>
                          {step.location && (
                            <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {step.location}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-gray-400 italic mt-0.5">
                          Pending
                        </p>
                      )}
                      {step.current && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-xs text-green-600 font-medium">
                            Latest Update
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Shipping Info & Support */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Shipping Address
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">
                    {productData.shippingAddress.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-900">
                    {productData.shippingAddress.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm text-gray-900">
                    {productData.shippingAddress.address}
                    <br />
                    {productData.shippingAddress.city},{" "}
                    {productData.shippingAddress.state}
                    <br />
                    {productData.shippingAddress.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Order Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID</span>
                  <span className="font-medium">{productData.order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Order Date</span>
                  <span className="font-medium">{productData.order.date}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-gray-500">Item Total</span>
                  <span className="font-semibold">
                    ₹
                    {(
                      productData.product.price * productData.product.quantity
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <button className="w-full cursor-pointer px-4 py-2.5 text-sm font-semibold text-green-600 border border-green-200 rounded-xl hover:bg-green-50 transition-colors">
                  Report Issue with Delivery
                </button>
                <Link to="/contact">
                <button className="w-full cursor-pointer px-4 py-2.5 text-sm font-semibold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                  Contact Support
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTracking;
