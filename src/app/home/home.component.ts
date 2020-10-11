import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../snackbar/snackbar.service';
import { AuthService } from '../authService/auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Buyer, BuyerID, Listing, ListingID } from '../models/item';
import { map } from 'rxjs/operators';
import { inOutAnimation, modalPopup } from '../route-animations';
/* import { HomeService } from '../services/home.service';
import { Item } from '../models/item';   */

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [modalPopup],
})
export class HomeComponent implements OnInit {
  listingCollection: AngularFirestoreCollection<Listing>;
  listingItems: Observable<ListingID[]>;
  buyersCollection: AngularFirestoreCollection<Buyer>;
  buyersItems: Observable<BuyerID[]>;
  sortOrder = 'dateCreated+desc';

  currentListingItem: any = null;
  currentBuyerItem: any = null;

  constructor(private snackbarService: SnackbarService, public auth: AuthService, private afs: AngularFirestore) { }

  buyerIndex = 0;
  /* totBuyers = 0; */

  listingIndex = 0;
  /* totListings = 0; */

  qSuburb = '';

  ngOnInit(): void {
    /* this.homeService.getItems().subscribe(items => {
      console.log(items);
      this.items = items;
    });  */
    this.search();
  }

  /* openSnackbar() {
    this.snackbarService.show('Testing 123...', 'error');
  } */

  search() {
    this.buyersCollection = this.afs.collection<Buyer>('Buyers'/* ,
      ref => ref
        .orderBy('requirements.area', (this.sortOrder.includes('desc') ? 'desc' : 'asc'))
        .startAt(this.qSuburb)
        .endAt(this.qSuburb + '\uf8ff') */
    );
    this.buyersItems = this.buyersCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as BuyerID;
        const id = a.payload.doc.id;
        return { id, ...data };
      })
        .filter(data => this.matchesQueryBuyer(data))
      )
    );

    this.listingCollection = this.afs.collection<Listing>('PropertyData'/* ,
      ref => ref
        .orderBy('propertyDetails.area', (this.sortOrder.includes('desc') ? 'desc' : 'asc'))
        .startAt(this.qSuburb)
        .endAt(this.qSuburb + '\uf8ff') */
    );
    this.listingItems = this.listingCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ListingID;
        const id = a.payload.doc.id;
        return { id, ...data };
      })
        .filter(data => this.matchesQueryProperty(data))
      )
    );
  }

  matchesQueryBuyer(data: BuyerID) {
    if ((data.requirements.area + '').toLowerCase().includes(this.qSuburb.toLowerCase())
      || (data.requirements.suburb + '').toLowerCase().includes(this.qSuburb.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  matchesQueryProperty(data: ListingID) {
    if ((data.propertyDetails.area + '').toLowerCase().includes(this.qSuburb.toLowerCase())
      || (data.propertyDetails.suburb + '').toLowerCase().includes(this.qSuburb.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }

  incrementBuyer() {
    this.buyersItems.subscribe((result) => {
      if (this.buyerIndex < (result.length - 1)) {
        this.buyerIndex++;
      }
    });
  }

  decrementBuyer() {
    if (this.buyerIndex > 0) {
      this.buyerIndex--;
    }
  }

  incrementProperties() {
    this.listingItems.subscribe((result) => {
      if (this.listingIndex < (result.length - 1)) {
        this.listingIndex++;
      }
    });
  }

  decrementProperties() {
    if (this.listingIndex > 0) {
      this.listingIndex--;
    }
  }

  openPropertyOverlay(listingItem: ListingID) {
    /* console.log('listing item set for: ');
    console.log(listingItem); */
    this.currentListingItem = listingItem;
  }

  openBuyerOverlay(listingItem: BuyerID) {
    /* console.log('listing item set for: ');
    console.log(listingItem); */
    this.currentBuyerItem = listingItem;
  }
}
