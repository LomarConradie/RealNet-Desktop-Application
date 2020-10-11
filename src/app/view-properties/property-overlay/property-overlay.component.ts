import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Agent, AgentID, ListingID } from 'src/app/models/item';
import { firestore } from 'firebase/app';
import { map } from 'rxjs/operators';
import { modalPopup } from 'src/app/route-animations';

@Component({
  selector: 'app-property-overlay',
  templateUrl: './property-overlay.component.html',
  styleUrls: ['./property-overlay.component.scss'],
  animations: [modalPopup]
})
export class PropertyOverlayComponent implements OnInit {

  @Input() overlayData: ListingID;
  @Output() closeOverlay: EventEmitter<ListingID> = new EventEmitter<ListingID>();

  agentsCollection: AngularFirestoreCollection<Agent>;
  agentItems: Observable<AgentID[]>;

  selectedPic = 0;

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    /* document.getElementById('content').classList.add('not-scroll'); */
    this.search();
  }

  disposeOverlay() {
    /* document.getElementById('content').classList.remove('not-scroll'); */
    this.closeOverlay.emit(null);
  }

  search() {
    /* console.log('entering search()'); */

    this.agentsCollection = this.afs.collection<Agent>('Agents',
      ref => ref.where(firestore.FieldPath.documentId(), 'in', this.overlayData.listingDetails.agents));
    this.agentItems = this.agentsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as AgentID;
        const id = a.payload.doc.id;
        return { id, ...data };
      })
        /* .filter(data => this.matchesQuery(data)) */
      )
    );
  }

}
