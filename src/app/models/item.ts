import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

// interface for the data is created here.
export interface ListingDetails {
  Status: any;
  listingTypes: any;
  Agent: any;
}

export interface SellerDetails {
  maritialStatus?: string;
  listingTypes?: string[];
}

export interface PropertyFeatures {
  Exterior?: any;
  Roof?: any;
  Walling?: any;
  Flooring?: any;
  GardenType?: any;
}

export interface PropertyDetails {
  Area?: any;
  Province?: any;
  propertyType?: any;
  propertyTitle?: any;
  measureType?: any;
  landSizeDisabledValues?: any[];
}

export interface MandateDetails {
  mandateType?: string;
}

export interface LeaseDetails {
  leasePeriod?: string;
  Availability?: string;
}

export interface ListingInsert {
  propStat?: string;
  agent?: string;
  agent2?: string;
  agent3?: string;
  listTypeProp?: string;
  price?: number;
  valPrice?: number;
  poaValue?: number;
}

export interface PropertyDetailsInsert {
  typeProperty?: string;
  titleProperty?: string;
  erfNo?: number;
  secTitleNo?: number;
  provProp?: string;
  areaProp?: string;
  suburb?: string;
  complexUnitNo?: number;
  compName?: string;
  streetNo?: number;
  streetName?: string;
  zipCode?: number;
  physAddr?: string;
  expDate?: firebase.firestore.Timestamp;
  measType?: string;
  landSize?: string;
  floorSize?: string;
  monthRate?: string; // number?
  levy?: string; // number?
  specialLevy?: string;
  hoaLevy?: string; // number?
}
export interface PropertyFeaturesInsert {
  numBedroom?: number;
  numBathroom?: number;
  numKitchen?: number;
  numLounge?: number;
  numDining?: number;
  numLaundry?: number;
  numPatio?: number;
  numBalcony?: number;
  domesticAccom?: string;
  flatNum?: string;
  studyNum?: string;
  floorType?: string;
  extType?: string;
  roofType?: string;
  pool?: string;
  gardenType?: string;
  views?: string;
  security?: string;
  storeRoom?: string;
  wallType?: string;
  furnishing?: string;
  extras?: string;
  petsAllow?: string;
  petsNotes?: string;
}

export interface LeaseDetailsInsert {
  leasePeriod?: string;
  availability?: string;
  occuDate?: firebase.firestore.Timestamp;
  depositVal?: number;
  leaseExclude?: string;
}

export interface SellerDetailsInsert {
  sellerType?: string;
  amountOfSellers?: number;
  sellerName?: string;
  sellerSurname?: string;
  sellerAddress?: string;
  sellerNum?: string;
  sellerEmail?: string;
  sellerMaritialStat?: string;
  lisingType?: string;
  spouseName?: string;
  spouseSurname?: string;
  spouseNum?: string;
  spouseEmail?: string;
  tenantName?: string;
  tenantSurname?: string;
  tenantNum?: string;
  tenantEmail?: string;
}

export interface MandateDetailsInsert {
  mandateCommision?: string;
  mandateType?: string;
  mandateStartDate?: firebase.firestore.Timestamp;
  mandateEndDate?: firebase.firestore.Timestamp;
}

export interface OpenHourInsert {
  openHourDate?: firebase.firestore.Timestamp;
  openHourTime?: string;
  openHourAgent?: string;
  agentContact?: string;
  onShow?: string;
}

export interface GoogleMappingInsert {
  mapSuburb?: string;
  mapAddress?: string;
}

export interface WebDetailsInsert {
  webDisplay?: string;
  webRefNo?: string;
  marketHeading?: string;
  webDesc?: string;
}

export interface ExternalLinksInsert {
  externalLinkName?: string;
  externalLinkURL?: string;
  youtubeVicID?: string;
}

// export interface Listing {
//   dateCreated?: Timestamp;
//   listingDetails: any,
//   propertyDetails: any,
//   propertyFeatures: any,
//   leaseDetails: any;
//   mandateDetails: any;
//   sellerDetails: any;
//   openHourDetails: any;
//   mapping: any;
//   websiteDetails: any;
//   externalLinks: any;
//   propertyPictureURL: any;
// }

export interface ListingID extends Listing {
  id: string;
}

export interface Buyer {
  dateCreated: Timestamp;
  personalDetails: {
    firstName: string,
    lastName: string,
    emailAddress: string,
    contactNumber: string
  };
  secondContact: {
    secFirstName: string,
    secLastName: string,
    secEmailAddress: string,
    secContactNumber: string
  };
  requirements: {
    minPrice: number,
    maxPrice: number,
    owningPreference: string,
    propertyType: string,
    area: string,
    suburb: string,
    landSize: number,
    bedrooms: number,
    bathrooms: number,
    flooring: string,
    kitchens: number,
    lounges: number,
    diningRooms: number,
    laundryRooms: number,
    patio: number,
    balcony: number,
    domesticAccom: number,
    flatlet: number,
    study: number,
    exterior: string,
    roof: string,
    pool: number,
    gardenType: string,
    views: number,
    security: number,
    storeRoom: number,
    wallType: string,
    furnished: number,
    extras: string,
    petsAllowed: string

  };
  addBuyerPictureURL: string;
}

export interface BuyerID extends Buyer {
  id: string;
}

export interface Agent {
  dateCreated: Timestamp;
  admin: boolean;
  name: string;
  surname: string;
  email: string;
  password: string;
  contactNum: string;
  agentPicUrl: string;
  dev: boolean;
  userID: string;
  isEdit: boolean;
}

export interface AgentID extends Agent {
  id: string;
}

export interface Listing {
  dateCreated: firestore.Timestamp;
  listingDetails: {
    status: string,
    listingType: string,
    agents: any,
    price: number,
    valuationPrice: number,
    priceOnApplication: boolean
  };
  propertyDetails: {
    propertyType: string,
    propertyTitle: string,
    erfNo: number,
    sectionalTitleNo: number,
    province: string,
    area: string,
    suburb: string,
    complexUnitNo: number,
    complexName: string,
    streetNo: number,
    streetName: string,
    zipCode: number,
    physicalAddress: number,
    listingExpiryDate: string,
    measurementType: string,
    landSize: number,
    floorSize: number,
    monthlyRate: number,
    levy: number,
    specialLevy: number,
    hoaLevy: number
  };
  propertyFeatures: {
    bedroom: number,
    bathroom: number,
    kitchen: number,
    lounge: number,
    diningRoom: number,
    laundry: number,
    patio: number,
    balcony: number,
    domesticAccomodation: number,
    flatlet: boolean,
    study: string,
    flooring: string,
    exterior: string,
    roof: string,
    pool: number,
    gardenType: string,
    views: number,
    security: number,
    storeroom: number,
    walling: string,
    furnished: boolean,
    extras: string,
    petsAllowed: boolean,
    petsNotes: string
  };
  leaseDetails: {
    leasePeriod: string,
    availability: '',
    occupationDate: string,
    deposit: number,
    leaseExcludes: string
  };
  sellerDetails: {
    sellerType: string,
    amountOfSellers: number,
    /* listingSellType: string, */
    sellers: any,
    tenantName: string,
    tenantSurname: string,
    tenantAddress: string,
    tenantContactNo: string,
    tenantEmail: string
  };
  mandateDetails: {
    commission: string,
    mandateType: string,
    mandateStartDate: string,
    mandateEndDate: string,
  };
  openHourDetails: {
    openHourDate: string,
    openHourTime: string,
    agents: any,
    contactNo: string,
    onShow: boolean
  };
  mapping: {
    mapSuburb: string,
    mapAddress: string
  };
  websiteDetails: {
    webDisplay: string,
    webRefNo: string,
    marketingHeading: string,
    description: string
  };
  externalLinks: {
    externalLinkName: string,
    externalLinkURL: string,
    youtubeVideoID: string
  };
  propertyPictureURL: {
    pictureURLs: any
  };
}

export interface AgentID extends Agent {
  id: string;
}
