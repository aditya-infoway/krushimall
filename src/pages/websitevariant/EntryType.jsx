import { useEffect, useState, useRef, Fragment } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Combobox, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/24/outline";
import { PencilLine, Copy, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiHelper from "../../utils/apiHelper";

const CustomListbox = ({
  data,
  value,
  onChange,
  displayField,
  placeholder,
  label,
  error,
}) => {
  const [query, setQuery] = useState("");
  const buttonRef = useRef(null);

  const filteredData =
    query === ""
      ? data
      : data?.filter((item) =>
          (item[displayField] || item.label || "")
            .toLowerCase()
            .includes(query.toLowerCase()),
        );

  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <Combobox
        value={value}
        onChange={(option) => {
          onChange(option);
          setQuery("");
        }}
      >
        <div className="relative">
          <div className="relative">
            <Combobox.Input
              className={`w-full cursor-default rounded-xl border bg-white py-3 pl-10 pr-4 text-left text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
                error ? "border-red-300 bg-red-50" : "border-gray-200"
              }`}
              displayValue={(item) => (item ? item[displayField] : "")}
              placeholder={placeholder}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => buttonRef.current?.click()}
            />
            <Combobox.Button
              ref={buttonRef}
              className="absolute inset-y-0 left-0 flex items-center pl-3"
            >
              <MagnifyingGlassIcon
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {filteredData?.length ? (
                filteredData.map((item) => (
                  <Combobox.Option
                    key={item.id || item.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-green-100 text-green-900" : "text-gray-900"
                      }`
                    }
                    value={item}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {item[displayField] || item.label}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                            <CheckIcon className="h-4 w-4" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-400">
                  No results found
                </div>
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

const ENTRY_MODES = [
  {
    value: "manual",
    title: "Manual",
    desc: "Fill in all product details yourself, starting from scratch.",
    icon: PencilLine,
  },
  {
    value: "auto",
    title: "Auto",
    desc: "Copy details from an existing website variant and edit them.",
    icon: Copy,
  },
];

export default function EntryType({
  step,
  setCurrentStep,
  onComplete,
  onAutoFill,
  entry, // { mode, sourceId } parent se
  setEntry,
}) {
  const navigate = useNavigate();
  const [selectable, setSelectable] = useState([]);
  const { mode, sourceId } = entry;

  useEffect(() => {
    if (mode !== "auto" || selectable.length) return;
    (async () => {
      try {
        const res = await apiHelper.get(
          "/vendor-web/website-variant/selectable",
        );
        setSelectable(res?.data?.data || res?.data || res || []);
      } catch (e) {
        console.error(e);
        toast.error("Failed to load variants");
      }
    })();
  }, [mode]);

  const options = selectable.map((v) => ({
    id: v.id,
    label: `${v.productName || "Untitled"} (${v.variantCode || "-"})`,
    raw: v,
  }));

  const selectedOption = options.find((o) => o.id === sourceId) || null;

  const changeMode = (m) => {
    setEntry({ mode: m, sourceId: null });
    onAutoFill?.(null);
  };

  const pickSource = (opt) => {
    if (!opt) return;
    setEntry({ mode: "auto", sourceId: opt.id });
    onAutoFill?.(opt.raw);
  };

  const handleNext = () => {
    if (mode === "auto" && !sourceId) {
      toast.error("Pehle ek variant select karo");
      return;
    }
    onComplete?.(step);
    setCurrentStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16">
      <div className="w-full max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Entry Type</h1>
          <p className="text-sm text-gray-500 mt-1">
            Choose how you want to add this product
          </p>
        </div>

        {/* Card (overflow-hidden nahi lagaya, warna dropdown cut ho jayega) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {ENTRY_MODES.map((o) => {
              const Icon = o.icon;
              const active = mode === o.value;

              return (
                <label
                  key={o.value}
                  className={`group relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 ${
                    active
                      ? "border-green-600 bg-green-50 shadow-md shadow-green-100"
                      : "border-gray-200 bg-white hover:border-green-300 hover:shadow-sm"
                  }`}
                >
                  {/* Radio visually hidden, but accessible */}
                  <input
                    type="radio"
                    name="entryMode"
                    checked={active}
                    onChange={() => changeMode(o.value)}
                    className="sr-only"
                  />

                  {/* Selected check badge */}
                  <AnimatePresence>
                    {active && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-3 top-3 text-green-600"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                      active
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <p className="mt-4 text-base font-semibold text-gray-900">
                    {o.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    {o.desc}
                  </p>
                </label>
              );
            })}
          </div>

          {/* Auto mode: variant picker */}
          <AnimatePresence initial={false}>
            {mode === "auto" && (
              <motion.div
                key="auto-picker"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-gray-200 bg-gray-50 p-5"
              >
                <CustomListbox
                  data={options}
                  value={selectedOption}
                  onChange={pickSource}
                  displayField="label"
                  placeholder="Select website variant"
                  label="Select Website Variant"
                />

                {selectedOption ? (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <p className="text-xs text-green-800">
                      Details will be copied from{" "}
                      <span className="font-semibold">
                        {selectedOption.label}
                      </span>
                      . You can edit everything in the next steps.
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-gray-500">
                    Pick a variant to pre-fill all the steps.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cursor-pointer rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-700"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}