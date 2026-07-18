import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import * as Yup from "yup";

dayjs.extend(isBetween);

export const BasicInformationSchema = Yup.object().shape({
  brandId: Yup.string().trim().required("Brand Name Required"),
  modelId: Yup.string().trim().required("Model Name Required"),
  variantId: Yup.string().required("Variant Name is required"),
  categoryId: Yup.string().required("Tractor Category is required"),
  productName: Yup.string().required("Tractor Product Name is required"),
  productCode: Yup.string().trim(),
  skuCode: Yup.string().trim(),
  launchYear: Yup.string().nullable(),
  modelYearId: Yup.string().required("Model Year is required"),
  country: Yup.string().trim(),
  tractorStatus: Yup.string().trim().required("Tractor Status Required"),

  shortDescription: Yup.string()
    .trim()
    .max(200, "Maximum 200 characters allowed"),

  highlights: Yup.object().shape({
    highlight1: Yup.string().trim(),
    highlight2: Yup.string().trim(),
    highlight3: Yup.string().trim(),
    highlight4: Yup.string().trim(),
    highlight5: Yup.string().trim(),
  }),

  colors: Yup.object().shape({
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
    then: (schema) => schema.trim().required("Please enter custom color name"),
    otherwise: (schema) => schema.trim().nullable(),
  }),
  customColorCode: Yup.string().when("colors.custom", {
    is: true,
    then: (schema) => schema.required("Please select custom color"),
    otherwise: (schema) => schema.nullable(),
  }),
  showCustomColor: Yup.boolean(),

  availableStates: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one state")
    .required("Available States Required"),
  availableDistricts: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one district")
    .required("Available Districts Required"),
  availableDealers: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one dealer")
    .required("Available Dealers Required"),
  stockStatus: Yup.string().trim().required("Stock Status Required"),

  seoTitle: Yup.string().trim(),
  seoUrl: Yup.string().trim(),
  metaDescription: Yup.string()
    .trim()
    .max(160, "Maximum 160 characters allowed"),
  keywords: Yup.string().trim(),
});

export const EnginedetailsSchema = Yup.object().shape({
  engineType: Yup.string().trim().required("Engine Type Required"),
  fuelType: Yup.string().trim().required("Fuel Type Required"),
  horsePower: Yup.number()
    .typeError("Horse Power must be a number")
    .positive("Horse Power must be positive")
    .required("Horse Power Required"),
  numberOfCylinders: Yup.string()
    .trim()
    .required("Number of Cylinders Required"),
  cubicCapacity: Yup.number()
    .typeError("Cubic Capacity must be a number")
    .positive("Cubic Capacity must be positive")
    .required("Cubic Capacity Required"),
  ratedRpm: Yup.number()
    .typeError("Rated RPM must be a number")
    .positive("Rated RPM must be positive")
    .required("Rated RPM Required"),
  aspiratedType: Yup.string().trim().required("Aspirated Type Required"),
  emissionNorms: Yup.string().trim().required("Emission Norms Required"),
  coolingSystem: Yup.string().trim().required("Cooling System Required"),
  airFilterType: Yup.string().trim().required("Air Filter Type Required"),
  maximumTorque: Yup.number()
    .typeError("Maximum Torque must be a number")
    .nullable(),
  torqueRpm: Yup.number().typeError("Torque RPM must be a number").nullable(),
  torqueBackup: Yup.number()
    .typeError("Torque Backup must be a number")
    .nullable(),
  engineCondition: Yup.string().trim().required("Engine Condition Required"),
});

export const TransmissionSchema = Yup.object().shape({
  clutchType: Yup.string().trim().required("Clutch Type Required"),
  forwardGears: Yup.number()
    .typeError("Forward Gears must be a number")
    .positive("Forward Gears must be positive")
    .required("Forward Gears Required"),
  reverseGears: Yup.number()
    .typeError("Reverse Gears must be a number")
    .positive("Reverse Gears must be positive")
    .required("Reverse Gears Required"),
  gearType: Yup.string().trim().required("Gear Type Required"),
  transmissionType: Yup.string()
    .trim()
    .required("Transmission Type Required"),
  ptoHp: Yup.number()
    .typeError("PTO HP must be a number")
    .positive("PTO HP must be positive")
    .required("PTO HP Required"),
  ptoRpm: Yup.number()
    .typeError("PTO RPM must be a number")
    .positive("PTO RPM must be positive")
    .required("PTO RPM Required"),
  ptoType: Yup.string().trim().required("PTO Type Required"),
  ptoPosition: Yup.string().trim().required("PTO Position Required"),
  features: Yup.object().shape({
    creeperGears: Yup.boolean(),
    shuttleShift: Yup.boolean(),
    sideShiftGear: Yup.boolean(),
    powerShuttle: Yup.boolean(),
    hiLoGears: Yup.boolean(),
    multiSpeedPto: Yup.boolean(),
    reversePto: Yup.boolean(),
    superReducer: Yup.boolean(),
  }),
});

export const HydraulicTyresSchema = Yup.object().shape({
  liftingCapacity: Yup.number()
    .typeError("Lifting capacity must be a number")
    .positive("Lifting capacity must be positive")
    .required("Lifting Capacity Required"),
  hydraulicType: Yup.string().trim(),
  liftingCapacityAt610mm: Yup.string().nullable(),
  controlType: Yup.string().trim(),
  threePointLinkage: Yup.string().required("Please select linkage type"),
  linkageCategory: Yup.string().required("Please select linkage category"),
  topLink: Yup.string().required("Please select top link"),
  draftSensitivity: Yup.string().required("Please select draft sensitivity"),
  remoteValveType: Yup.string().trim(),
  numberOfRemoteValves: Yup.string().trim(),
  features: Yup.object().shape({
    externalHydraulicCylinder: Yup.boolean(),
    selfLevelling: Yup.boolean(),
    quickHitch: Yup.boolean(),
    downPositionControl: Yup.boolean(),
    loadSensing: Yup.boolean(),
    flowControl: Yup.boolean(),
    returnToDepth: Yup.boolean(),
    transportLock: Yup.boolean(),
  }),
});

export const PriceLocationSchema = Yup.object().shape({
  exShowroomPrice: Yup.number()
    .typeError("Ex-Showroom Price must be a number")
    .positive("Ex-Showroom Price must be positive")
    .required("Ex-Showroom Price Required"),
  onRoadPrice: Yup.number()
    .typeError("On-Road Price must be a number")
    .positive("On-Road Price must be positive")
    .nullable(),
  currency: Yup.string().trim().required("Currency Required"),
  gst: Yup.number()
    .typeError("GST must be a number")
    .min(0, "GST cannot be negative")
    .default(18),
  tcsApplicable: Yup.string().trim().oneOf(["yes", "no"]),
  tcsPercentage: Yup.number()
    .typeError("TCS Percentage must be a number")
    .min(0, "TCS Percentage cannot be negative")
    .when("tcsApplicable", {
      is: "yes",
      then: (schema) => schema.required("TCS Percentage Required"),
      otherwise: (schema) => schema.nullable(),
    }),
  exchangeOffer: Yup.string()
    .trim()
    .oneOf(["yes", "no"])
    .required("Exchange Offer Required"),
  financeAvailable: Yup.string()
    .trim()
    .oneOf(["yes", "no"])
    .required("Finance Availability Required"),
  emiAvailable: Yup.string()
    .trim()
    .oneOf(["yes", "no"])
    .required("EMI Availability Required"),
  downPayment: Yup.number()
    .typeError("Down Payment must be a number")
    .positive("Down Payment must be positive")
    .nullable(),
  offerPrice: Yup.number()
    .typeError("Offer Price must be a number")
    .positive("Offer Price must be positive")
    .nullable(),
  negotiable: Yup.string().trim().oneOf(["yes", "no"]),
  country: Yup.string().trim(),
  state: Yup.string().trim().required("State Required"),
  district: Yup.string().trim().required("District Required"),
  taluka: Yup.string().trim(),
  city: Yup.string().trim().required("City/Village Required"),
  pincode: Yup.string()
    .trim()
    .matches(/^[1-9][0-9]{5}$/, "Enter a valid pincode")
    .required("Pincode Required"),
  landmark: Yup.string().trim(),
  fullAddress: Yup.string().trim().required("Full Address Required"),
  searchLocation: Yup.string().trim(),
  latitude: Yup.number().nullable(),
  longitude: Yup.number().nullable(),
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
  chassisNumber: Yup.mixed().required("Chassis Number image is required"),
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