import { useEffect, useState, useRef, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Dialog,
  Transition,
  TransitionChild,
  Listbox,
} from "@headlessui/react";
import {
  Phone,
  PhoneOff,
  PhoneOutgoing,
  WifiOff,
  Wifi,
  Power,
  XCircle,
  Clock,
  MoreHorizontal,
  Plus,
  ArrowLeft,
  X,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeftRight,
  RotateCcw,
  MessageCircle,
  Calendar,
} from "lucide-react";
import apiHelper from "../utils/apiHelper";
import { showSuccessToast, showErrorToast } from "../utils/toast";

// -- Column / status definitions --------------------------------------
const columns = [
  { title: "New", color: "text-blue-600", bg: "bg-blue-50", icon: Plus },
  {
    title: "Connected",
    color: "text-green-600",
    bg: "bg-green-50",
    icon: Phone,
  },
  {
    title: "Not Connected",
    color: "text-red-600",
    bg: "bg-red-50",
    icon: PhoneOff,
  },
  {
    title: "Busy",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    icon: WifiOff,
  },
  {
    title: "Switch Off",
    color: "text-gray-500",
    bg: "bg-gray-100",
    icon: Power,
  },
  { title: "Rejected", color: "text-red-500", bg: "bg-red-50", icon: XCircle },
  {
    title: "Waiting",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    icon: Clock,
  },
  {
    title: "Out Of Network",
    color: "text-purple-500",
    bg: "bg-purple-50",
    icon: Wifi,
  },
  {
    title: "Call Back",
    color: "text-orange-500",
    bg: "bg-orange-50",
    icon: PhoneOutgoing,
  },
  {
    title: "Other",
    color: "text-slate-500",
    bg: "bg-slate-100",
    icon: MoreHorizontal,
  },
];

const responseOptions = columns
  .filter((c) => c.title !== "New")
  .map((c) => ({ label: c.title, value: c.title, color: c.color }));

// -- small date helper -----------------------------------------------------
function formatDisplayDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString("en-GB");
}

// -- Headless UI dropdown for Call Response, built inline (no custom lib) --
function ResponseListbox({ value, onChange, error }) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className={`flex w-full items-center justify-between rounded-xl border bg-white py-3 pl-4 pr-3 text-left text-sm outline-none transition-all
            focus:border-green-600 focus:ring-2 focus:ring-green-600
            ${error ? "border-red-300 bg-red-50" : "border-gray-200"}`}
        >
          <span className={value ? "text-gray-900" : "text-gray-400"}>
            {value ? value.label : "Select Call Response"}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
            {responseOptions.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? "bg-green-50" : ""
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`${option.color} ${selected ? "font-medium" : "font-normal"}`}
                    >
                      {option.label}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </Listbox>
  );
}

// -- Calendar-style DatePicker, same as the one used in BasicInformation.jsx --
function DatePicker({
  value,
  onChange,
  label,
  error,
  placeholder = "Select date...",
}) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value || new Date());
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) setViewDate(value);
  }, [value]);

  const formatDisplay = (date) =>
    date
      ? date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "";

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isSameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const handleSelectDay = (day) => {
    onChange(new Date(year, month, day));
    setOpen(false);
  };

  const goPrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const goNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const weeks = [];
  let day = 1 - firstDayOfMonth;
  while (day <= daysInMonth) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(day > 0 && day <= daysInMonth ? day : null);
      day++;
    }
    weeks.push(week);
  }

  return (
    <div ref={wrapperRef} className="relative">
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`relative w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-left text-sm outline-none transition-all
          focus:border-green-600 focus:ring-2 focus:ring-green-600
          ${error ? "border-red-300 bg-red-50" : "border-gray-200"}`}
      >
        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={goPrevMonth}
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-green-50 hover:text-green-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-gray-900">
              {viewDate.toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              type="button"
              onClick={goNextMonth}
              className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-green-50 hover:text-green-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div
                key={d}
                className="py-1 text-center text-[11px] font-medium text-gray-400"
              >
                {d}
              </div>
            ))}
          </div>

          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((d, di) => {
                const thisDate = d ? new Date(year, month, d) : null;
                const selected = isSameDay(thisDate, value);
                return (
                  <button
                    type="button"
                    key={di}
                    disabled={!d}
                    onClick={() => d && handleSelectDay(d)}
                    className={`h-8 w-8 rounded-lg text-sm transition-colors ${
                      !d
                        ? "invisible"
                        : selected
                          ? "bg-green-600 font-medium text-white"
                          : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className="mt-3 text-xs text-gray-500 transition-colors hover:text-red-500"
          >
            Clear
          </button>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default function VendorFollowup() {
  // `id` here is the enquiry id the follow-up board is scoped to
  const { id } = useParams();
  const navigate = useNavigate();

  const [enquiry, setEnquiry] = useState(null);
  const [followups, setFollowups] = useState([]);
  const [followupCount, setFollowupCount] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const [nextDate, setNextDate] = useState(null);
  const [callTime, setCallTime] = useState("");
  const [callResponse, setCallResponse] = useState(null);
  const [discussion, setDiscussion] = useState("");

  const [errors, setErrors] = useState({});

  // -- data loading -----------------------------------------------------
  const fetchEnquiry = async () => {
    try {
      const res = await apiHelper.get(`/vendor-web/website-enquiry/${id}`);
      setEnquiry(res.data || res);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFollowups = async () => {
    try {
      const res = await apiHelper.get(
        `/vendor-web/website-enquiry-followup/enquiry/${id}`,
      );

      setFollowups(res.data || []);
      setFollowupCount(res.total || 0);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEnquiry();
      fetchFollowups();
    }
  }, [id]);

  const displayFollowups =
    followups.length === 0 && enquiry
      ? [
          {
            id: enquiry.id,
            expectedPurchaseDate: enquiry.expectedPurchaseDate,
            nextScheduledDate: enquiry.followUpDate,
            callResponse: "New",
          },
        ]
      : followups;

  // -- form handling ------------------------------------------------------
  const validateForm = () => {
    const newErrors = {};
    if (!nextDate) newErrors.nextDate = "Next Scheduled Date is required";
    if (!callTime) newErrors.callTime = "Call Time is required";
    if (!callResponse) newErrors.callResponse = "Call Response is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetFormState = () => {
    setNextDate(null);
    setCallTime("");
    setCallResponse(null);
    setDiscussion("");
    setErrors({});
  };

  const handleSaveFollowup = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        enquiryId: Number(id),

        expectedPurchaseDate: enquiry?.expectedPurchaseDate || null,
        nextScheduledDate: nextDate
          ? nextDate.toLocaleDateString("en-CA")
          : null,
        callTime,
        callResponse: callResponse?.value,
        discussion,
      };

      await apiHelper.post(`/vendor-web/website-enquiry-followup`, payload);

      showSuccessToast("Follow-up added successfully!");
      setOpenModal(false);
      resetFormState();
      await fetchFollowups();
    } catch (error) {
      console.error(error);
      showErrorToast(
        error.response?.data?.message ||
          "Failed to save follow-up. Please try again.",
      );
    }
  };

  const openFollowupDrawer = (item) => {
    setNextDate(
      item.nextScheduledDate ? new Date(item.nextScheduledDate) : null,
    );
    setCallTime(item.callTime || "");
    setCallResponse(
      responseOptions.find((o) => o.value === item.callResponse) || null,
    );
    setDiscussion(item.discussion || "");
    setErrors({});
    setOpenModal(true);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Follow-up</h1>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 cursor-pointer rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {columns.map((column) => (
          <div
            key={column.title}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="flex items-center gap-2 border-b border-gray-200 p-3 font-semibold">
              <column.icon className={`h-5 w-5 ${column.color}`} />
              <span className={column.color}>{column.title}</span>
            </div>

            <div className="min-h-[280px] p-2">
              {displayFollowups
                .filter((item) => item.callResponse === column.title)
                .map((item) => (
                  <div
                    key={item.id}
                    className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm"
                  >
                    <div className="mb-2 text-sm font-semibold text-green-600">
                      {enquiry?.fullName || "Customer"}
                    </div>

                    <div className="mb-1 text-sm text-gray-600">
                      EX. Date : {formatDisplayDate(item.expectedPurchaseDate)}
                    </div>
                    <div className="mb-1 text-sm text-gray-600">
                      F-up Date : {formatDisplayDate(item.nextScheduledDate)}
                    </div>
                    <div className="mb-4 text-sm text-gray-600">
                      Time : {item.callTime || "-"}
                    </div>

                    <div className="mb-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs ${column.color} border-current`}
                      >
                        {item.callResponse}
                      </span>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-2 text-gray-500">
                      <button
                        onClick={() => openFollowupDrawer(item)}
                        className="cursor-pointer transition-colors hover:text-green-600"
                        title="Update"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </button>
                      <button
                        className="cursor-pointer transition-colors hover:text-green-600"
                        title="Transfer"
                      >
                        <ArrowLeftRight className="h-5 w-5" />
                      </button>
                      <button
                        className="cursor-pointer transition-colors hover:text-green-600"
                        title="Follow Up"
                      >
                        <RotateCcw className="h-5 w-5" />
                      </button>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-5 w-5 cursor-pointer transition-colors hover:text-green-600" />
                        <span className="text-xs text-gray-400">
                          {item.callResponse === "New" ? 0 : followupCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Centered modal to add / update a follow-up */}
      <Transition appear show={openModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[9999]"
          onClose={() => setOpenModal(false)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto pt-10 sm:pt-10">
            <div className="flex min-h-full items-start justify-center p-4 pb-10">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex max-h-[75vh] w-full max-w-md transform-gpu flex-col rounded-2xl bg-white text-left align-middle shadow-2xl transition-all">
                  {/* Header — stays put even if the fields below need to scroll */}
                  <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
                    <Dialog.Title className="text-lg font-semibold text-gray-900">
                      Add Follow-up
                    </Dialog.Title>
                    <button
                      type="button"
                      onClick={() => setOpenModal(false)}
                      className="rounded-full cursor-pointer p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Fields */}
                  <div className="space-y-5 overflow-y-auto px-6 py-5">
                    <DatePicker
                      label="Next Scheduled Date"
                      value={nextDate}
                      onChange={setNextDate}
                      error={errors.nextDate}
                      placeholder="Select follow-up date..."
                    />

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Call Time
                      </label>
                      <input
                        type="time"
                        value={callTime}
                        onChange={(e) => setCallTime(e.target.value)}
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all
                          focus:border-green-600 focus:ring-2 focus:ring-green-600
                          ${errors.callTime ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                      />
                      {errors.callTime && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.callTime}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Call Response
                      </label>
                      <ResponseListbox
                        value={callResponse}
                        onChange={setCallResponse}
                        error={errors.callResponse}
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Call Discussion
                      </label>
                      <textarea
                        rows={4}
                        value={discussion}
                        onChange={(e) => setDiscussion(e.target.value)}
                        placeholder="Enter discussion..."
                        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:border-green-600 focus:ring-2 focus:ring-green-600"
                      />
                    </div>
                  </div>

                  {/* Footer — also stays put, matching the fixed header */}
                  <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
                    <button
                      type="button"
                      onClick={() => setOpenModal(false)}
                      className="h-10 w-1/2 rounded-xl border cursor-pointer border-gray-300 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveFollowup}
                      className="h-10 w-1/2 rounded-xl cursor-pointer bg-green-600 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                    >
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
