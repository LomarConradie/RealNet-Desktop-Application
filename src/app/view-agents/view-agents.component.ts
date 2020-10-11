import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AngularFirestoreDocument,
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Agent, AgentID, ListingDetails, PropertyDetails } from '../models/item';
import { inOutAnimation } from '../route-animations';

@Component({
  selector: 'app-view-agents',
  templateUrl: './view-agents.component.html',
  styleUrls: ['./view-agents.component.scss'],
  animations: [inOutAnimation],
})
export class ViewAgentsComponent implements OnInit {
  listingDetails: AngularFirestoreDocument<ListingDetails>;
  listingDetailsItems: Observable<ListingDetails>;
  propertyDetails: AngularFirestoreDocument<PropertyDetails>;
  propertyDetailsItems: Observable<PropertyDetails>;
  agentsCollection: AngularFirestoreCollection<Agent>;
  agentItems: Observable<AgentID[]>;

  timeinmilis: Date;
  qNameSurname = '';
  qContactNum = '';
  qEmail = '';
  qListingType = 'Any';
  qAdmin = false;
  qSuburb = 'Any';
  /* qMinPrice = 0;
  qMaxPrice = 0;
  qRentBuy = 'Any'; */
  sortOrder = 'dateCreated+desc';
  advancedOptions = '▼';
  moreChoice = 'More';

  constructor(public afs: AngularFirestore) {
    this.propertyDetails = afs.doc<PropertyDetails>('DynamicVariables/PropertyDetails');
    this.propertyDetailsItems = this.propertyDetails.valueChanges();
    this.listingDetails = afs.doc<ListingDetails>('DynamicVariables/ListingDetails');
    this.listingDetailsItems = this.listingDetails.valueChanges();
  }

  ngOnInit(): void {
    this.search();
  }

  search() {
    /* console.log('entering search()'); */

    this.agentsCollection = this.afs.collection<Agent>('Agents',
      ref => ref.orderBy(this.sortOrder.split('+')[0], (this.sortOrder.includes('desc') ? 'desc' : 'asc')));
    this.agentItems = this.agentsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as AgentID;
        const id = a.payload.doc.id;
        return { id, ...data };
      })
        .filter(data => this.matchesQuery(data))
      )
    );
  }

  moreOptions() {
    if (this.advancedOptions === '▼') {
      this.advancedOptions = '▲';
      this.moreChoice = 'Less';
    } else {
      this.advancedOptions = '▼';
      this.moreChoice = 'More';
    }
  }


  matchesQuery(data: AgentID) {
    if ((data.name + '').toLowerCase().includes(this.qNameSurname.toLowerCase())
      || (data.surname + '').toLowerCase().includes(this.qNameSurname.toLowerCase())) {
      if (data.contactNum.toLowerCase().includes(this.qContactNum)) {
        /* if (this.qListingType === 'Any' || (data.requirements.owningPreference + '') === this.qRentBuy) { */
          if (data.email.toLowerCase().includes(this.qEmail)) {
            /* if (this.qRentBuy === 'Any' || (data.requirements.owningPreference + '') === this.qRentBuy) { */
              if (data.admin === this.qAdmin || this.qAdmin === false) {
                return true;
              }
            /* } */
          }
        /* } */
      }
    }

    return false;
  }

  /*  checkPrices(buyerMinPrice: number, buyerMaxPrice: number) {
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
   } */

}
