import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import {
  ListingDetails,
  Listing,
  ListingID,
  SellerDetails,
  PropertyFeatures,
  PropertyDetails,
  MandateDetails,
  LeaseDetails,
  Agent,
  AgentID,
  // listingDisplay
} from '../models/item';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import { inOutAnimation } from '../route-animations';
import { Time } from '@angular/common';
import { SnackbarService } from '../snackbar/snackbar.service';
import { AuthService } from '../authService/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { AppRoutingModule } from '../app-routing.module';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss'],
  animations: [inOutAnimation],
})
// Collections and objects for all the data is created here.
// Drop down menu data.
export class AddPropertyComponent implements OnInit {

  agentsCollection: AngularFirestoreCollection<Agent>;
  agentItems: Observable<AgentID[]>;

  // Physical database application is referenced here.
  constructor(
    public afs: AngularFirestore,
    private snackbarService: SnackbarService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    private router: Router) {
    // Create reference to document that stores Dynamic Variables for Listing Details
    this.listingDetailsDoc = afs.doc<ListingDetails>('DynamicVariables/ListingDetails');
    this.propertyDetailsDoc = afs.doc<PropertyDetails>('DynamicVariables/PropertyDetails');
    this.propertyFeaturesDoc = afs.doc<PropertyFeatures>('DynamicVariables/PropertyFeatures');
    this.sellerDetailsDoc = afs.doc<SellerDetails>('DynamicVariables/SellerDetails');
    this.leaseDetailsDoc = afs.doc<LeaseDetails>('DynamicVariables/LeaseDetails');
    this.mandateDetailsDoc = afs.doc<MandateDetails>('DynamicVariables/MandateDetails');
    // Bind document to an observable variable
    this.listingDetails = this.listingDetailsDoc.valueChanges();
    this.propertyDetails = this.propertyDetailsDoc.valueChanges();
    this.propertyFeatures = this.propertyFeaturesDoc.valueChanges();
    this.sellerDetails = this.sellerDetailsDoc.valueChanges();
    this.leaseDetails = this.leaseDetailsDoc.valueChanges();
    this.mandateDetails = this.mandateDetailsDoc.valueChanges();
    // Create reference to collection that stores the Agents
    this.agentsCollection = afs.collection<Agent>('Agents');
    this.agentItems = this.agentsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Agent;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  /* PAGE VARIABLES */
  // These arrays and indexes are used to keep track of navigation between components.
  addPropertyRoutes: string[] = ['listingdetails', 'propertydetails', 'propertyfeatures',
    'sellerdetails', 'leasedetails', 'mandatedetails', 'openhourdetails', 'mapping',
    'websitedetails', 'externallinks', 'propertypictures'];
  addPropertyNames: string[] = ['Listing Details', 'Property Details', 'Property Features',
    'Seller/Landlord Details', 'Lease Details', 'Mandate Details', 'Open Hour Details', 'Mapping',
    'Website Details', 'External Links', 'Property Pictures'];
  currentIndex = 0;
  nextIndex = 1;
  previousIndex = -1;
  minDate = '';
  currentPage = '';
  globaldocID = '';
  message = '';
  loading = false;
  isAdmin = false;
  isEdit = false;
  editDocID = '';
  existingFiles = [];

  /* LISTING DETAILS VARIABLES */
  // Array that keeps track of how many agents can be (and are) added
  private listingDetailsDoc: AngularFirestoreDocument<ListingDetails>;
  listingDetails: Observable<ListingDetails>;
  /* private agentsCollection: AngularFirestoreCollection<Agent>;
  agents: Observable<AgentID[]>; */
  agentsArray: number[] = [1];
  maxAgents = 3;
  /* priceOnApplication = false; */
  selectedAgents: string[] = [''];

  /* PROPERTY DETAILS VARIABLES */
  private propertyDetailsDoc: AngularFirestoreDocument<PropertyDetails>;
  propertyDetails: Observable<PropertyDetails>;
  /* selectedProvince = ''; */
  /* specialLevy = false; */
  /* landSizeDisabled = false; */
  /* streetNoValue = '';
  erfNoValue = ''; */
  /* allowedProvinceSelected = false; */

  /* PROPERTY FEATURES VARIABLES */
  private propertyFeaturesDoc: AngularFirestoreDocument<PropertyFeatures>;
  propertyFeatures: Observable<PropertyFeatures>;
  /* petsAllowed = true; */

  /* SELLER DETAILS VARIABLES */
  private sellerDetailsDoc: AngularFirestoreDocument<SellerDetails>;
  sellerDetails: Observable<SellerDetails>;
  spouseDisabledValues = ['Single', 'Divorced'];
  /* sellersArray: number[] = [1]; */
  /* sellersArray: any[] = ; */

  maxSellers = 3;
  spouseMaritalStatus: string[] = [''];
  tenantDetailsDisabled = false;

  /* LEASE DETAILS VARIABLES */
  private leaseDetailsDoc: AngularFirestoreDocument<LeaseDetails>;
  leaseDetails: Observable<LeaseDetails>;

  /* MANDATE DETAILS VARIABLES */
  private mandateDetailsDoc: AngularFirestoreDocument<MandateDetails>;
  mandateDetails: Observable<MandateDetails>;

  /* OPEN HOUR DETAILS VARIABLES */
  openHourDate: Date;
  openHourTime: Time;
  openHourTimestamp: firestore.Timestamp;

  /* PICTURE UPLOAD VARIABLES */
  isHovering: boolean;
  files: File[] = [];
  /* propertyPictureURLs: string[] = []; */
  fileTypeError = false;

  /*Edit database interface inport */
  listingDisplayCollection: AngularFirestoreCollection<Listing>;
  listingDisplayItems: Observable<Listing>;

  // Database insert data.
  listingMapCollection: AngularFirestoreCollection<Listing>;
  listingMapItems: Observable<ListingID[]>;
  timeinmilis: Date;

  listingMapInsert: Listing = {
    dateCreated: firestore.Timestamp.now(),
    listingDetails: {
      status: '',
      listingType: '',
      agents: this.selectedAgents,
      price: null,
      valuationPrice: null,
      priceOnApplication: null
    },
    propertyDetails: {
      propertyType: '',
      propertyTitle: '',
      erfNo: null,
      sectionalTitleNo: null,
      province: '',
      area: '',
      suburb: '',
      complexUnitNo: null,
      complexName: '',
      streetNo: null,
      streetName: '',
      zipCode: null,
      physicalAddress: null,
      listingExpiryDate: null,
      measurementType: '',
      landSize: null,
      floorSize: null,
      monthlyRate: null,
      levy: null,
      specialLevy: null,
      hoaLevy: null
    },
    propertyFeatures: {
      bedroom: null,
      bathroom: null,
      kitchen: null,
      lounge: null,
      diningRoom: null,
      laundry: null,
      patio: null,
      balcony: null,
      domesticAccomodation: null,
      flatlet: null,
      study: '',
      flooring: '',
      exterior: '',
      roof: '',
      pool: null,
      gardenType: '',
      views: null,
      security: null,
      storeroom: null,
      walling: '',
      furnished: null,
      extras: '',
      petsAllowed: null,
      petsNotes: ''
    },
    leaseDetails: {
      leasePeriod: '',
      availability: '',
      occupationDate: null,
      deposit: null,
      leaseExcludes: ''
    },
    sellerDetails: {
      sellerType: 'Seller/Landlord',
      amountOfSellers: 1,
      /* listingSellType: '', */
      sellers: [
        {
          seller: {
            sellerName: '',
            sellerSurname: '',
            sellerAddress: '',
            sellerContactNum: '',
            sellerEmail: '',
            sellerMarryStatus: ''
          },
          spouse: {
            spouseName: '',
            spouseSurname: '',
            spouseAddress: '',
            spouseContactNum: '',
            spouseEmail: ''
          }
        }
      ],
      tenantName: '',
      tenantSurname: '',
      tenantAddress: '',
      tenantContactNo: '',
      tenantEmail: ''
    },
    mandateDetails: {
      commission: '',
      mandateType: '',
      mandateStartDate: null,
      mandateEndDate: null
    },
    openHourDetails: {
      openHourDate: null,
      openHourTime: '',
      agents: this.selectedAgents,
      contactNo: '',
      onShow: null
    },
    mapping: {
      mapSuburb: '',
      mapAddress: ''
    },
    websiteDetails: {
      webDisplay: '',
      webRefNo: '',
      marketingHeading: '',
      description: ''
    },
    externalLinks: {
      externalLinkName: '',
      externalLinkURL: '',
      youtubeVideoID: ''
    },
    propertyPictureURL: {
      pictureURLs: [],
    }
  };

  ngOnInit(): void {
    // Set minimum date for Calendar to tomorrow, by gettin ISO standart Time and removing time of day.
    const tomorrow = firestore.Timestamp.now().toDate();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];

    this.route.paramMap.subscribe(params => {
      this.editDocID = params.get('propertyId');
    });
    let docId = null;
    console.log(this.isEdit);
    console.log(this.editDocID);

    if (this.editDocID === null) {
      docId = this.afs.createId();
      this.globaldocID = docId;
      console.log(this.globaldocID);
    } else {
      this.globaldocID = this.editDocID;
      this.isEdit = true;
      /* this.afs.doc */
      const itemDoc = this.afs.doc<Listing>('PropertyData/' + this.globaldocID);
      itemDoc.valueChanges().subscribe((listing: Listing) => {
        this.listingMapInsert = listing;
        this.selectedAgents = listing.listingDetails.agents;
        this.agentsArray.length = this.selectedAgents.length;
        this.existingFiles = [...listing.propertyPictureURL.pictureURLs];
        /* this.sellersArray = listing.sellerDetails.sellers; */
      });
    }
  }

  onSubmit() {
    /*  this.listingMapInsert.dateCreated = firestore.Timestamp.now();
     this.listingMapCollection.add(this.listingMapInsert); */
  }

  loadContent() {

  }


  /* PAGE METHODS */
  onNextButton() {
    const currentForm: HTMLFormElement = (document.getElementById(this.addPropertyRoutes[this.currentIndex]) as HTMLFormElement);
    if (currentForm.checkValidity()) {// Validated

      // Calls database insert function
      //   this.databaseInsert();
      // Increments the indexes by one (1), when Next BTN is clicked.
      this.incrementIndexes();
    } else {// Not Validated
      currentForm.reportValidity();
      currentForm.classList.add('submitted');
    }
  }

  onFinishButton() {
    this.loading = true;
    this.databaseInsert();
  }

  incrementIndexes() {
    if (this.currentIndex < this.addPropertyRoutes.length - 1) {
      this.currentIndex++;
      this.previousIndex++;
    }
    if (this.nextIndex < this.addPropertyRoutes.length) {
      this.nextIndex++;
    }
  }

  decrementIndexes() {
    if (this.nextIndex > 1) {
      this.nextIndex--;
    }
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.previousIndex--;
    }
  }

  onPreviousButton() {
    // Decrements the indexes by one (1), when Previous BTN is clicked.
    this.decrementIndexes();
  }

  databaseInsert() {
    this.listingMapCollection = this.afs.collection<Listing>('PropertyData');
    this.listingMapItems = this.listingMapCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Listing;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    // Insertion of timestamp for record.
    this.listingMapInsert.dateCreated = firestore.Timestamp.now();
    // Insertion of map with values.
    this.listingMapCollection.doc(this.globaldocID).set(this.listingMapInsert).then(result => {
      console.log(result);
      // displaySnackTrue.className = "visible";
      // this.message ='Data Succesfully Inserted!';
      this.loading = false;
      if (this.globaldocID === '') {
        this.snackbarService.show('Property added successfully!', 'success');
      } else {
        this.snackbarService.show('Property updated successfully!', 'success');
      }
      this.router.navigate(['/properties']);
    }).catch(error => {
      console.log(error);
      // displaySnackFalse.className = "visible";
      this.loading = false;
      if (this.globaldocID === '') {
        this.snackbarService.show('Property could not be added! Please try again later.', 'error');
      } else {
        this.snackbarService.show('Property could not be updated! Please try again later.', 'error');
      }
    });

    /* this.listingMapCollection.doc(this.docID).set({exists: true});
    switch (this.currentIndex) {
      case 0:
        this.listingMapCollection.doc(this.docID).update(this.listingMapInsert.listingDetails);
        break;
      case 1:
        this.listingMapCollection.doc(this.docID).update(this.listingMapInsert.propertyDetails);
        break;
    } */
  }

  goToPage(pagename: string) {
    // Commented out for production release

    /* console.log('JUMP TO PAGE: ' + pagename);
    let count = this.addPropertyRoutes.indexOf(pagename);
    let directionForward;
    if (this.currentIndex < count) {
      count = count - this.currentIndex;
      directionForward = true;
    } else {
      count = this.currentIndex - count;
      directionForward = false;
    }
    for (let index = 0; index < count; index++) {
      if (directionForward) {
        this.incrementIndexes();
      } else {
        this.decrementIndexes();
      }
    } */
  }

  /* LISTING DETAILS METHODS */
  incrementAgent() {
    // Adds values to agents arrays. To increase number of agents that can be added.
    if (this.agentsArray.length < this.maxAgents) {
      this.agentsArray.push(1);
      this.selectedAgents.push('newAgent');
    }
  }

  decrementAgent() {
    // Removes values from agents arrays. To decrease number of agents that can be added.
    if (this.agentsArray.length > 1) {
      this.agentsArray.pop();
      this.selectedAgents.pop();
    }
  }

  agentSelected(agentID: string, cmbId: number) {
    // Mehtod is called when select element's option is changed
    // Index is calculated based on the name of the agents component, by substringing the combobox ID
    /* const index = parseInt(cmbId.substr(11, cmbId.length), 10) - 1; */
    this.selectedAgents[cmbId] = agentID;
  }

  /* POAToggle(checked: boolean) {
    this.priceOnApplication = checked;
  } */


  /* PROPERTY DETAILS METHODS */
  /* LevyToggle(checked: boolean) {
    this.specialLevy = checked;
  } */

  /* LandSizeDisabledToggle(value: string) {
    // Gets values that disable land size txf from DB and checks if current landType is included in that array
    const landType = value.trim();
    this.propertyDetails.subscribe(val => {
      if (val.landSizeDisabledValues.includes(landType)) {
        this.landSizeDisabled = true;
      } else {
        this.landSizeDisabled = false;
      }
    });
  } */

  /* toggleArea(province: string) {
    if (province === 'Western Cape') {
      this.allowedProvinceSelected = true;
    }
  } */


  /* PROPERTY FEATURES METHODS */
  /* petsAllowedToggle(checked: boolean) {
    this.petsAllowed = checked;
  } */

  /* SELLER DETAILS METHODS */
  drawSellers(num: number) {
    // This method loops for the amount received (from spinner) and adds/removes array items till that number is reached
    for (let index = 0; index < num; index++) {
      if (this.listingMapInsert.sellerDetails.sellers.length < num
        && this.listingMapInsert.sellerDetails.sellers.length < this.maxSellers) {
        this.listingMapInsert.sellerDetails.sellers.push({
          seller: {
            sellerName: '',
            sellerSurname: '',
            sellerAddress: '',
            sellerContactNum: '',
            sellerEmail: '',
            sellerMarryStatus: ''
          },
          spouse: {
            spouseName: '',
            spouseSurname: '',
            spouseAddress: '',
            spouseContactNum: '',
            spouseEmail: ''
          }
        });
        this.spouseMaritalStatus.push('');
      } else if (this.listingMapInsert.sellerDetails.sellers.length > num && this.listingMapInsert.sellerDetails.sellers.length > 1) {
        this.listingMapInsert.sellerDetails.sellers.pop();
        this.spouseMaritalStatus.pop();
      }
    }
  }

  /* sellerLandlordToggle(sellerType: string) {
    this.currentSellerType = sellerType;
  } */

  setSpouseMaritalStatus(maritalStatus: string, index: number) {
    // When Marital Status is changed, update cooresponding spouse's details to reflect it
    this.spouseMaritalStatus[index] = maritalStatus;
  }

  spouseDisabled(index: number) {
    // Checks if the seller's corresponding spouse status is 'Single', to disable spouse inputs
    if (this.spouseMaritalStatus[index] === 'Single' || this.spouseMaritalStatus[index] === 'Divorced') {
      return true;
    } else {
      return false;
    }
  }

  isForSale(anything: string) {
    console.log('meow ' + anything);
    if (anything === 'For Sale') {
      this.tenantDetailsDisabled = true;
    } else {
      this.tenantDetailsDisabled = false;
    }
  }

  /* OPEN HOUR DETAILS METHODS */
  updateOpenHourTimestamp() {
    console.log(this.openHourDate.toString());
    console.log(this.openHourTime.toString());
    this.openHourTimestamp = firestore.Timestamp.fromDate(
      new Date(Date.parse(this.openHourDate.toString() + ' ' + this.openHourTime.toString() + ':00')));
    console.log(this.openHourTimestamp + '');
  }

  /* getAgentName(agentId: string) {
    this.agentItems.subscribe((agents: AgentID[]) => {
      console.log("found agent: " + agents.find(p => p.id === agentId));
    });
  } */

  /* PICTURE UPLOAD METHODS */
  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let index = 0; index < files.length; index++) {
      const currentFilename = files.item(index).name;
      console.log(currentFilename);
      if (currentFilename.endsWith('.jpg') || currentFilename.endsWith('.png') || currentFilename.endsWith('.jpeg')) {
        this.files.push(files.item(index));
        this.fileTypeError = false;
      } else {
        this.fileTypeError = true;
      }
    }
  }

  addPropertyPictureURL(url: string) {
    console.log('URL Received from @Output eventEmitter: ' + url);
    this.listingMapInsert.propertyPictureURL.pictureURLs.push(url);
  }

  removePropertyPictureFile(file: File) {
    this.files.splice(this.files.indexOf(file), 1);
  }

  removePropertyPictureURL(url: string) {
    this.listingMapInsert.propertyPictureURL.pictureURLs.splice(this.listingMapInsert.propertyPictureURL.pictureURLs.indexOf(url), 1);
    if (this.existingFiles.includes(url)) {
      this.existingFiles.splice(this.existingFiles.indexOf(url), 1);
    }
  }

  deletePicture(url: string) {
    console.log('URL of Image to be deleted: ' + url);
    let imagePath;
    try {
      imagePath = this.storage.storage.refFromURL(url);
      imagePath.delete().catch(e => {
        console.log('Could not delete file from storage: ' + e);
      }).then(() => {
        this.removePropertyPictureURL(url);
        console.log('File deleted!');
      });
    } catch (error) {
      console.log('Could not convert html ref to storage ref: ' + error);
      this.removePropertyPictureURL(url);
    }
  }

  /* onDelete(){
    this.files.
  } */

}

