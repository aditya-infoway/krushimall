import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import * as Yup from "yup";

dayjs.extend(isBetween);



export const BasicInformationSchema = Yup.object({
  // Product Classification
  categoryId: Yup.number().required("Category is required"),
  brandId: Yup.number().required("Brand is required"),
  modelId: Yup.number().required("Model is required"),
  modelYearId: Yup.number().required("Model Year is required"),
  variantId: Yup.number().nullable(),
  variantCode: Yup.string().nullable(),

  // Tractor Details
  hp: Yup.number()
    .transform((v, o) => (o === "" ? null : v))
    .nullable()
    .typeError("HP must be a number"),

  manufacturingYear: Yup.number()
    .transform((v, o) => (o === "" ? undefined : v))
    .typeError("Manufacturing Year must be a number")
    .required("Manufacturing Year is required")
    .min(1900)
    .max(new Date().getFullYear()),

  purchaseYear: Yup.number()
    .transform((v, o) => (o === "" ? null : v))
    .nullable()
    .typeError("Purchase Year must be a number")
    .min(1900)
    .max(new Date().getFullYear()),

  rcRegistrationNumber: Yup.string()
    .trim()
    .required("RC Registration Number is required"),

  engineNumber: Yup.string()
    .trim()
    .required("Engine Number is required"),

  chassisNumber: Yup.string()
    .trim()
    .required("Chassis Number is required"),

  

  fuelType: Yup.string().required("Fuel Type is required"),

  driveType: Yup.string().required("Drive Type is required"),

  // Colors
  colors: Yup.object({
    red: Yup.boolean(),
    blue: Yup.boolean(),
    green: Yup.boolean(),
    orange: Yup.boolean(),
    black: Yup.boolean(),
    white: Yup.boolean(),
    custom: Yup.boolean(),
  }),

  customColorName: Yup.string().when("colors.custom", {
    is: true,
    then: (schema) => schema.required("Custom Color Name is required"),
    otherwise: (schema) => schema.nullable(),
  }),

  customColorCode: Yup.string().when("colors.custom", {
    is: true,
    then: (schema) => schema.required("Custom Color Code is required"),
    otherwise: (schema) => schema.nullable(),
  }),

  showCustomColor: Yup.boolean(),

  // Location
  country: Yup.string().required("Country is required"),

  availableStates: Yup.array()
    .min(1, "Select at least one state")
    .required(),

  availableDistricts: Yup.array()
    .min(1, "Select at least one district")
    .required(),

  taluka: Yup.string().nullable(),

  city: Yup.string().nullable(),

  // Ownership
  ownerType: Yup.string().required("Owner Type is required"),

  sellerType: Yup.string().required("Seller Type is required"),

  ownershipProofAvailable: Yup.boolean().nullable(),

  // Usage
  hoursMeterReading: Yup.number()
    .transform((v, o) => (o === "" ? undefined : v))
    .typeError("Hours Meter Reading must be a number")
    .required("Hours Meter Reading is required")
    .min(0),

  approxWorkingHours: Yup.number()
    .transform((v, o) => (o === "" ? null : v))
    .nullable()
    .typeError("Approx Working Hours must be a number")
    .min(0),

  acresWorked: Yup.number()
    .transform((v, o) => (o === "" ? null : v))
    .nullable()
    .typeError("Acres Worked must be a number")
    .min(0),

  purpose: Yup.string().required("Purpose is required"),

  // Additional
  availableDealers: Yup.array()
    .min(1, "Select at least one dealer")
    .required(),

  stockStatus: Yup.string().required("Stock Status is required"),
});



export const EnginedetailsSchema = Yup.object().shape({
  // Engine Specifications
  
  // Vehicle Inspection
  overallCondition: Yup.string().required("Overall Condition Required"),

  engineSelfStart: Yup.string().required("Self Start Working Required"),

  engineColdStart: Yup.string().required("Cold Start Required"),

  engineSmoke: Yup.string().required("Smoke Required"),

  engineSound: Yup.string().required("Engine Sound Required"),

  engineOilLeakage: Yup.string().required("Oil Leakage Required"),

  clutchCondition: Yup.string().required("Clutch Condition Required"),

  gearboxCondition: Yup.string().required("Gearbox Condition Required"),

  steeringType: Yup.string().required("Steering Type Required"),

  steeringCondition: Yup.string().required("Steering Condition Required"),

  brakesCondition: Yup.string().required("Brakes Condition Required"),

  batteryCondition: Yup.string().required("Battery Condition Required"),

  // Lights
  lightsHeadLight: Yup.boolean(),

  lightsIndicator: Yup.boolean(),

  lightsTailLight: Yup.boolean(),

  lightsHorn: Yup.boolean(),
});



export const TransmissionSchema = Yup.object().shape({
  // Service
  lastServiceDate: Yup.date()
    .nullable()
    .required("Last Service Date is required"),

  service: Yup.object().shape({
    engineOverhauled: Yup.string().required(
      "Please select Engine Overhauled"
    ),

    gearboxRepaired: Yup.string().required(
      "Please select Gearbox Repaired"
    ),

    clutchChanged: Yup.string().required(
      "Please select Clutch Changed"
    ),

    tyresChanged: Yup.string().required(
      "Please select Tyres Changed"
    ),

    batteryChanged: Yup.string().required(
      "Please select Battery Changed"
    ),
  }),

  // Accident
  accident: Yup.string().required("Accident Status is required"),

  // Flood
  floodDamage: Yup.string().required("Please select Flood Damage"),

  // Insurance
  insurance: Yup.string().required("Insurance Status is required"),

  insuranceExpiryDate: Yup.date()
    .nullable()
    .when("insurance", {
      is: "active",
      then: (schema) =>
        schema.required("Insurance Expiry Date is required"),
      otherwise: (schema) => schema.nullable(),
    }),

  // Finance
  finance: Yup.string().required("Please select Loan Remaining"),

  financeCompany: Yup.string().when("finance", {
    is: "yes",
    then: (schema) =>
      schema.trim().required("Finance Company is required"),
    otherwise: (schema) => schema.nullable(),
  }),

  outstandingAmount: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    )
    .nullable()
    .when("finance", {
      is: "yes",
      then: (schema) =>
        schema
          .required("Outstanding Amount is required")
          .positive("Outstanding Amount must be positive"),
      otherwise: (schema) => schema.nullable(),
    }),
});


export const HydraulicTyresSchema = Yup.object().shape({
  // Front Tyre
  frontTyreBrand: Yup.string()
    .trim()
    .required("Front Tyre Brand is required"),

  frontTyreRemainingPercent: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Front Tyre Remaining % must be a number")
    .required("Front Tyre Remaining % is required")
    .min(0, "Minimum value is 0")
    .max(100, "Maximum value is 100"),

  frontTyreCondition: Yup.string()
    .required("Front Tyre Condition is required"),

  // Rear Tyre
  rearTyreBrand: Yup.string()
    .trim()
    .required("Rear Tyre Brand is required"),

  rearTyreRemainingPercent: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Rear Tyre Remaining % must be a number")
    .required("Rear Tyre Remaining % is required")
    .min(0, "Minimum value is 0")
    .max(100, "Maximum value is 100"),

  rearTyreCondition: Yup.string()
    .required("Rear Tyre Condition is required"),

  // Hydraulic
  hydraulicLiftWorking: Yup.string()
    .required("Please select Hydraulic Lift Working"),

  hydraulicCondition: Yup.string()
    .required("Please select Hydraulic Condition"),

  // PTO
  ptoStatus: Yup.string()
    .required("Please select PTO Status"),

  // Attachments
  attachments: Yup.object().shape({
    rotavator: Yup.boolean(),
    cultivator: Yup.boolean(),
    trailer: Yup.boolean(),
    trolley: Yup.boolean(),
    mbPlough: Yup.boolean(),
    seedDrill: Yup.boolean(),
    sprayer: Yup.boolean(),
    dozer: Yup.boolean(),
    loader: Yup.boolean(),
  }),
});



export const PriceLocationSchema = Yup.object().shape({
  // Pricing
  expectedPrice: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Expected Price must be a number")
    .positive("Expected Price must be greater than 0")
    .required("Expected Price is required"),

  negotiable: Yup.string()
    .oneOf(["yes", "no"])
    .required("Negotiable is required"),

  exchangeOffer: Yup.string()
    .oneOf(["yes", "no"])
    .required("Exchange Availability is required"),

  financeAvailable: Yup.string()
    .oneOf(["yes", "no"])
    .required("Finance Availability is required"),

  // Location
  country: Yup.string()
    .trim()
    .required("Country is required"),

  state: Yup.string()
    .trim()
    .required("State is required"),

  district: Yup.string()
    .trim()
    .required("District is required"),

  taluka: Yup.string()
    .trim()
    .nullable(),

  city: Yup.string()
    .trim()
    .required("City is required"),

  pincode: Yup.string()
    .trim()
    .matches(/^[1-9][0-9]{5}$/, "Enter a valid pincode")
    .required("Pincode is required"),

  landmark: Yup.string()
    .trim()
    .nullable(),

  fullAddress: Yup.string()
    .trim()
    .required("Full Address is required"),

  latitude: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    )
    .nullable(),

  longitude: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    )
    .nullable(),
});

export const MediaDocumnetSchema = Yup.object().shape({
  frontView: Yup.mixed().required("Front View image is required"),
  leftView: Yup.mixed().required("Left View image is required"),
  rightView: Yup.mixed().required("Right View image is required"),
  rearView: Yup.mixed().required("Rear View image is required"),
  engineView: Yup.mixed().required("Engine View image is required"),
  dashboardView: Yup.mixed().required("Dashboard View image is required"),
  tyreView: Yup.mixed().required("Tyre View image is required"),
  hydraulicView: Yup.mixed().required("Hydraulic View image is required"),
  ptoView: Yup.mixed().required("PTO View image is required"),
  chassisNumberImage: Yup.mixed().required("Chassis Number image is required"),
  rcBook: Yup.mixed().required("RC Book image is required"),
  additionalImage1: Yup.mixed().nullable(),
  additionalImage2: Yup.mixed().nullable(),
  additionalImage3: Yup.mixed().nullable(),
  additionalImage4: Yup.mixed().nullable(),
  additionalImage5: Yup.mixed().nullable(),
  brochure: Yup.mixed().required("Brochure / Spec Sheet is required"),
  warrantyCard: Yup.mixed().required("Warranty Card is required"),
  insuranceCertificate: Yup.mixed().required(
    "Insurance Certificate is required",
  ),
  invoice: Yup.mixed().required("Invoice is required"),
  others: Yup.mixed().nullable(),
});

export const PreviewSubmitSchema = Yup.object().shape({
  agreed: Yup.boolean()
    .oneOf([true], "You must agree to the terms and conditions to submit")
    .required("Agreement required"),
});
