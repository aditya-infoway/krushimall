import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Listbox } from "@headlessui/react";
import {
  Package,
  Search,
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  IndianRupee,
  Filter,
  ChevronDown,
  // MapPin,
  XCircle,
  AlertCircle,
  X,
  AlertTriangle,
  BadgeAlert,
  BadgeDollarSign,
  Clock3,
  RefreshCcw,
  Ban,
  PackageX,
  Check,
  ImagePlus,
  Plus,
} from "lucide-react";
import apiHelper from "../utils/apiHelper";
import { showErrorToast, showSuccessToast } from "../utils/toast";

// ---------- backend orderStatus -> UI ke original "tracking.status" labels ----------
const STATUS_MAP = {
  PLACED: "Processing",
  SHIPPED: "In Transit",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_ORDER = ["PLACED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

const MAX_CANCEL_IMAGES = 5;

// ---------- backend order -> original mock-data shape adapter ----------
// Backend abhi per-item tracking nahi deta, isliye order ka overall status
// har item pe apply kar rahe hain (jab tak backend per-item status na de).
const buildStepsForItem = (order) => {
  const currentIdx = STATUS_ORDER.indexOf(order.orderStatus);
  const placedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return STATUS_ORDER.map((step, idx) => ({
    status:
      step === "PLACED"
        ? "Order Placed"
        : step === "SHIPPED"
        ? "Shipped"
        : step === "OUT_FOR_DELIVERY"
        ? "Out for Delivery"
        : "Delivered",
    date: idx === 0 ? placedDate : idx <= currentIdx ? "Completed" : "Pending",
    completed: idx <= currentIdx,
    current: idx === currentIdx,
  }));
};

const mapOrderToDisplayOrder = (order) => ({
  id: order.orderNumber,
  date: new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
  total: Number(order.totalAmount),
  paymentStatus: order.paymentStatus === "PAID" ? "Paid" : "Pending",
  status: order.orderStatus,
  items: order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.productName,
    brand: item.partNumber ? `Part #: ${item.partNumber}` : "", // backend brand field nahi bhejta abhi
    price: Number(item.price),
    quantity: item.quantity,
    image: apiHelper.getImageUrl(item.image), // backend abhi order-item pe image save nahi karta -> placeholder aayega
    tracking: {
      status: STATUS_MAP[order.orderStatus] || order.orderStatus,
      trackingNumber: order.orderNumber,
      carrier: "—",
      estimated: order.status === "DELIVERED" ? null : "Update pending",
      currentLocation: STATUS_MAP[order.orderStatus] || order.orderStatus,
      deliveredDate: order.orderStatus === "DELIVERED" ? order.date : null,
      steps: buildStepsForItem(order),
    },
  })),
});

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelDescription, setCancelDescription] = useState("");
  const [cancelImages, setCancelImages] = useState([]); // File[]
  const [cancelImagePreviews, setCancelImagePreviews] = useState([]); // string[] (object URLs)
  const [cancelling, setCancelling] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // ---------- fetch real orders ----------
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiHelper.get("/web/orders/my-orders");
      if (data.success) {
        setOrders(data.orders.map(mapOrderToDisplayOrder));
      }
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // saare object URLs cleanup jab images list change/unmount ho
  useEffect(() => {
    return () => {
      cancelImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [cancelImagePreviews]);

  const cancelReasons = [
    { id: "1", label: "Product quality issue", icon: BadgeAlert },
    {
      id: "2",
      label: "Better price available elsewhere",
      icon: BadgeDollarSign,
    },
    { id: "3", label: "Product arrived late", icon: Clock3 },
    { id: "4", label: "Changed my mind", icon: RefreshCcw },
    { id: "5", label: "Accidental order", icon: Ban },
    { id: "6", label: "Item no longer needed", icon: PackageX },
  ];

  const openCancelModal = (orderId, item) => {
    setSelectedItem({
      orderId,
      id: item.id,
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    });
    setCancelReason("");
    setCancelDescription("");
    setCancelImages([]);
    setCancelImagePreviews([]);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancelReason("");
    setCancelDescription("");
    setCancelImages([]);
    setCancelImagePreviews([]);
    setSelectedItem(null);
  };

  // multi-select: naye files ko existing list ke saath merge karta hai, max 5 tak
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = MAX_CANCEL_IMAGES - cancelImages.length;
    if (remainingSlots <= 0) {
      showErrorToast(`You can upload up to ${MAX_CANCEL_IMAGES} photos`);
      e.target.value = "";
      return;
    }

    const validFiles = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        showErrorToast(`${file.name} is not a valid image`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        showErrorToast(`${file.name} is over 5MB`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > remainingSlots) {
      showErrorToast(
        `Only ${remainingSlots} more photo${remainingSlots === 1 ? "" : "s"} allowed (max ${MAX_CANCEL_IMAGES})`,
      );
    }

    const filesToAdd = validFiles.slice(0, remainingSlots);
    if (filesToAdd.length === 0) {
      e.target.value = "";
      return;
    }

    setCancelImages((prev) => [...prev, ...filesToAdd]);
    setCancelImagePreviews((prev) => [
      ...prev,
      ...filesToAdd.map((file) => URL.createObjectURL(file)),
    ]);

    e.target.value = ""; // same file dobara select karne dene ke liye reset
  };

  const removeCancelImage = (index) => {
    setCancelImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setCancelImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ⚠️ Backend me abhi cancel-order endpoint exist nahi karta.
  // Jab banao, PATCH /web/orders/cancel (multipart/form-data) expect kar raha hoon
  // fields: orderNumber, itemId, reason, description, images[] (multiple files, max 5)
  // — endpoint milte hi match kar lena.
  const handleCancelOrder = async () => {
    if (!cancelReason) {
      showErrorToast("Please select a reason for cancellation");
      return;
    }

    try {
      setCancelling(true);

      const formData = new FormData();
      formData.append("orderNumber", selectedItem.orderId);
      formData.append("itemId", selectedItem.id);
      formData.append("reason", cancelReason);
      formData.append("description", cancelDescription);
      cancelImages.forEach((file) => formData.append("images", file));

      const data = await apiHelper.patch("/web/orders/cancel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        showSuccessToast(
          "Your cancellation request has been submitted. Refund will be processed within 3-5 business days.",
        );
        closeCancelModal();
        fetchOrders(); // refresh with real updated status
      }
    } catch (err) {
      showErrorToast(
        err.response?.data?.message || "Cancel feature not available yet",
      );
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Delivered: "bg-green-100 text-green-700",
      "In Transit": "bg-blue-100 text-blue-700",
      Processing: "bg-yellow-100 text-yellow-700",
      "Out for Delivery": "bg-orange-100 text-orange-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "In Transit":
        return <Truck className="h-3 w-3" />;
      case "Out for Delivery":
        return <Clock className="h-3 w-3" />;
      case "Delivered":
        return <CheckCircle className="h-3 w-3" />;
      case "Processing":
        return <Package className="h-3 w-3" />;
      case "Cancelled":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Package className="h-3 w-3" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus !== "all") {
      const hasMatchingItem = order.items.some(
        (item) => item.tracking.status === filterStatus,
      );
      if (!hasMatchingItem) return false;
    }
    if (
      searchQuery &&
      !order.id.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gray-50">
    
      {showCancelModal && selectedItem && (
        <div className="fixed inset-0 z-100 ">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeCancelModal}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 pb-0 lg:pb-4 lg:mt-24">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh] sm:max-h-[90vh] md:max-h-[85vh] lg:max-h-[80vh]">
              <div className="relative bg-linear-to-r from-green-600 to-green-700 px-4 sm:px-6 py-4 text-white shrink-0">
                <button
                  onClick={closeCancelModal}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
                >
                  <X size={16} />
                </button>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <AlertTriangle size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Cancel Item
                    </h3>
                    <p className="text-xs text-green-100 mt-0.5 sm:mt-1 truncate max-w-45 sm:max-w-55">
                      {selectedItem?.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-[10px] sm:text-[11px] uppercase tracking-wide text-gray-400">
                        Refund Amount
                      </p>
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                        ₹{selectedItem?.price?.toLocaleString()}
                      </h4>
                    </div>
                    <div className="bg-green-100 text-green-600 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold">
                      Refund Eligible
                    </div>
                  </div>
                </div>

                <div className="mb-4 sm:mb-5">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Select cancellation reason
                  </label>
                  <div className="relative">
                    <select
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full appearance-none border-2 border-gray-200 rounded-2xl px-4 py-2.5 sm:py-3 text-sm font-medium text-gray-700 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all bg-white"
                    >
                      <option value="">Choose a reason</option>
                      {cancelReasons.map((reason) => (
                        <option key={reason.id} value={reason.label}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {cancelReason && (
                  <div className="mb-4 sm:mb-5">
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-3 flex items-start gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                        {(() => {
                          const selected = cancelReasons.find(
                            (r) => r.label === cancelReason,
                          );
                          if (!selected) return null;
                          const Icon = selected.icon;
                          return (
                            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                          );
                        })()}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-green-700">
                          Selected Reason
                        </p>
                        <p className="text-xs text-green-600 mt-0.5 sm:mt-1">
                          {cancelReason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-4 sm:mb-5">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={cancelDescription}
                    onChange={(e) => setCancelDescription(e.target.value)}
                    placeholder="Describe the issue in detail..."
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-2.5 sm:py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none resize-none transition-all"
                  />
                </div>

                {/* Photo upload - multiple, max 5 */}
                <div className="mb-2 sm:mb-5">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Upload Photos{" "}
                    <span className="text-gray-400 font-normal">
                      (optional, up to {MAX_CANCEL_IMAGES})
                    </span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  {cancelImagePreviews.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-2xl py-6 text-gray-500 hover:border-green-500 hover:text-green-600 hover:bg-green-50/50 transition-all"
                    >
                      <ImagePlus className="h-6 w-6" />
                      <span className="text-xs font-medium">
                        Tap to upload photos of the item
                      </span>
                      <span className="text-[10px] text-gray-400">
                        JPG, PNG up to 5MB each · max {MAX_CANCEL_IMAGES} photos
                      </span>
                    </button>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      {cancelImagePreviews.map((url, idx) => (
                        <div key={url} className="relative w-20 h-20 sm:w-24 sm:h-24">
                          <img
                            src={url}
                            alt={`Selected item ${idx + 1}`}
                            className="w-full h-full object-cover rounded-2xl border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeCancelImage(idx)}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow hover:bg-red-600 transition"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}

                      {cancelImagePreviews.length < MAX_CANCEL_IMAGES && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 hover:border-green-500 hover:text-green-600 hover:bg-green-50/50 transition-all"
                        >
                          <Plus className="h-5 w-5" />
                          <span className="text-[10px] font-medium">Add</span>
                        </button>
                      )}
                    </div>
                  )}

                  {cancelImagePreviews.length > 0 && (
                    <p className="text-[11px] text-gray-400 mt-2">
                      {cancelImagePreviews.length}/{MAX_CANCEL_IMAGES} photos added
                    </p>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-1">
                  <div className="flex gap-2 sm:gap-3">
                    <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0 mt-1" />
                    <p className="text-xs sm:text-sm text-amber-700 leading-relaxed">
                      <span className="font-semibold">Refund Information:</span>{" "}
                      Refund will be processed within 3–5 business days to your
                      original payment method.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-white">
                <button
                  onClick={closeCancelModal}
                  className="flex-1 h-10 sm:h-11 rounded-2xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                  Go Back
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={!cancelReason || cancelling}
                  className="flex-1 h-10 sm:h-11 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {cancelling ? "Processing..." : "Confirm Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-white sticky top-0 z-10">
        <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-12 md:pt-16 lg:pt-20">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            My{" "}
            <span className="text-transparent bg-clip-text bg-green-600">
              Orders
            </span>
          </h1>
          <p className="text-sm text-green-600 mt-1">
            Track each product in your order separately
          </p>
        </div>
      </div>
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 py-10">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          <div className="relative">
            <Listbox
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
            >
              <div className="relative">
                <Listbox.Button className="flex items-center gap-2 cursor-pointer px-4 py-2.5 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-sm font-medium">
                  <Filter className="h-4 w-4" />
                  <span>
                    {filterStatus === "all" ? "All Orders" : filterStatus}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Listbox.Button>
                <Listbox.Options className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-20 py-1">
                  {[
                    { value: "all", label: "All Orders" },
                    { value: "Processing", label: "Processing" },
                    { value: "In Transit", label: "In Transit" },
                    { value: "Out for Delivery", label: "Out for Delivery" },
                    { value: "Delivered", label: "Delivered" },
                    { value: "Cancelled", label: "Cancelled" },
                  ].map((status) => (
                    <Listbox.Option
                      key={status.value}
                      value={status.value}
                      className={({ active, selected }) =>
                        `block w-full text-left px-4 py-2 text-sm cursor-pointer ${
                          active
                            ? "bg-green-50 text-green-700"
                            : "text-gray-700"
                        } ${selected ? "bg-green-100 font-medium" : ""}`
                      }
                    >
                      {({ selected }) => (
                        <span className="flex items-center justify-between">
                          {status.label}
                          {selected && (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500">Try changing your search or filter</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-black">
                          Order #{order.id}
                        </span>
                        <span className="text-xs text-gray-500">
                          Placed on {order.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-3 w-3" />₹
                          {order.total.toLocaleString()}
                        </span>
                        <span>{order.paymentStatus}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-white hover:bg-gray-50/60 transition-all duration-300"
                    >
                      <div className="p-4 sm:p-5 lg:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                          <div className="lg:col-span-5 flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                                <img
                                  src={apiHelper.getImageUrl(item.image)}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <div
                                className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow ${
                                  item.tracking.status === "Delivered"
                                    ? "bg-green-500"
                                    : item.tracking.status === "In Transit"
                                    ? "bg-blue-500"
                                    : item.tracking.status ===
                                      "Out for Delivery"
                                    ? "bg-orange-500"
                                    : item.tracking.status === "Cancelled"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                                }`}
                              />
                            </div>

                            <div className="min-w-0">
                              <h3 className="text-[15px] sm:text-lg font-semibold text-black">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.brand}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className="text-lg font-bold text-green-700">
                                  ₹{item.price.toLocaleString()}
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </span>
                              </div>

                              <div className="mt-3">
                                {item.tracking.status === "Delivered" ? (
                                  <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    <p className="text-sm font-medium">
                                      Delivered on {item.tracking.deliveredDate}
                                    </p>
                                  </div>
                                ) : item.tracking.status === "Cancelled" ? (
                                  <div className="flex items-center gap-2 text-red-600">
                                    <XCircle className="h-4 w-4" />
                                    <p className="text-sm font-medium">
                                      Cancelled • Refund Initiated
                                    </p>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-blue-600">
                                    <Truck className="h-4 w-4" />
                                    <p className="text-sm font-medium">
                                      Expected delivery:{" "}
                                      {item.tracking.estimated}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {item.tracking.status !== "Cancelled" && (
                            <div className="lg:col-span-4 hidden lg:flex items-center justify-center px-2">
                              <div className="w-full max-w-md">
                                <div className="flex items-center justify-between relative">
                                  {item.tracking.steps.map((step, idx, arr) => (
                                    <div
                                      key={idx}
                                      className="relative flex flex-col items-center flex-1"
                                    >
                                      {idx !== arr.length - 1 && (
                                        <div
                                          className={`absolute top-4 left-1/2 w-full h-[2px] ${
                                            step.completed
                                              ? "bg-green-500"
                                              : "bg-gray-300"
                                          }`}
                                        />
                                      )}
                                      <div
                                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                          step.completed
                                            ? "bg-green-500 border-green-500 text-white"
                                            : "bg-white border-gray-300 text-gray-400"
                                        }`}
                                      >
                                        {step.completed ? (
                                          <CheckCircle className="h-4 w-4" />
                                        ) : (
                                          <div className="w-2 h-2 rounded-full bg-current" />
                                        )}
                                      </div>
                                      <p
                                        className={`mt-2 text-[11px] font-medium text-center whitespace-nowrap ${
                                          step.completed
                                            ? "text-gray-700"
                                            : "text-gray-400"
                                        }`}
                                      >
                                        {step.status}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                           <div className="lg:col-span-3 flex flex-row lg:flex-col items-center lg:items-end gap-3">
                            <div
                              className={`inline-flex items-center gap-1.5 px-2 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold ${getStatusBadge(
                                item.tracking.status,
                              )}`}
                            >
                              {getStatusIcon(item.tracking.status)}
                              {item.tracking.status}
                            </div>

                            {item.tracking.status !== "Cancelled" && (
                              <Link
                                to={`/track-product/${order.id}/${item.id}`}
                                className="flex items-center justify-center whitespace-nowrap gap-1.5 px-2 py-1 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-all w-full md:w-auto"
                              >
                                Track Order
                                <ChevronRight className="h-4 w-4" />
                              </Link>
                            )}

                            {item.tracking.status !== "Delivered" &&
                              item.tracking.status !== "Cancelled" && (
                                <button
                                  onClick={() =>
                                    openCancelModal(order.id, item)
                                  }
                                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer px-2 py-1.5 rounded-lg hover:bg-red-50 w-full md:w-auto text-center whitespace-nowrap"
                                >
                                  Cancel Item
                                </button>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;