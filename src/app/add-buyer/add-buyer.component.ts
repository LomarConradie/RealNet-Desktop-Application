import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { firestore } from 'firebase/app';
import {
  PropertyDetails,
  PropertyFeatures,
  Buyer,
  BuyerID
} from '../models/item';
import { inOutAnimation } from '../route-animations';
import { SnackbarService } from '../snackbar/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-add-buyer',
  templateUrl: './add-buyer.component.html',
  styleUrls: ['./add-buyer.component.scss'],
  animations: [inOutAnimation],
})
export class AddBuyerComponent implements OnInit {

  constructor(
    public afs: AngularFirestore,
    private snackbarService: SnackbarService,
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    private router: Router) {
    // Creating a reference to the document on the database.
    this.propertyDetailsDoc = afs.doc<PropertyDetails>('DynamicVariables/PropertyDetails');
    this.propertyFeaturesDoc = afs.doc<PropertyFeatures>('DynamicVariables/PropertyFeatures');
    // Binding the document to the observable variable.
    this.propertyDetails = this.propertyDetailsDoc.valueChanges();
    this.propertyFeatures = this.propertyFeaturesDoc.valueChanges();
  }

  /* PAGE VARIABLES */
  // These arrays and indexes are used to keep track of navigation between components.
  addBuyerRoutes: string[] = ['page1', 'page2', 'page3'];
  addBuyerNames: string[] = ['Buyer Details', 'Preferences', 'Buyer Image'];
  currentIndex = 0;
  nextIndex = 1;
  previousIndex = -1;
  minDate = '';
  currentPage = '';
  loading = false;
  uploading = false;

  /* PICTURE UPLOAD VARIABLES */
  isHovering: boolean;
  pics: File[] = [];
  /* pictureURLs: string[] = []; */
  fileError = '';
  /* fileQuantityError = false; */
  globaldocID = '';
  buyerEditID = '';


  /* PROPERTY DETAILS VARIABLES */
  private propertyDetailsDoc: AngularFirestoreDocument<PropertyDetails>;
  propertyDetails: Observable<PropertyDetails>;
  /* PROPERTY FEATURES VARIABLES */
  private propertyFeaturesDoc: AngularFirestoreDocument<PropertyFeatures>;
  propertyFeatures: Observable<PropertyFeatures>;
  /* BUYER DETAILS DATABASE VARIABLES */
  buyersMapCollection: AngularFirestoreCollection<Buyer>;
  buyersMapItems: Observable<BuyerID[]>;
  buyersMapInsert: Buyer = {
    dateCreated: firestore.Timestamp.now(),
    personalDetails: {
      firstName: '',
      lastName: '',
      emailAddress: '',
      contactNumber: ''
    },
    secondContact: {
      secFirstName: '',
      secLastName: '',
      secEmailAddress: '',
      secContactNumber: ''
    },
    requirements: {
      minPrice: null,
      maxPrice: null,
      owningPreference: '',
      propertyType: '',
      area: '',
      suburb: '',
      landSize: null,
      bedrooms: null,
      bathrooms: null,
      flooring: '',
      kitchens: null,
      lounges: null,
      diningRooms: null,
      laundryRooms: null,
      patio: null,
      balcony: null,
      domesticAccom: null,
      flatlet: null,
      study: null,
      exterior: '',
      roof: '',
      pool: null,
      gardenType: '',
      views: null,
      security: null,
      storeRoom: null,
      wallType: '',
      furnished: null,
      extras: '',
      petsAllowed: ''
    },
    addBuyerPictureURL: '',
  };
  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.buyerEditID = params.get('buyerId');
    });

    if (this.buyerEditID === null) {
      const docId = this.afs.createId();
      this.globaldocID = docId;

    } else {
      this.globaldocID = this.buyerEditID;
      const buyerDoc = this.afs.doc<Buyer>('Buyers/' + this.globaldocID);
      buyerDoc.valueChanges().subscribe((buyer: Buyer) => {
        this.buyersMapInsert = buyer;
      });
    }
    console.log(this.globaldocID);
  }

  /* PAGE METHODS */
  onNextButton() {
    const currentForm: HTMLFormElement = (document.getElementById(this.addBuyerRoutes[this.currentIndex]) as HTMLFormElement);
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
    this.buyerDataInsert();
  }

  incrementIndexes() {
    if (this.currentIndex < this.addBuyerRoutes.length - 1) {
      this.currentIndex++;
      this.previousIndex++;
    }
    if (this.nextIndex < this.addBuyerRoutes.length) {
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

  buyerDataInsert() {
    this.buyersMapCollection = this.afs.collection<Buyer>('Buyers');
    this.buyersMapItems = this.buyersMapCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Buyer;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    this.buyersMapInsert.dateCreated = firestore.Timestamp.now();
    // this.buyersMapCollection.add(this.buyersMapInsert)
    this.buyersMapCollection.doc(this.globaldocID).set(this.buyersMapInsert).then(result => {
      console.log('Data Inserted');
      this.loading = false;
      if (this.globaldocID === '') {
        this.snackbarService.show('Buyer added successfully!', 'success');
      } else {
        this.snackbarService.show('Buyer updated successfully!', 'success');
      }
      this.router.navigate(['/buyers']);
    }).catch(error => {
      console.log('Error' + error);
      this.loading = false;
      if (this.globaldocID === '') {
        this.snackbarService.show('Buyer could not be added currently, try again later :(', 'error');
      } else {
        this.snackbarService.show('Buyer could not be updated currently, try again later :(', 'error');
      }
    });
  }

  /* BUYER IMAGE UPLOAD METHODS */
  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let index = 0; index < files.length; index++) {
      if (this.pics.length < 1) {
        if (index === 0) {
          const currentFilename = files.item(index).name;
          console.log(currentFilename);
          if (currentFilename.endsWith('.jpg') || currentFilename.endsWith('.png') || currentFilename.endsWith('.jpeg')) {
            this.pics.push(files.item(index));
            this.fileError = '';
            this.uploading = true;
          } else {
            this.fileError = 'Cannot upload file. Only .png, .jpg and .jpeg files are currently accepted file formats';
          }
        }
      } else if (files.length > 1) {
        this.fileError = 'Multiple pictures are not supported, only the first image will be uploaded.';
      } else {
        this.fileError = 'One image already uploaded. First delete current image before uploading another.';
      }
    }
  }

  addPictureURL(url: string) {
    console.log('URL Received from @Output eventEmitter: ' + url);
    this.buyersMapInsert.addBuyerPictureURL = url;
    this.uploading = false;
  }

  removePictureFile(file: File) {
    this.pics.splice(this.pics.indexOf(file), 1);
  }

  removePictureURL() {
    this.buyersMapInsert.addBuyerPictureURL = '';
    this.pics = [];
  }

  deletePicture(url: string) {
    console.log('URL of Image to be deleted: ' + url);
    let imagePath;
    try {
      imagePath = this.storage.storage.refFromURL(url);
      imagePath.delete().catch(e => {
        console.log('Could not delete file from storage: ' + e);
      }).then(() => {
        this.removePictureURL();
        console.log('File deleted!');
      });
    } catch (error) {
      console.log('Could not convert html ref to storage ref: ' + error);
      this.removePictureURL();
    }
  }

}
