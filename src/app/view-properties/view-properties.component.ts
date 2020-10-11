import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Listing, ListingID, PropertyDetails, ListingDetails } from '../models/item';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { inOutAnimation, modalPopup } from '../route-animations';

@Component({
  selector: 'app-view-properties',
  templateUrl: './view-properties.component.html',
  styleUrls: ['./view-properties.component.scss'],
  animations: [inOutAnimation, modalPopup],
})

export class ViewPropertiesComponent implements OnInit {
  propertyDetails: AngularFirestoreDocument<PropertyDetails>;
  listingDetails: AngularFirestoreDocument<ListingDetails>;
  listingDetailsItems: Observable<ListingDetails>;
  propertyDetailsItems: Observable<PropertyDetails>;
  listingCollection: AngularFirestoreCollection<Listing>;
  listingItems: Observable<ListingID[]>;

  currentListingItem: any = null;

  timeinmilis: Date;
  qSuburbArea = '';
  qPropertyType = 'Any';
  qListingType = 'Any';
  qMinPrice = 0;
  qMaxPrice = 0;
  qBeds = 'Any';
  qFlatlet = false;
  qPets = false;
  qFurnished = false;
  qOnShow = false;
  qWebReferenceNumber = '';
  qLimit = 2;
  sortOrder = 'dateCreated+desc';
  advancedOptions = '▼';
  moreChoice = 'More';

  constructor(public afs: AngularFirestore) {
    /* this.listingCollection = this.afs.collection<Listing>('PropertyData',
      ref => ref.orderBy(this.sortOrder.split('+')[0], this.sortOrder.includes('desc') ? 'desc' : 'asc'));
    this.listingItems = this.listingCollection.snapshotChanges().pipe(
      map(actions => actions
        .map(a => {
          const data = a.payload.doc.data() as Listing;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )); */
    this.propertyDetails = afs.doc<PropertyDetails>('DynamicVariables/PropertyDetails');
    this.propertyDetailsItems = this.propertyDetails.valueChanges();
    this.listingDetails = afs.doc<ListingDetails>('DynamicVariables/ListingDetails');
    this.listingDetailsItems = this.listingDetails.valueChanges();
  }

  ngOnInit(): void {
    this.search();
  }

  search() {
    /* console.log(this.sortOrder.split('+')[0] + ' ORDERED BY ' + (this.sortOrder.includes('desc') ? 'desc' : 'asc')); */
    this.listingCollection = this.afs.collection<Listing>('PropertyData',
      ref => ref
      .orderBy(this.sortOrder.split('+')[0], (this.sortOrder.includes('desc') ? 'desc' : 'asc'))
      );

    // Query all records with the following comparisson operators
    /* if (this.qListingType !== 'Any') {
      this.listingCollection.ref.where('listingDetails.listingType', 'in', [this.qListingType]);
    } */
    /* if (this.qPropertyType !== 'Any') {
      this.listingCollection.ref.where('propertyDetails.propertyType', 'in', [this.qPropertyType]);
    } */
    /* if (this.qMinPrice >= 0) {
      this.listingCollection.ref.where('listingDetails.price', '>=', this.qMinPrice);
    }
    if (this.qMaxPrice >= 0) {
      this.listingCollection.ref.where('listingDetails.price', '<=', this.qMaxPrice);
    }
    if (this.qBeds !== 'Any') {
      this.listingCollection.ref.where('propertyFeatures.bedroom', '>=', parseInt(this.qBeds.replace('+', ''), 10));
    }
    this.listingCollection.ref
      .where('propertyFeatures.flatlet', '==', this.qFlatlet)
      .where('propertyFeatures.petsAllowed', '==', this.qPets)
      .where('propertyFeatures.furnished', '==', this.qFurnished)
      .where('openHourDetails.onShow', '==', this.qOnShow); */

    this.listingItems = this.listingCollection.snapshotChanges().pipe(
      map(actions => actions
        .map(a => {
          const data = a.payload.doc.data() as Listing;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
        .filter(data => this.matchesQuery(data))
      ));
  }

  matchesQuery(data: ListingID) {
    /* console.log(this.qBeds.replace('+', '')); */
    if (this.qWebReferenceNumber === '') {
      if (this.qListingType === 'Any' || (data.listingDetails.listingType + '') === this.qListingType) {
        if (this.qPropertyType === 'Any' || (data.propertyDetails.propertyType + '') === this.qPropertyType) {
          if ((data.propertyDetails.suburb + '').toLowerCase().includes(this.qSuburbArea.toLowerCase())
            || (data.propertyDetails.area + '').toLowerCase().includes(this.qSuburbArea.toLowerCase())) {
            if (this.checkPrices(data.listingDetails.price)) {
              if (this.qBeds === 'Any' || data.propertyFeatures.bedroom >= parseInt(this.qBeds.replace('+', ''), 10)) {
                if (data.propertyFeatures.flatlet === this.qFlatlet || this.qFlatlet === false) {
                  if (data.propertyFeatures.petsAllowed === this.qPets || this.qPets === false) {
                    if (data.propertyFeatures.furnished === this.qFurnished || this.qFurnished === false) {
                      if (data.openHourDetails.onShow === this.qOnShow || this.qOnShow === false) {
                        return true;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      if ((data.websiteDetails.webRefNo + '').toLowerCase().includes(this.qWebReferenceNumber.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  checkPrices(listingDetailsPrice: number) {
    console.log('entering price comparisson');
    // tslint:disable-next-line: triple-equals
    if (this.qMinPrice == 0 && this.qMaxPrice == 0) {
      return true;
      // tslint:disable-next-line: triple-equals
    } else if (this.qMinPrice == 0) {
      if (listingDetailsPrice <= this.qMaxPrice) {
        console.log('true');
        return true;
      }
      // tslint:disable-next-line: triple-equals
    } else if (this.qMaxPrice == 0) {
      if (listingDetailsPrice >= this.qMinPrice) {
        console.log('true');
        return true;
      }
    } else {
      console.log('entered else....');
      if (listingDetailsPrice >= this.qMinPrice && listingDetailsPrice <= this.qMaxPrice) {
        console.log('true');
        return true;
      } else {
        console.log('false');
        return false;
      }
    }
  }

  openOverlay(listingItem: ListingID) {
    /* console.log('listing item set for: ');
    console.log(listingItem); */
    this.currentListingItem = listingItem;
  }

  toggleAdvancedOptions() {
    if (this.advancedOptions === '▼') {
      this.advancedOptions = '▲';
      this.moreChoice = 'Less';
    } else {
      this.advancedOptions = '▼';
      this.moreChoice = 'More';
    }
  }
}
