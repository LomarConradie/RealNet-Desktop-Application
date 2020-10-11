import { Component, OnInit } from '@angular/core';
import { Buyer, BuyerID, ListingDetails, PropertyDetails } from '../models/item';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { inOutAnimation, modalPopup } from '../route-animations';

@Component({
  selector: 'app-view-buyers',
  templateUrl: './view-buyers.component.html',
  styleUrls: ['./view-buyers.component.scss'],
  animations: [modalPopup, inOutAnimation],
})
export class ViewBuyersComponent implements OnInit {
  // Database variables and links
  listingDetails: AngularFirestoreDocument<ListingDetails>;
  lisstingDetailsItems: Observable<ListingDetails>;
  propertyDetails: AngularFirestoreDocument<PropertyDetails>;
  propertyDetailsItems: Observable<PropertyDetails>;
  buyersCollection: AngularFirestoreCollection<Buyer>;
  buyersItems: Observable<BuyerID[]>;

  timeinmilis: Date;
  qNameSurname = '';
  qPropertyType = 'Any';
  qSuburbArea = '';
  qMinPrice = 0;
  qMaxPrice = 0;
  qRentBuy = 'Any';
  sortOrder = 'dateCreated+desc';

  currentBuyerItem: any = null;

  constructor(public afs: AngularFirestore) {
    this.propertyDetails = afs.doc<PropertyDetails>('DynamicVariables/PropertyDetails');
    this.propertyDetailsItems = this.propertyDetails.valueChanges();
    this.listingDetails = afs.doc<ListingDetails>('DynamicVariables/ListingDetails');
    this.lisstingDetailsItems = this.listingDetails.valueChanges();
  }

  ngOnInit(): void {
    this.search();
  }

  search() {
    /* console.log('entering search()'); */

    this.buyersCollection = this.afs.collection<Buyer>('Buyers',
      ref => ref.orderBy(this.sortOrder.split('+')[0], (this.sortOrder.includes('desc') ? 'desc' : 'asc')));
    this.buyersItems = this.buyersCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as BuyerID;
        const id = a.payload.doc.id;
        return { id, ...data };
      })
        .filter(data => this.matchesQuery(data))
      )
    );

  }

  matchesQuery(data: BuyerID) {
    if ((data.personalDetails.firstName + '').toLowerCase().includes(this.qNameSurname.toLowerCase())
      || (data.personalDetails.lastName + '').toLowerCase().includes(this.qNameSurname.toLowerCase())) {
      if (this.qPropertyType === 'Any' || (data.requirements.propertyType + '') === this.qPropertyType) {
        if ((data.requirements.suburb + '').toLowerCase().includes(this.qSuburbArea.toLowerCase())
          || (data.requirements.area + '').toLowerCase().includes(this.qSuburbArea.toLowerCase())) {
          if (this.checkPrices(data.requirements.minPrice, data.requirements.maxPrice)) {
            if (this.qRentBuy === 'Any' || (data.requirements.owningPreference + '') === this.qRentBuy) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  checkPrices(buyerMinPrice: number, buyerMaxPrice: number) {
    /* console.log('entering price comparisson'); */
    // tslint:disable-next-line: triple-equals
    if (this.qMinPrice == 0 && this.qMaxPrice == 0) {
      return true;
      // tslint:disable-next-line: triple-equals
    } else if (this.qMinPrice == 0 && this.qMaxPrice > 0) {
      if ((buyerMinPrice <= this.qMaxPrice || buyerMaxPrice <= this.qMaxPrice)) {
        console.log('DB max <= qMax');
        return true;
      }
      // tslint:disable-next-line: triple-equals
    } else if (this.qMaxPrice == 0 && this.qMinPrice > 0) {
      if ((buyerMinPrice >= this.qMinPrice || buyerMaxPrice >= this.qMinPrice)) {
        console.log('DB min >= qMin');
        return true;
      }
    } else {
      console.log('entered else....');
      if ((buyerMinPrice >= this.qMinPrice || buyerMaxPrice >= this.qMinPrice)
        && (buyerMinPrice <= this.qMaxPrice || buyerMaxPrice <= this.qMaxPrice)) {
        console.log('DB min >= qMin && DB max <= qMax');
        return true;
      } else {
        console.log('false');
        return false;
      }
    }
  }

  openOverlay(buyerItem: BuyerID) {
    /* console.log('listing item set for: ');
    console.log(listingItem); */
    this.currentBuyerItem = buyerItem;
  }
}
