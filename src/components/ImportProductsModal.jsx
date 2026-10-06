import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { Upload, Download, X, FileSpreadsheet } from "lucide-react";
import apiHelper from "../utils/apiHelper";
import ExcelJS from "exceljs";
const TEMPLATE_HEADERS = [
  // Basic
  "Category", "Brand", "Model", "Model Year", "Variant",
  "Product Name", "Product Code", "SKU Code", "Launch Year",
  "Tractor Status", "Drive Type", "Short Description",
  "Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4", "Highlight 5",
  "Red", "Blue", "Green", "Orange", "Black", "White",
  "Available States", "Available Districts", "Available Dealers", "Stock Status",
  "SEO Title", "SEO URL", "Meta Description", "Keywords",
  // Engine
  "Engine Type", "Fuel Type", "Horse Power", "Number of Cylinders", "Cubic Capacity",
  "Rated RPM", "Aspirated Type", "Emission Norms", "Cooling System", "Air Filter Type",
  "Maximum Torque", "Torque RPM", "Torque Backup", "Engine Condition",
  // Transmission
  "Clutch Type", "Forward Gears", "Reverse Gears", "Gear Type", "Transmission Type",
  "PTO HP", "PTO RPM", "PTO Type", "PTO Position",
  "Creeper Gears", "Shuttle Shift", "Side Shift Gear", "Power Shuttle",
  "Hi Lo Gears", "Multi Speed PTO", "Reverse PTO", "Super Reducer",
  // Hydraulic
  "Lifting Capacity", "Lifting Capacity At 610mm", "Hydraulic Type",
  "ADDC", "Position Control", "Draft Control", "Control Type",
  "Remote Valve Type", "Number of Remote Valves", "Three Point Linkage",
  "Linkage Category", "Top Link", "Draft Sensitivity",
  "External Hydraulic Cylinder", "Self Levelling", "Quick Hitch",
  "Down Position Control", "Load Sensing", "Flow Control", "Return To Depth", "Transport Lock",
  // Pricing
  "Ex-Showroom Price", "On-Road Price", "Currency", "GST (%)",
  "TCS Applicable", "TCS (%)", "Finance Available", "EMI Available",
  "Down Payment", "Offer Price", "Negotiable", "Exchange Offer",
  // Location
  "Country", "State", "District", "Taluka", "City", "Pincode", "Landmark", "Full Address",
];
// TEMPLATE_HEADERS ke neeche add karo
const SAMPLE_DATA = {
  // Basic (names must match your master data exactly)
"Category": "mahindra",
"Brand": "sarpanchs",
"Model": "450DI",
"Model Year": "2026",
"Variant": "5520",
  "Product Name": "Farmtrac 50 Promaxx 4WD",
  "Product Code": "FT50-PX4",
  "SKU Code": "SKU-FT50-001",
  "Launch Year": "2024-01-15",
  "Tractor Status": "Available",
  "Drive Type": "4WD",
  "Short Description": "Powerful 50 HP 4WD tractor for heavy farm work",
  "Highlight 1": "50 HP engine",
  "Highlight 2": "12 forward + 3 reverse gears",
  "Highlight 3": "2000 kg lifting capacity",
  "Highlight 4": "Power steering",
  "Highlight 5": "Oil immersed brakes",
  "Red": "Yes",
  "Blue": "No",
  "Green": "No",
  "Orange": "No",
  "Black": "No",
  "White": "No",
  "Custom Color": "No",
"Custom Color Name": "",
"Custom Color Code": "",
"Upcoming": "No",
  "Available States": "GJ, MH",
  "Available Districts": "Rajkot, Ahmedabad",
  "Available Dealers": "dealer1, dealer2",
  "Stock Status": "In Stock",
  "SEO Title": "Farmtrac 50 Promaxx 4WD Price and Specs",
  "SEO URL": "farmtrac-50-promaxx-4wd",
  "Meta Description": "Check price, specs and features of Farmtrac 50 Promaxx 4WD.",
  "Keywords": "farmtrac, 50 hp tractor, 4wd tractor",

  // Engine
  "Engine Type": "Diesel",
  "Fuel Type": "Diesel",
  "Horse Power": 50,
  "Number of Cylinders": "3",
  "Cubic Capacity": 3068,
  "Rated RPM": 2000,
  "Aspirated Type": "Turbocharged",
  "Emission Norms": "BS IV",
  "Cooling System": "Water Cooled",
  "Air Filter Type": "Dry Type",
  "Maximum Torque": 200,
  "Torque RPM": 1600,
  "Torque Backup": 20,
  "Engine Condition": "New",

  // Transmission
  "Clutch Type": "Dual Clutch",
  "Forward Gears": 12,
  "Reverse Gears": 3,
  "Gear Type": "Constant Mesh",
  "Transmission Type": "Synchromesh",
  "PTO HP": 42,
  "PTO RPM": 540,
  "PTO Type": "Live",
  "PTO Position": "Rear",
  "Creeper Gears": "No",
  "Shuttle Shift": "No",
  "Side Shift Gear": "Yes",
  "Power Shuttle": "No",
  "Hi Lo Gears": "No",
  "Multi Speed PTO": "Yes",
  "Reverse PTO": "No",
  "Super Reducer": "No",

  // Hydraulic
  "Lifting Capacity": 2000,
  "Lifting Capacity At 610mm": 1800,
  "Hydraulic Type": "ADDC",
  "ADDC": "Yes",
  "Position Control": "Yes",
  "Draft Control": "Yes",
 "Control Type": "Automatic",
  "Remote Valve Type": "Single Acting",
  "Number of Remote Valves": "1",
 "Three Point Linkage": "cat1",
  "Linkage Category": "Category1",
  "Top Link": "Adjustable",
  "Draft Sensitivity": "High",
  "External Hydraulic Cylinder": "No",
  "Self Levelling": "No",
  "Quick Hitch": "No",
  "Down Position Control": "Yes",
  "Load Sensing": "No",
  "Flow Control": "Yes",
  "Return To Depth": "Yes",
  "Transport Lock": "Yes",

  // Pricing
  "Ex-Showroom Price": 800000,
  "On-Road Price": 900000,
  "Currency": "INR",
  "GST (%)": 18,
  "TCS Applicable": "Yes",
  "TCS (%)": 1,
  "Finance Available": "Yes",
  "EMI Available": "Yes",
  "Down Payment": 100000,
  "Offer Price": 780000,
  "Negotiable": "Yes",
  "Exchange Offer": "Yes",

  // Location
  "Country": "IN",
  "State": "GJ",
  "District": "Rajkot",
  "Taluka": "Rajkot",
  "City": "Rajkot",
  "Pincode": "360001",
  "Landmark": "Near Bus Stand",
  "Full Address": "123, Main Road, Rajkot, Gujarat",
};
export default function ImportProductsModal({ open, onClose, onImported }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!open) return null;

  const reset = () => {
    setFileName("");
    setRows([]);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

 // downloadTemplate replace karo
const downloadTemplate = async () => {
  try {
    const res = await apiHelper.get("/vendor-web/website-variant/import-options");
    const opt = res.data?.data || {};
    const cats = opt.categories || [];

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Products");
    const lists = wb.addWorksheet("Lists");

    ws.columns = TEMPLATE_HEADERS.map((h) => ({ header: h, width: 20 }));
    ws.addRow(TEMPLATE_HEADERS.map((h) => SAMPLE_DATA[h] ?? ""));
    ws.getRow(1).font = { bold: true };

    // ---- Lists sheet: A = categories, phir (parent, child) ke jode ----
    const writeCol = (col, values) =>
      values.forEach((v, i) => (lists.getCell(i + 1, col).value = v));

    const sortPairs = (p) => [...(p || [])].sort((a, b) => a[0].localeCompare(b[0]));
    const levels = [opt.brands, opt.models, opt.modelYears, opt.variants].map(sortPairs);

    writeCol(1, cats);
    levels.forEach((p, i) => {
      writeCol(2 + i * 2, p.map((x) => x[0])); // parent
      writeCol(3 + i * 2, p.map((x) => x[1])); // child
    });
    lists.state = "hidden";

    // ---- Dropdowns (rows 2..1001, import limit 1000 rows) ----
    const LAST = 1001;
    const errorMsg = { showErrorMessage: true, errorTitle: "Invalid", error: "Dropdown se select karo" };

    for (let r = 2; r <= LAST; r++) {
      // A: Category
      ws.getCell(`A${r}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [`Lists!$A$1:$A$${Math.max(cats.length, 1)}`],
        ...errorMsg,
      };

      // B..E: Brand, Model, Model Year, Variant (parent ke hisaab se filter)
      levels.forEach((p, i) => {
        const n = Math.max(p.length, 1);
        const parentCell = `$${"ABCD"[i]}${r}`; // upar wale column ki value
        const pc = String.fromCharCode(66 + i * 2); // Lists mein parent column
        const cc = String.fromCharCode(67 + i * 2); // Lists mein child column
        const formula =
          `OFFSET(Lists!$${cc}$1,MATCH(${parentCell},Lists!$${pc}$1:$${pc}$${n},0)-1,0,` +
          `COUNTIF(Lists!$${pc}$1:$${pc}$${n},${parentCell}),1)`;

        ws.getCell(`${"BCDE"[i]}${r}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [formula],
          ...errorMsg,
        };
      });
    }

    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-import-template.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    toast.error("Template download failed");
  }
};

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      toast.error("Please select an .xlsx, .xls or .csv file");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      // defval: "" so empty cells still appear as keys
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: true });

      if (!json.length) {
        toast.error("No rows found in the file");
        return;
      }
      setFileName(file.name);
      setRows(json);
      setResult(null);
    } catch (err) {
      console.error(err);
      toast.error("Unable to read the file");
    }
  };

  const handleImport = async () => {
    if (!rows.length) return;
    try {
      setLoading(true);
      const res = await apiHelper.post("/vendor-web/website-variant/import", {
        rows,
      });
      const data = res.data?.data || res.data;
      setResult(data);

      if (data.created > 0) {
        toast.success(`${data.created} products imported`);
        onImported?.();
      } else {
        toast.error("No products were imported");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Import failed");
    } finally {
      setLoading(false);
    }
  };

  const previewHeaders = rows[0] ? Object.keys(rows[0]).slice(0, 6) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Import Products</h2>
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <button
            type="button"
            onClick={downloadTemplate}
            className="flex cursor-pointer items-center gap-2 text-sm font-medium text-green-700 hover:underline"
          >
            <Download className="h-4 w-4" />
            Download sample template
          </button>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-8 text-center hover:border-green-500">
            {fileName ? (
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
            <span className="text-sm text-gray-700">
              {fileName
                ? `${fileName} (${rows.length} rows)`
                : "Select an Excel / CSV file"}
            </span>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFile}
              className="hidden"
            />
          </label>

          {rows.length > 0 && !result && (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    {previewHeaders.map((h) => (
                      <th key={h} className="px-3 py-2 font-semibold text-gray-700">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 5).map((r, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      {previewHeaders.map((h) => (
                        <td key={h} className="px-3 py-2 text-gray-600">
                          {String(r[h])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-gray-100 px-3 py-2 text-xs text-gray-500">
                Preview: first 5 rows
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-2 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
              <p className="font-semibold text-gray-900">
                {result.created} imported, {result.failed} failed
              </p>

              {result.ignoredColumns?.length > 0 && (
                <p className="text-amber-700">
                  These columns do not exist in the table and were skipped:{" "}
                  <span className="font-medium">
                    {result.ignoredColumns.join(", ")}
                  </span>
                </p>
              )}

              {result.errors?.length > 0 && (
                <ul className="max-h-40 list-disc space-y-1 overflow-auto pl-5 text-red-600">
                  {result.errors.map((er, i) => (
                    <li key={i}>
                      Row {er.row}: {er.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!rows.length || loading || !!result}
            className="cursor-pointer rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Importing..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
}