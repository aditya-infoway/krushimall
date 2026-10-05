import { useEffect, useState,useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import apiHelper from "../../utils/apiHelper";
// CustomListbox ko ek shared file me nikaal lo (ya yahan copy kar do)
// import { CustomListbox } from "./CustomListbox";
import { MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Combobox } from "@headlessui/react";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
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
 
export default function EntryType({
  step,
  setCurrentStep,
  onComplete,
  onAutoFill,
  entry,        // { mode, sourceId } parent se
  setEntry,
}) {
  const navigate = useNavigate();
  const [selectable, setSelectable] = useState([]);
  const { mode, sourceId } = entry;

  useEffect(() => {
    if (mode !== "auto" || selectable.length) return;
    (async () => {
      try {
        const res = await apiHelper.get("/vendor-web/website-variant/selectable");
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
        <h1 className="text-2xl font-bold text-gray-900">Entry Type</h1>
        <p className="text-sm text-gray-500 mt-1 mb-8">
          Product kaise add karna hai?
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { value: "manual", title: "Manual", desc: "Shuru se saari details khud bharo" },
              { value: "auto", title: "Auto", desc: "Vendor admin ke variant se details copy karo" },
            ].map((o) => (
              <label
                key={o.value}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  mode === o.value
                    ? "border-green-600 bg-green-50 ring-2 ring-green-600/20"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="entryMode"
                    checked={mode === o.value}
                    onChange={() => changeMode(o.value)}
                    className="h-4 w-4 text-green-600"
                  />
                  <span className="text-sm font-semibold text-gray-900">{o.title}</span>
                </div>
                <p className="mt-1 ml-6 text-xs text-gray-500">{o.desc}</p>
              </label>
            ))}
          </div>

          {mode === "auto" && (
            <div className="max-w-md">
              <CustomListbox
                data={options}
                value={options.find((o) => o.id === sourceId) || null}
                onChange={pickSource}
                displayField="label"
                placeholder="Select website variant"
                label="Select Website Variant"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-green-600 text-white hover:bg-green-700 shadow-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}