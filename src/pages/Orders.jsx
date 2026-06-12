import { useState } from "react";
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
  MapPin,
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
} from "lucide-react";

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [orders, setOrders] = useState([
    {
      id: "SP-2026-001234",
      date: "18 May, 2026",
      total: 7015,
      paymentStatus: "Paid",
      items: [
        {
          id: 1,
          name: "Air Filter Element",
          brand: "Massey Ferguson",
          price: 450,
          quantity: 2,
          image: "https://picsum.photos/id/100/100/100",
          tracking: {
            status: "Delivered",
            trackingNumber: "EL987654321IN",
            carrier: "Express Logistics",
            estimated: "20 May, 2026",
            currentLocation: "Delivered",
            deliveredDate: "20 May, 2026",
            steps: [
              {
                status: "Order Placed",
                date: "18 May, 10:30 AM",
                completed: true,
              },
              { status: "Shipped", date: "19 May, 2:00 PM", completed: true },
              {
                status: "Out for Delivery",
                date: "20 May, 9:00 AM",
                completed: true,
              },
              {
                status: "Delivered",
                date: "20 May, 3:30 PM",
                completed: true,
                current: true,
              },
            ],
          },
        },
        {
          id: 2,
          name: "Oil Filter",
          brand: "Mahindra",
          price: 350,
          quantity: 1,
          image: "https://picsum.photos/id/101/100/100",
          tracking: {
            status: "In Transit",
            trackingNumber: "EL987654322IN",
            carrier: "Express Logistics",
            estimated: "22 May, 2026",
            currentLocation: "Mumbai Hub",
            steps: [
              {
                status: "Order Placed",
                date: "18 May, 10:30 AM",
                completed: true,
              },
              { status: "Shipped", date: "19 May, 5:00 PM", completed: true },
              {
                status: "In Transit",
                date: "20 May, 8:00 AM",
                completed: true,
                current: true,
              },
              { status: "Out for Delivery", date: "Pending", completed: false },
              { status: "Delivered", date: "Pending", completed: false },
            ],
          },
        },
        {
          id: 3,
          name: "Clutch Plate",
          brand: "Swaraj",
          price: 1850,
          quantity: 1,
          image: "https://picsum.photos/id/102/100/100",
          tracking: {
            status: "Processing",
            trackingNumber: "EL987654323IN",
            carrier: "Express Logistics",
            estimated: "25 May, 2026",
            currentLocation: "Warehouse",
            steps: [
              {
                status: "Order Placed",
                date: "18 May, 10:30 AM",
                completed: true,
              },
              {
                status: "Processing",
                date: "19 May, 11:00 AM",
                completed: true,
                current: true,
              },
              { status: "Shipped", date: "Pending", completed: false },
              { status: "Delivered", date: "Pending", completed: false },
            ],
          },
        },
      ],
    },
    {
      id: "SP-2026-001235",
      date: "15 May, 2026",
      total: 2450,
      paymentStatus: "Paid",
      items: [
        {
          id: 4,
          name: "Brake Shoe Set",
          brand: "John Deere",
          price: 1200,
          quantity: 2,
          image: "https://picsum.photos/id/103/100/100",
          tracking: {
            status: "Delivered",
            trackingNumber: "FD456789012IN",
            carrier: "FastTrack Delivery",
            estimated: "18 May, 2026",
            currentLocation: "Delivered",
            deliveredDate: "18 May, 2026",
            steps: [
              {
                status: "Order Placed",
                date: "15 May, 2:30 PM",
                completed: true,
              },
              { status: "Shipped", date: "16 May, 10:00 AM", completed: true },
              {
                status: "Out for Delivery",
                date: "18 May, 9:30 AM",
                completed: true,
              },
              {
                status: "Delivered",
                date: "18 May, 1:00 PM",
                completed: true,
                current: true,
              },
            ],
          },
        },
      ],
    },
  ]);

  const cancelReasons = [
    {
      id: "1",
      label: "Product quality issue",
      icon: BadgeAlert,
    },
    {
      id: "2",
      label: "Better price available elsewhere",
      icon: BadgeDollarSign,
    },
    {
      id: "3",
      label: "Product arrived late",
      icon: Clock3,
    },
    {
      id: "4",
      label: "Changed my mind",
      icon: RefreshCcw,
    },
    {
      id: "5",
      label: "Accidental order",
      icon: Ban,
    },
    {
      id: "6",
      label: "Item no longer needed",
      icon: PackageX,
    },
  ];

  const openCancelModal = (orderId, item) => {
    setSelectedItem({
      orderId: orderId,
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    });
    setCancelReason("");
    setShowCancelModal(true);
  };

  const handleCancelOrder = () => {
    if (!cancelReason) {
      alert("Please select a reason for cancellation");
      return;
    }

    setCancelling(true);

    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.id === selectedItem.orderId) {
            const updatedItems = order.items.map((item) =>
              item.id === selectedItem.id
                ? {
                    ...item,
                    tracking: {
                      ...item.tracking,
                      status: "Cancelled",
                      currentLocation: "Cancelled",
                      cancelReason: cancelReason,
                      cancelledDate: new Date().toLocaleDateString(),
                      steps: [
                        ...item.tracking.steps,
                        {
                          status: "Cancelled",
                          date: new Date().toLocaleDateString(),
                          completed: true,
                          current: true,
                        },
                      ],
                    },
                  }
                : item,
            );
            const allCancelled = updatedItems.every(
              (item) => item.tracking.status === "Cancelled",
            );
            return {
              ...order,
              items: updatedItems,
              status: allCancelled ? "Cancelled" : order.status,
              paymentStatus: allCancelled ? "Refunded" : "Refund Initiated",
            };
          }
          return order;
        }),
      );

      setCancelling(false);
      setShowCancelModal(false);
      setCancelReason("");
      setSelectedItem(null);
      alert(
        "Your cancellation request has been submitted. Refund will be processed within 3-5 business days.",
      );
    }, 1000);
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

  return (
    <div className="min-h-screen  bg-gray-50">
      {/* Cancel Modal */}
      {showCancelModal && selectedItem && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 lg:mt-24">
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] lg:max-h-[80vh]">
              {/* Header - Fixed */}
              <div className="relative bg-gradient-to-r from-green-600 to-green-700 px-4 sm:px-6 py-4 text-white flex-shrink-0">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
                >
                  <X size={16} />
                </button>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                    <AlertTriangle size={20} className="sm:w-6 sm:h-6" />
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-black">
                      Cancel Item
                    </h3>

                    <p className="text-xs text-green-100 mt-0.5 sm:mt-1 truncate max-w-45 sm:max-w-55">
                      {selectedItem?.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
                {/* Product Summary */}
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

                {/* Select Reason */}
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

                {/* Selected Reason */}
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

                {/* Feedback */}
                <div className="mb-2 sm:mb-5">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Additional feedback
                  </label>

                  <textarea
                    rows={2}
                    placeholder="Tell us more about the issue..."
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-2.5 sm:py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none resize-none transition-all"
                  />
                </div>

                {/* Refund Notice */}
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

              {/* Footer Buttons - Fixed */}
              <div className="p-4 sm:p-5 border-t border-gray-100 flex gap-3 flex-shrink-0 bg-white">
                <button
                  onClick={() => setShowCancelModal(false)}
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
        {/* Search and Filter Bar */}
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
         {/* Status Filter - Headless UI Listbox */}
{/* Status Filter - Headless UI Listbox */}
<div className="relative">
  <Listbox value={filterStatus} onChange={(value) => {
    setFilterStatus(value);
    setIsFilterOpen(false);
  }}>
    <div className="relative">
      <Listbox.Button className="flex items-center gap-2 cursor-pointer px-4 py-2.5 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-sm font-medium">
        <Filter className="h-4 w-4" />
        <span>{filterStatus === "all" ? "All Orders" : filterStatus}</span>
        <ChevronDown className="h-4 w-4" />
      </Listbox.Button>
      <Listbox.Options className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-20 py-1">
        {/* Changed right-0 to left-0 */}
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
                active ? "bg-green-50 text-green-700" : "text-gray-700"
              } ${selected ? "bg-green-100 font-medium" : ""}`
            }
          >
            {({ selected }) => (
              <span className="flex items-center justify-between">
                {status.label}
                {selected && <Check className="h-4 w-4 text-green-600" />}
              </span>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
</div>
        </div>

        {/* Orders List */}
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
                {/* Order Header */}
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
                {/* Order Items */}
                {/* Order Items - 3 COLUMN LAYOUT */}
                <div className="divide-y divide-gray-100">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="group bg-white hover:bg-gray-50/60 transition-all duration-300"
                    >
                      <div className="p-4 sm:p-5 lg:p-6">
                        {/* 3-Column Grid Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                          {/* COLUMN 1: Product Image (2 columns) */}
                          {/* LEFT SIDE */}
                          <div className="lg:col-span-5 flex items-center gap-4">
                            {/* IMAGE */}
                            <div className="relative flex-shrink-0">
                              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                                <img
                                  src={item.image}
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

                            {/* PRODUCT INFO */}
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
                                      Expected delivery by{" "}
                                      {item.tracking.estimated}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* CENTER TIMELINE */}
                          {item.tracking.status !== "Cancelled" && (
                            <div className="lg:col-span-4 hidden lg:flex items-center justify-center px-2">
                              <div className="w-full max-w-md">
                                <div className="flex items-center justify-between relative">
                                  {[
                                    {
                                      label: "Ordered",
                                      done: true,
                                    },
                                    {
                                      label: "Shipped",
                                      done:
                                        item.tracking.status !== "Processing",
                                    },
                                    {
                                      label: "Out for Delivery",
                                      done:
                                        item.tracking.status ===
                                          "Out for Delivery" ||
                                        item.tracking.status === "Delivered",
                                    },
                                    {
                                      label: "Delivered",
                                      done:
                                        item.tracking.status === "Delivered",
                                    },
                                  ].map((step, idx, arr) => (
                                    <div
                                      key={idx}
                                      className="relative flex flex-col items-center flex-1"
                                    >
                                      {idx !== arr.length - 1 && (
                                        <div
                                          className={`absolute top-4 left-1/2 w-full h-[2px] ${
                                            step.done
                                              ? "bg-green-500"
                                              : "bg-gray-300"
                                          }`}
                                        />
                                      )}

                                      <div
                                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                          step.done
                                            ? "bg-green-500 border-green-500 text-white"
                                            : "bg-white border-gray-300 text-gray-400"
                                        }`}
                                      >
                                        {step.done ? (
                                          <CheckCircle className="h-4 w-4" />
                                        ) : (
                                          <div className="w-2 h-2 rounded-full bg-current" />
                                        )}
                                      </div>

                                      <p
                                        className={`mt-2 text-[11px] font-medium text-center whitespace-nowrap ${
                                          step.done
                                            ? "text-gray-700"
                                            : "text-gray-400"
                                        }`}
                                      >
                                        {step.label}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* RIGHT SIDE BUTTONS */}
                          <div className="lg:col-span-3 flex flex-row lg:flex-col items-center lg:items-end gap-3">
                            <div
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold ${
                                item.tracking.status === "Delivered"
                                  ? "bg-green-100 text-green-700"
                                  : item.tracking.status === "In Transit"
                                    ? "bg-blue-100 text-blue-700"
                                    : item.tracking.status ===
                                        "Out for Delivery"
                                      ? "bg-orange-100 text-orange-700"
                                      : item.tracking.status === "Cancelled"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {getStatusIcon(item.tracking.status)}
                              {item.tracking.status}
                            </div>

                            {item.tracking.status !== "Cancelled" && (
                              <Link
                                to={`/track-product/${order.id}/${item.id}`}
                                className="flex items-center justify-center whitespace-nowrap gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-all w-full md:w-auto"
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
                                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer px-3 py-1.5 rounded-lg whi hover:bg-red-50 w-full md:w-auto text-center"
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
