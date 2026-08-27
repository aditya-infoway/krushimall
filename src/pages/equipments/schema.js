import * as Yup from "yup";

const numOrNull = (v, o) => (o === "" ? null : v);
const numOrUndef = (v, o) => (o === "" ? undefined : v);

export const EquipmentBasicInfoSchema = Yup.object({
  categoryId: Yup.number().required("Equipment Category is required"),
  equipmentType: Yup.string().required("Equipment Type is required"),
  brandId: Yup.number().required("Brand is required"),
  modelId: Yup.number().required("Model is required"),
  variantId: Yup.number().nullable(),

  // Change manufacturingYear to accept date string
  manufacturingYear: Yup.string()
    .required("Manufacturing Year is required")
    .nullable(),
  
  // Change purchaseYear to accept date string
  purchaseYear: Yup.string()
    .nullable(),

  equipmentCondition: Yup.string().required("Equipment Condition is required"),
  serialNumber: Yup.string().nullable(),
  productCode: Yup.string().nullable(),
  color: Yup.string().nullable(),

  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  district: Yup.string().required("District is required"),
  taluka: Yup.string().nullable(),
  village: Yup.string().nullable(),

  sellerType: Yup.string().oneOf(["farmer", "dealer", "individual"]).required("Seller Type is required"),
  ownerType: Yup.string().oneOf(["first_owner", "second_owner", "third_owner"]).required("Ownership is required"),
  ownershipProofAvailable: Yup.boolean().nullable(),
  usage: Yup.string().oneOf(["farming", "commercial", "rental"]).required("Usage is required"),
});

export const EquipmentSpecificationsSchema = Yup.object({
  powerRequirement: Yup.string().nullable(),
  powerSource: Yup.string().oneOf(["tractor_pto", "electric", "diesel", "petrol", "manual"]).required("Power Source is required"),

  requiredTractorHp: Yup.number().transform(numOrNull).nullable().typeError("Must be a number"),

  workingWidth: Yup.string().nullable(),
  workingCapacity: Yup.string().nullable(),
  workingSpeed: Yup.string().nullable(),
  weight: Yup.number().transform(numOrNull).nullable().typeError("Must be a number"),

  length: Yup.number().transform(numOrNull).nullable().typeError("Must be a number"),
  width: Yup.number().transform(numOrNull).nullable().typeError("Must be a number"),
  height: Yup.number().transform(numOrNull).nullable().typeError("Must be a number"),

  productionCapacity: Yup.string().nullable(),
  fuelConsumption: Yup.string().nullable(),
  rpm: Yup.number().transform(numOrNull).nullable().typeError("Must be a number"),
  numberOfBladesTinesRotors: Yup.number().transform(numOrNull).nullable().typeError("Must be a number"),
  numberOfRows: Yup.number().transform(numOrNull).nullable().typeError("Must be a number"),
  tankCapacity: Yup.number().transform(numOrNull).nullable().typeError("Must be a number"),
  workingDepth: Yup.string().nullable(),

  // Dynamic block — Thresher
  threshingCapacity: Yup.string().nullable(),
  cropType: Yup.string().nullable(),
  drumSize: Yup.string().nullable(),
  fanType: Yup.string().nullable(),
  cleaningSystem: Yup.string().nullable(),

  // Dynamic block — Rotavator
  rotorRpm: Yup.number().transform(numOrNull).nullable().typeError("Must be a number"),

  // Dynamic block — Sprayer
  sprayWidth: Yup.string().nullable(),
  pumpType: Yup.string().nullable(),
  nozzleCount: Yup.number().transform(numOrNull).nullable().typeError("Must be a number"),
  pressure: Yup.string().nullable(),
});

const conditionField = (label) => Yup.string().required(`${label} is required`);

export const EquipmentConditionSchema = Yup.object({
  overallCondition: Yup.string()
    .oneOf(["excellent", "very_good", "good", "average", "needs_repair"])
    .required("Overall Condition is required"),

  mechanical: Yup.object({
    mainMachineCondition: conditionField("Main Machine Condition"),
    driveSystem: conditionField("Drive System"),
    beltChainCondition: conditionField("Belt / Chain Condition"),
    bearingCondition: conditionField("Bearing Condition"),
    gearboxCondition: conditionField("Gearbox Condition"),
  }),
  oilLeakage: Yup.string().oneOf(["yes", "no"]).required("Oil Leakage status is required"),

  workingCondition: Yup.string()
    .oneOf(["fully_working", "partially_working", "not_working", "needs_repair"])
    .required("Working Condition is required"),

  electrical: Yup.object({
    wiring: Yup.string().nullable(),
    motorStarter: Yup.string().nullable(),
    battery: Yup.string().nullable(),
    lights: Yup.string().nullable(),
    controlPanel: Yup.string().nullable(),
  }),
});

export const EquipmentPartsServiceSchema = Yup.object({
  partsCondition: Yup.object({
    blades: Yup.string().nullable(),
    belts: Yup.string().nullable(),
    bearings: Yup.string().nullable(),
    chains: Yup.string().nullable(),
    gears: Yup.string().nullable(),
    rollers: Yup.string().nullable(),
    nozzles: Yup.string().nullable(),
  }),

  attachments: Yup.object({
    rotavator: Yup.boolean(),
    cultivator: Yup.boolean(),
    trailer: Yup.boolean(),
    trolley: Yup.boolean(),
    mbPlough: Yup.boolean(),
    seedDrill: Yup.boolean(),
    sprayer: Yup.boolean(),
    dozer: Yup.boolean(),
    loader: Yup.boolean(),
    other: Yup.boolean(),
  }),
  otherAttachmentName: Yup.string().when("attachments.other", {
    is: true,
    then: (s) => s.required("Please specify the other attachment"),
    otherwise: (s) => s.nullable(),
  }),

  lastServiceDate: Yup.date().nullable(),
  majorRepair: Yup.string().oneOf(["never", "minor", "major"]).nullable(),
  partsReplaced: Yup.object({
    gearboxRepaired: Yup.string().oneOf(["yes", "no"]).nullable(),
    beltChainChanged: Yup.string().oneOf(["yes", "no"]).nullable(),
    bearingChanged: Yup.string().oneOf(["yes", "no"]).nullable(),
  }),

 accidentDamage: Yup.string()
  .oneOf(["never", "minor", "major"])
  .required("Please select Accident Damage status"),
  floodDamage: Yup.string().oneOf(["yes", "no"]).required("Please select Flood Damage status"),
});

export const EquipmentPriceLocationSchema = Yup.object({
  expectedPrice: Yup.number()
    .transform(numOrUndef)
    .typeError("Expected Price must be a number")
    .positive("Expected Price must be greater than 0")
    .required("Expected Price is required"),
  negotiable: Yup.string().oneOf(["yes", "no"]).required("Negotiable is required"),
  exchangeAvailable: Yup.string().oneOf(["yes", "no"]).required("Exchange availability is required"),
  financeAvailable: Yup.string().oneOf(["yes", "no"]).required("Finance availability is required"),

  village: Yup.string().nullable(),
  taluka: Yup.string().nullable(),
  district: Yup.string().trim().required("District is required"),
  state: Yup.string().trim().required("State is required"),
  pincode: Yup.string().trim().matches(/^[1-9][0-9]{5}$/, "Enter a valid pincode").required("Pincode is required"),
  landmark: Yup.string().nullable(),
  latitude: Yup.number().transform(numOrNull).nullable(),
  longitude: Yup.number().transform(numOrNull).nullable(),
});

export const EquipmentMediaDocumentSchema = Yup.object({
  frontView: Yup.mixed().required("Front View image is required"),
  leftView: Yup.mixed().required("Left View image is required"),
  rightView: Yup.mixed().required("Right View image is required"),
  rearView: Yup.mixed().required("Rear View image is required"),
  mainEquipment: Yup.mixed().required("Main Equipment image is required"),
  workingMechanism: Yup.mixed().required("Working Mechanism image is required"),
  controlPanel: Yup.mixed().required("Control Panel image is required"),
  serialNumberImage: Yup.mixed().required("Serial Number image is required"),
  attachmentsImage: Yup.mixed().nullable(),
  tyresWheels: Yup.mixed().nullable(),

  walkaroundVideo: Yup.mixed().nullable(),
  workingVideo: Yup.mixed().nullable(),
  machineStartVideo: Yup.mixed().nullable(),
  ptoWorkingVideo: Yup.mixed().nullable(),
  hydraulicWorkingVideo: Yup.mixed().nullable(),

  purchaseInvoice: Yup.mixed().nullable(),
  ownershipProof: Yup.mixed().nullable(),
  warrantyDocument: Yup.mixed().nullable(),
  insurance: Yup.mixed().nullable(),
  serviceRecords: Yup.mixed().nullable(),
  otherDocuments: Yup.mixed().nullable(),
});

export const EquipmentPreviewSubmitSchema = Yup.object({
  agreed: Yup.boolean().oneOf([true], "You must agree to the terms and conditions to submit").required(),
});