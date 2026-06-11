import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Wrench,
  Building,
  CheckCircle2,
  Hourglass,
  XCircle,
  FileText,
  Search,
  Info,
  IndianRupee,
  Download,
  CreditCard,
  ArrowRight,
} from "lucide-react";

const MOCK_BOOKINGS = [
  {
    id: "BKD10018",
    serviceType: "Engine Oil Change",
    centerName: "AG Central Co-Op (Demo)",
    address: "920 N Congress Parkway, Athens, 37303, Tennessee",
    vehicleDetails: "John Deere 5310",
    regNo: "RJ14 GA 1234",
    bookingDate: "25 May 2026",
    bookingTime: "10:33 AM",
    status: "Completed",
    paymentMethod: "Paid Online",
    paymentType: "UPI",
    amount: 2450.0,
  },
  {
    id: "BKD10017",
    serviceType: "Tractor Washing",
    centerName: "Krushi Workshop Hub",
    address: "Sardar Patel Highway, Junagadh, Gujarat",
    vehicleDetails: "Swaraj 744 FE",
    regNo: "RJ14 CD 5678",
    bookingDate: "20 May 2026",
    bookingTime: "02:00 PM",
    status: "Completed",
    paymentMethod: "Paid Cash",
    paymentType: "Cash",
    amount: 650.0,
  },
  {
    id: "BKD10016",
    serviceType: "Tyre Service",
    centerName: "AG Central Co-Op (Demo)",
    address: "920 N Congress Parkway, Athens, 37303, Tennessee",
    vehicleDetails: "Mahindra 575 DI",
    regNo: "RJ14 EF 9012",
    bookingDate: "18 May 2026",
    bookingTime: "11:00 AM",
    status: "Completed",
    paymentMethod: "Paid Online",
    paymentType: "Card",
    amount: 1200.0,
  },
  {
    id: "BKD10015",
    serviceType: "General Service",
    centerName: "Balaji Tractor Care",
    address: "Jetpur Road, Gondal, Gujarat",
    vehicleDetails: "John Deere 5050D",
    regNo: "GJ03 KH 3456",
    bookingDate: "15 May 2026",
    bookingTime: "09:33 AM",
    status: "Pending",
    paymentMethod: "Pending",
    paymentType: "Due",
    amount: 1850.0,
  },
  {
    id: "BKD10014",
    serviceType: "Brake Service",
    centerName: "AG Central Co-Op (Demo)",
    address: "920 N Congress Parkway, Athens, 37303, Tennessee",
    vehicleDetails: "Sonalika DI 740",
    regNo: "RJ14 IJ 7890",
    bookingDate: "10 May 2026",
    bookingTime: "01:05 PM",
    status: "Cancelled",
    paymentMethod: "Cancelled",
    paymentType: "Refunded",
    amount: 0.0,
  },
];

const BookingHistory = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const totalBookings = MOCK_BOOKINGS.length;
  const completedCount = MOCK_BOOKINGS.filter(
    (b) => b.status === "Completed",
  ).length;
  const pendingCount = MOCK_BOOKINGS.filter(
    (b) => b.status === "Pending",
  ).length;
  const totalSpent = MOCK_BOOKINGS.reduce((acc, b) => acc + b.amount, 0);

  const filteredBookings = MOCK_BOOKINGS.filter((booking) => {
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Completed" && booking.status === "Completed") ||
      (activeTab === "Upcoming" && booking.status === "Pending") ||
      (activeTab === "Cancelled" && booking.status === "Cancelled");
    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.centerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vehicleDetails.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 className="h-3 w-3" /> Completed
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Hourglass className="h-3 w-3" /> Pending
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="h-3 w-3" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentBadge = (booking) => {
    if (booking.status === "Cancelled") {
      return <span className="text-xs font-semibold text-gray-400">-</span>;
    }
    if (booking.paymentMethod === "Paid Online") {
      return (
        <div className="flex flex-col items-start gap-0.5">
          <span className="inline-flex items-center text-[11px] font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">
            Paid Online
          </span>
          <span className="text-[10px] font-medium text-gray-400 font-mono pl-0.5">
            {booking.paymentType}
          </span>
        </div>
      );
    }
    if (booking.paymentMethod === "Paid Cash") {
      return (
        <div className="flex flex-col items-start gap-0.5">
          <span className="inline-flex items-center text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
            Paid Cash
          </span>
          <span className="text-[10px] font-medium text-gray-400 font-mono pl-0.5">
            {booking.paymentType}
          </span>
        </div>
      );
    }
    return (
      <span className="inline-flex items-center text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
        Pending
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* STANDARDIZED: Same spacing pattern as all other components */}
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-6 md:pt-8 lg:pt-10 pb-4">
        {/* Header */}
        <div className="mb-6 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              Booking{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">
                History
              </span>
            </h2>
            <Link
              to="/service"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm shadow-md shadow-green-600/20 hover:shadow-lg hover:shadow-green-600/30 self-start"
            >
              <Wrench className="h-4 w-4" /> + New Service Booking
            </Link>
          </div>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl">
            View and manage all your tractor service bookings
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-10">
          {[
            {
              icon: FileText,
              label: "Total Bookings",
              value: totalBookings,
              color: "bg-green-50 text-green-700",
              border: "border-green-200",
            },
            {
              icon: CheckCircle2,
              label: "Completed",
              value: completedCount,
              color: "bg-blue-50 text-blue-600",
              border: "border-blue-200",
            },
            {
              icon: Hourglass,
              label: "Pending",
              value: pendingCount,
              color: "bg-amber-50 text-amber-600",
              border: "border-amber-200",
            },
            {
              icon: IndianRupee,
              label: "Total Spent",
              value: `₹${totalSpent.toLocaleString("en-IN")}`,
              color: "bg-purple-50 text-purple-600",
              border: "border-purple-200",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div
                className={`p-3 rounded-xl ${stat.color} border ${stat.border}`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">
                  {stat.value}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        {/* Filter Tabs - Inline with underline indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4  border-b border-gray-100">
          <div className="flex items-center gap-0 overflow-x-auto w-full sm:w-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab("All")}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "All"
                  ? "text-green-600"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              All
              {activeTab === "All" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("Completed")}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "Completed"
                  ? "text-green-600"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              Completed
              {activeTab === "Completed" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("Upcoming")}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "Upcoming"
                  ? "text-green-600"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              Upcoming
              {activeTab === "Upcoming" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("Cancelled")}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "Cancelled"
                  ? "text-green-600"
                  : "text-gray-600 hover:text-green-700"
              }`}
            >
              Cancelled
              {activeTab === "Cancelled" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search ID, Service, or Tractor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
          </div>
        </div>

        {/* Table / Mobile Cards */}
        <div className="bg-white border border-gray-200  shadow-sm overflow-hidden">
          {filteredBookings.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      <th className="py-4 px-5">Booking ID</th>
                      <th className="py-4 px-5">Service Details</th>
                      <th className="py-4 px-5">Tractor Details</th>
                      <th className="py-4 px-5">Booking Date</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5">Payment</th>
                      <th className="py-4 px-5 text-right">Amount</th>
                      <th className="py-4 px-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50/70 transition-colors whitespace-nowrap"
                      >
                        <td className="py-4 px-5 font-mono font-bold text-gray-900 tracking-wide">
                          {booking.id}
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 p-1.5 bg-green-50 rounded-lg border border-green-100 text-green-600 flex-shrink-0">
                              <Wrench className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <div className="font-extrabold text-gray-900">
                                {booking.serviceType}
                              </div>
                              <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Building className="h-3 w-3 text-green-600" />{" "}
                                {booking.centerName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="font-bold text-gray-800">
                            {booking.vehicleDetails}
                          </div>
                          <div className="text-[11px] font-mono font-medium text-gray-400 uppercase mt-0.5">
                            {booking.regNo}
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="font-bold text-gray-800 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />{" "}
                            {booking.bookingDate}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5 pl-5">
                            <Clock className="h-3 w-3 text-gray-400" />{" "}
                            {booking.bookingTime}
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="py-4 px-5">
                          {getPaymentBadge(booking)}
                        </td>
                        <td className="py-4 px-5 text-right font-black text-gray-900">
                          ₹
                          {booking.amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-4 px-5 text-center">
                          {booking.status === "Completed" ? (
                            <button className="inline-flex items-center gap-1.5 border border-gray-200 hover:border-green-600 bg-white hover:bg-green-50 text-gray-600 hover:text-green-700 font-bold text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm">
                              <Download className="h-3.5 w-3.5" /> Invoice
                            </button>
                          ) : booking.status === "Pending" ? (
                            <button className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm shadow-green-600/10">
                              <CreditCard className="h-3.5 w-3.5" /> Pay Now
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs font-medium">
                              -
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="block lg:hidden divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 sm:p-5 space-y-4 hover:bg-gray-50/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-gray-900 text-sm">
                        {booking.id}
                      </span>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-gray-900">
                        {booking.serviceType}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Building className="h-3 w-3 text-green-600" />{" "}
                        {booking.centerName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 text-xs border-t border-gray-50">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1">
                          Tractor
                        </span>
                        <span className="font-bold text-gray-800">
                          {booking.vehicleDetails}
                        </span>
                        <span className="text-[10px] block font-mono text-gray-400 uppercase">
                          {booking.regNo}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1">
                          Schedule
                        </span>
                        <span className="font-bold text-gray-800 flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />{" "}
                          {booking.bookingDate}
                        </span>
                        <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                          <Clock className="h-3 w-3" /> {booking.bookingTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1">
                          Payment
                        </span>
                        {getPaymentBadge(booking)}
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold mb-1">
                          Total
                        </span>
                        <span className="font-black text-gray-900">
                          ₹
                          {booking.amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      {booking.status === "Completed" ? (
                        <button className="w-full flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-green-50 text-gray-700 hover:text-green-700 font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm cursor-pointer">
                          <Download className="h-4 w-4 text-green-600" />{" "}
                          Download Invoice
                        </button>
                      ) : booking.status === "Pending" ? (
                        <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm shadow-green-600/10 cursor-pointer">
                          <CreditCard className="h-4 w-4" /> Complete Payment
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center">
              <Info className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-500">
                No matching booking entries found.
              </p>
            </div>
          )}
        </div>
      </div>
      <style>{`
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  /* Custom styled scrollbar for the table */
  .custom-scrollbar::-webkit-scrollbar {
    height: 1px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`}</style>
    </div>
  );
};

export default BookingHistory;
