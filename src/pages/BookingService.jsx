import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RadioGroup, Listbox } from "@headlessui/react";
import {
  Calendar as CalendarIcon,
  Clock,
  Car,
  CreditCard,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Building,
  Wrench,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Smartphone,
  ArrowRight,
  Sparkles,
  Check,
  ChevronDown,
  Lock,
} from "lucide-react";

const BookingService = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const center = location.state?.selectedCenter || {
    id: 1,
    name: "AG Central Co-Op (Demo)",
    address: "920 N Congress Parkway, Athens, 37303, Tennessee",
    serviceType: "Tractor Repair",
    brand: "Mahindra",
    estimatedCost: 150,
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingTime, setBookingTime] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pay_at_center");
  const [isBooked, setIsBooked] = useState(false);
  const [showOnlineGateway, setShowOnlineGateway] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [onlineVendor, setOnlineVendor] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
  });
  const [upiId, setUpiId] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5));

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const firstDayIndex = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleMonthNavigation = (direction) => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + direction,
        1,
      ),
    );
  };

  const handleDateSelect = (day) => {
    const dateObj = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    setSelectedDate(dateObj);
    setShowCalendar(false);
  };

  const formatDateString = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleConfigFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !bookingTime || !vehicleDetails) {
      alert("Please complete all configuration fields before confirming.");
      return;
    }

    if (paymentMethod === "pay_online") {
      setShowOnlineGateway(true);
    } else {
      setIsBooked(true);
    }
  };

  const handleExecutePayment = (e) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowOnlineGateway(false);
      setIsBooked(true);
    }, 2500);
  };

  const handleReturnToFinder = () => {
    navigate("/service");
  };

  const handleReturnToServices = () => {
    navigate("/service");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased">
      <div className="w-full xl:max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-24 2xl:px-46 pt-6 md:pt-8 lg:pt-10 pb-4">
        {/* Navigation Back Link */}
        <button
          type="button"
          onClick={() =>
            showOnlineGateway
              ? setShowOnlineGateway(false)
              : handleReturnToFinder()
          }
          className="inline-flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-600 hover:text-green-700 bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm mb-6 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          {showOnlineGateway
            ? "Back to Configurations Form"
            : "Return to Center Finder"}
        </button>

        {showOnlineGateway ? (
          /* =========================================================
             ONLINE PAYMENT GATEWAY INTERFACE
             ========================================================= */
          <div className="max-w-lg mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
              <div className="border-b pb-4 mb-6">
                <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" /> Secure
                  Payment Gateway Checkout
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Select your preferred transaction channel to process payment
                  for{" "}
                  <span className="font-bold text-gray-900">{center.name}</span>
                  .
                </p>
              </div>

              {isProcessingPayment ? (
                <div className="py-12 text-center">
                  <Loader2 className="h-10 w-10 text-green-600 animate-spin mx-auto mb-4" />
                  <h3 className="text-sm font-black text-gray-900">
                    Authorizing Funds Digitally...
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Please do not refresh, close this view, or tap the back
                    navigation elements.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleExecutePayment} className="space-y-5">
                  {/* Payment Method Tabs */}
                  <RadioGroup value={onlineVendor} onChange={setOnlineVendor}>
                    <div className="grid grid-cols-3 gap-2">
                      <RadioGroup.Option value="card">
                        {({ checked }) => (
                          <div
                            className={`p-3 border rounded-xl text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              checked
                                ? "border-green-600 bg-green-50 text-green-800 shadow-sm"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <CreditCard className="h-4 w-4" />
                            <span className="text-xs font-bold tracking-tight">
                              Card
                            </span>
                          </div>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value="gpay">
                        {({ checked }) => (
                          <div
                            className={`p-3 border rounded-xl text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              checked
                                ? "border-green-600 bg-green-50 text-green-800 shadow-sm"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <Smartphone className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-bold tracking-tight">
                              Google Pay
                            </span>
                          </div>
                        )}
                      </RadioGroup.Option>
                      <RadioGroup.Option value="paytm">
                        {({ checked }) => (
                          <div
                            className={`p-3 border rounded-xl text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              checked
                                ? "border-green-600 bg-green-50 text-green-800 shadow-sm"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <Smartphone className="h-4 w-4 text-cyan-600" />
                            <span className="text-xs font-bold tracking-tight">
                              Paytm
                            </span>
                          </div>
                        )}
                      </RadioGroup.Option>
                    </div>
                  </RadioGroup>

                  {/* Card Details Form */}
                  {onlineVendor === "card" && (
                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.number}
                            onChange={(e) =>
                              setCardDetails({
                                ...cardDetails,
                                number: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            maxLength={19}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) =>
                              setCardDetails({
                                ...cardDetails,
                                expiry: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            value={cardDetails.cvc}
                            onChange={(e) =>
                              setCardDetails({
                                ...cardDetails,
                                cvc: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* UPI Form */}
                  {(onlineVendor === "gpay" || onlineVendor === "paytm") && (
                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          {onlineVendor === "gpay"
                            ? "Google Pay UPI ID"
                            : "Paytm UPI ID / Mobile Number"}
                        </label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder={
                              onlineVendor === "gpay"
                                ? "username@okhdfcbank"
                                : "username@paytm / 98XXXXXXXX"
                            }
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        You'll receive a payment request on your{" "}
                        {onlineVendor === "gpay" ? "Google Pay" : "Paytm"} app
                      </p>
                    </div>
                  )}

                  {/* Amount Display */}
                  <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex justify-between items-center text-sm">
                    <span className="font-bold text-green-800">
                      Total Amount:
                    </span>
                    <span className="font-black text-green-900 text-base">
                      ${((center.estimatedCost || 150) + 14.25).toFixed(2)}
                    </span>
                  </div>

                  {/* Secure Payment Note */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Lock className="h-3 w-3" />
                    <span>Secured by 256-bit SSL encryption</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3 rounded-xl tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    Authorize Payment Securely
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : !isBooked ? (
          /* =========================================================
             STANDARD CONFIGURATION STEP FLOW LAYOUT
             ========================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleConfigFormSubmit}
              className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6"
            >
              <div>
                <span className="text-xs font-bold tracking-wider text-green-700 px-3 py-1 bg-green-50 rounded-full">
                  Step-by-Step Allocation Flow
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
                  Configure Booking Entry
                </h2>
              </div>

              {/* STEP 1: Pre-Selected Center Context */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                  1. Pre-Selected Context Properties (Auto-filled)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <div className="text-sm font-bold text-gray-600 flex items-center gap-1">
                      <Wrench className="h-4 w-4 text-green-600" /> Service
                      Type:
                    </div>
                    <span className="inline-block text-sm font-bold uppercase text-green-800 bg-green-100 px-2 py-1 rounded-lg mt-1">
                      {center.serviceType.replace("_", " ")}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-600 flex items-center gap-1">
                      <Building className="h-4 w-4 text-green-600" /> Workshop
                      Hub:
                    </div>
                    <div className="text-sm font-bold text-gray-900 mt-0.5">
                      {center.name}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {center.address}
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2 & 3: Date and Time */}
              <div className="border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4 text-green-600" /> 2.
                    Appointment Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      required
                      placeholder="Select Date..."
                      value={formatDateString(selectedDate)}
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full border border-gray-300 rounded-xl pl-3 pr-10 py-2.5 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 cursor-pointer placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="absolute right-0 top-0 bottom-0 px-3 flex items-center text-gray-400 hover:text-green-600 border-l border-gray-200"
                    >
                      <CalendarIcon className="h-4 w-4 cursor-pointer" />
                    </button>
                  </div>

                  {showCalendar && (
                    <div className="absolute z-50 left-0 top-full mt-1 w-full border border-gray-200 rounded-xl p-4 bg-white shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-gray-900 tracking-tight">
                          {monthNames[currentMonth.getMonth()]}{" "}
                          {currentMonth.getFullYear()}
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleMonthNavigation(-1)}
                            className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMonthNavigation(1)}
                            className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                        <div>Su</div>
                        <div>Mo</div>
                        <div>Tu</div>
                        <div>We</div>
                        <div>Th</div>
                        <div>Fr</div>
                        <div>Sa</div>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-sm">
                        {Array.from({ length: firstDayIndex }).map((_, i) => (
                          <div key={`empty-${i}`} />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const dayNum = i + 1;
                          const isSelected =
                            selectedDate &&
                            selectedDate.getDate() === dayNum &&
                            selectedDate.getMonth() ===
                              currentMonth.getMonth() &&
                            selectedDate.getFullYear() ===
                              currentMonth.getFullYear();
                          return (
                            <button
                              key={`day-${dayNum}`}
                              type="button"
                              onClick={() => handleDateSelect(dayNum)}
                              className={`py-2 font-bold rounded-lg transition-all ${isSelected ? "bg-green-600 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"}`}
                            >
                              {dayNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-green-600" /> 3. Time Window
                    Slot
                  </label>
                  <Listbox value={bookingTime} onChange={setBookingTime}>
                    <div className="relative">
                      <Listbox.Button className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-left font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 flex items-center justify-between">
                        <span
                          className={
                            bookingTime ? "text-gray-900" : "text-gray-400"
                          }
                        >
                          {bookingTime || "Select an available block"}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-1 text-sm">
                        {[
                          {
                            value: "08:00 AM - 12:00 PM",
                            label: "Morning (08:00 AM - 12:00 PM)",
                          },
                          {
                            value: "12:00 PM - 04:00 PM",
                            label: "Afternoon (12:00 PM - 04:00 PM)",
                          },
                          {
                            value: "04:00 PM - 07:00 PM",
                            label: "Evening (04:00 PM - 07:00 PM)",
                          },
                        ].map((slot) => (
                          <Listbox.Option
                            key={slot.value}
                            value={slot.value}
                            className={({ active, selected }) =>
                              `cursor-pointer px-4 py-2.5 flex items-center justify-between ${active ? "bg-green-50 text-green-700" : "text-gray-700"} ${selected ? "bg-green-100 font-medium" : ""}`
                            }
                          >
                            {({ selected }) => (
                              <>
                                <span>{slot.label}</span>
                                {selected && (
                                  <Check className="h-4 w-4 text-green-600" />
                                )}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>
              </div>

              {/* STEP 4: Vehicle Details */}
              <div className="border-t border-gray-100 pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Car className="h-4 w-4 text-green-600" /> 4. Enter Vehicle
                  Details (Manual Entry)
                </label>
                <textarea
                  required
                  rows="4"
                  value={vehicleDetails}
                  onChange={(e) => setVehicleDetails(e.target.value)}
                  placeholder="Enter vehicle variant details, engine/chassis number, registration plate info, or primary system defects..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-gray-400"
                ></textarea>
              </div>

              {/* STEP 5: Payment Selection */}
              <div className="border-t border-gray-100 pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-2.5 flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4 text-green-600" /> 5. Payment
                  Selection Layer
                </label>
                <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <RadioGroup.Option value="pay_at_center">
                      {({ checked }) => (
                        <div
                          className={`border p-4 rounded-xl flex items-start gap-3 cursor-pointer transition-all ${checked ? "border-green-600 bg-green-50" : "border-gray-200 hover:bg-gray-50"}`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${checked ? "border-green-600 bg-green-600" : "border-gray-300"}`}
                          >
                            {checked && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-gray-900">
                              Pay At Workshop Bay
                            </span>
                            <span className="block text-xs text-gray-500 mt-0.5">
                              Pay in person after work inspection is finished.
                            </span>
                          </div>
                        </div>
                      )}
                    </RadioGroup.Option>
                    <RadioGroup.Option value="pay_online">
                      {({ checked }) => (
                        <div
                          className={`border p-4 rounded-xl flex items-start gap-3 cursor-pointer transition-all ${checked ? "border-green-600 bg-green-50" : "border-gray-200 hover:bg-gray-50"}`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${checked ? "border-green-600 bg-green-600" : "border-gray-300"}`}
                          >
                            {checked && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-gray-900">
                              Prepay via Online Gateway
                            </span>
                            <span className="block text-xs text-gray-500 mt-0.5">
                              Secure card processing, GPay or Paytm options.
                            </span>
                          </div>
                        </div>
                      )}
                    </RadioGroup.Option>
                  </div>
                </RadioGroup>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3.5 rounded-xl tracking-wider transition-all shadow-md hover:shadow-lg"
                >
                  {paymentMethod === "pay_online"
                    ? "Proceed to Online Gateway Selection"
                    : "Confirm & Dispatch Booking Order Request"}
                </button>
              </div>
            </form>

            {/* Right Side Column: Cost Details */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2 flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-green-600" /> Invoice
                  Summary
                </h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Base Workshop Fee</span>
                    <span>${center.estimatedCost || 150}.00</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Service Taxes Cover</span>
                    <span>$14.25</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 border-t border-dashed pt-2.5 text-base">
                    <span>Grand Total</span>
                    <span>
                      ${((center.estimatedCost || 150) + 14.25).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-700 p-5 rounded-2xl space-y-1.5 shadow-md">
                <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wide">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-white" />
                  </div>
                  Enterprise Shield
                </div>
                <p className="text-xs text-green-100 leading-relaxed">
                  Your workshop context parameters have been locked in place
                  dynamically from the center explorer interface.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================
             SUCCESS SCREEN
             ========================================================= */
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden p-6 text-center relative max-w-lg mx-auto">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-green-600 to-green-700" />

            <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-15" />
              <div className="w-14 h-14 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center relative shadow-sm">
                <CheckCircle2 className="h-7 w-7 fill-green-500 text-white stroke-[2.5]" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Booking Finalised!
            </h2>
            <p className="text-xs text-green-700 font-bold bg-green-50 border border-green-100 px-3 py-1 rounded-full w-fit mx-auto mt-1 flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="h-3 w-3" /> Flow Completed: Service Assigned
            </p>

            <div className="border border-gray-100 rounded-xl bg-gray-50 text-left p-4 my-4 space-y-2 text-sm">
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500 font-bold tracking-tight uppercase text-xs">
                  Assigned Center
                </span>
                <span className="font-bold text-gray-900 bg-white border border-gray-200 px-3 py-1 rounded-lg shadow-sm">
                  {center.name}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500 font-bold tracking-tight uppercase text-xs">
                  Target Date
                </span>
                <span className="font-bold text-gray-800 bg-white border border-gray-200 px-3 py-1 rounded-lg shadow-sm">
                  {formatDateString(selectedDate)}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500 font-bold tracking-tight uppercase text-xs">
                  Time Window
                </span>
                <span className="font-bold text-gray-800 bg-white border border-gray-200 px-3 py-1 rounded-lg shadow-sm">
                  {bookingTime}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-1.5">
                <span className="text-gray-500 font-bold tracking-tight uppercase text-xs">
                  Billing Verification
                </span>
                <span className="font-bold text-xs tracking-wider rounded-lg px-3 py-1 shadow-sm bg-green-600 text-white">
                  {paymentMethod === "pay_online"
                    ? `ONLINE (${onlineVendor.toUpperCase()})`
                    : "PAY AT BAY"}
                </span>
              </div>
              <div className="pt-0.5">
                <span className="block text-gray-500 font-bold tracking-tight uppercase text-xs mb-1">
                  Vehicle Data Payload
                </span>
                <p className="p-3 bg-white border border-gray-200 rounded-lg text-xs font-mono text-gray-600 max-h-16 overflow-y-auto break-words whitespace-pre-wrap leading-relaxed shadow-sm">
                  {vehicleDetails}
                </p>
              </div>
            </div>

            <button
              onClick={handleReturnToServices}
              className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white text-sm font-bold uppercase py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 tracking-wider"
            >
              Return to Services Dashboard <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingService;
