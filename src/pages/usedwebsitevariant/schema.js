import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import * as Yup from "yup";

dayjs.extend(isBetween);

export const BasicInformationSchema = Yup.object().shape({
  // Product Classification
  categoryId: Yup.number().nullable().required("Category is required"),
  brandId: Yup.number().nullable().required("Brand is required"),
  modelId: Yup.number().nullable().required("Model is required"),
  modelYearId: Yup.number().nullable().required("Model Year is required"),
  variantId: Yup.number().nullable(),
  variantCode: Yup.string(),
  
  // Tractor Details
  variant: Yup.string(),
  hp: Yup.number().typeError("HP must be a number").nullable(),
  manufacturingYear: Yup
    .number()
    .typeError("Manufacturing Year must be a number")
    .required("Manufacturing Year is required")
    .min(1900, "Manufacturing Year must be at least 1900")
    .max(new Date().getFullYear(), "Manufacturing Year cannot be in the future"),
  purchaseYear: Yup
    .number()
    .typeError("Purchase Year must be a number")
    .nullable()
    .min(1900, "Purchase Year must be at least 1900")
    .max(new Date().getFullYear(), "Purchase Year cannot be in the future"),
  rcRegistrationNumber: Yup
    .string()
    .required("RC Registration Number is required")
    .matches(/^[A-Z0-9-]+$/, "Invalid RC Registration Number format"),
  engineNumber: Yup
    .string()
    .required("Engine Number is required")
    .matches(/^[A-Z0-9]+$/, "Invalid Engine Number format"),
  chassisNumber: Yup
    .string()
    .required("Chassis Number is required")
    .matches(/^[A-Z0-9]+$/, "Invalid Chassis Number format"),
  tractorCategory: Yup
    .string()
    .oneOf(['compact', 'utility', 'row_crop', 'orchard', 'industrial'], "Invalid tractor category"),
  fuelType: Yup
    .string()
    .oneOf(['diesel', 'petrol', 'electric', 'cng'], "Invalid fuel type"),
  driveType: Yup
    .string()
    .oneOf(['2wd', '4wd'], "Invalid drive type"),
  
  // Colors (as checkboxes)
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
    then: () => Yup.string().required("Custom color name is required"),
    otherwise: () => Yup.string().nullable(),
  }),
  customColorCode: Yup.string().when("colors.custom", {
    is: true,
    then: () => Yup.string().required("Custom color code is required"),
    otherwise: () => Yup.string().nullable(),
  }),
  showCustomColor: Yup.boolean(),
  
  // Location
  country: Yup.string().required("Country is required"),
  availableStates: Yup.array().min(1, "At least one state is required"),
  availableDistricts: Yup.array().min(1, "At least one district is required"),
  locationTaluka: Yup.string().nullable(),
  locationVillage: Yup.string().nullable(),
  
  // Ownership
  ownership: Yup
    .string()
    .oneOf(['first_owner', 'second_owner', 'third_owner'], "Invalid ownership type"),
  ownerType: Yup
    .string()
    .oneOf(['first_owner', 'second_owner', 'third_owner'], "Invalid owner type"),
  firstOwner: Yup.string().nullable(),
  secondOwner: Yup.string().nullable(),
  thirdOwner: Yup.string().nullable(),
  sellerType: Yup
    .string()
    .oneOf(['farmer', 'dealer', 'individual'], "Invalid seller type"),
  ownershipProofAvailable: Yup.boolean().nullable(),
  
  // Usage
  hoursMeterReading: Yup
    .number()
    .typeError('Hours Meter Reading must be a number')
    .required('Hours Meter Reading is required')
    .min(0, 'Hours Meter Reading cannot be negative'),
  approxWorkingHours: Yup
    .number()
    .typeError('Approx Working Hours must be a number')
    .nullable()
    .min(0, 'Approx Working Hours cannot be negative'),
  acresWorked: Yup
    .number()
    .typeError('Acres Worked must be a number')
    .nullable()
    .min(0, 'Acres Worked cannot be negative'),
  purpose: Yup
    .string()
    .oneOf(['farming', 'commercial', 'rental'], "Invalid purpose"),
  
  // Additional
  availableDealers: Yup.array().min(1, "At least one dealer is required"),
  stockStatus: Yup
    .string()
    .oneOf(['in_stock', 'out_of_stock', 'limited_stock', 'pre_order'], "Invalid stock status"),
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
  transmissionType: Yup.string().trim().required("Transmission Type Required"),
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
  expectedprice: Yup.number()
    .typeError("Expected Price must be a number")
    .positive("Expected Price must be positive")
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
country: Yup.string()
    .trim()
    .required("country is required"),
  state: Yup.string()
    .trim()
    .required("State is required"),

  district: Yup.string()
    .trim()
    .required("District is required"),

  taluka: Yup.string().trim(),

  city: Yup.string()
    .trim()
    .required("Village / City is required"),

  pincode: Yup.string()
    .matches(/^[1-9][0-9]{5}$/, "Enter a valid pincode")
    .required("Pincode is required"),

  landmark: Yup.string().trim(),

  fullAddress: Yup.string()
    .trim()
    .required("Full Address is required"),

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
