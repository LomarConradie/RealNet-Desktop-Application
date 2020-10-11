import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Buyer, BuyerID } from 'src/app/models/item';

@Component({
  selector: 'app-buyer-overlay',
  templateUrl: './buyer-overlay.component.html',
  styleUrls: ['./buyer-overlay.component.scss']
})
export class BuyerOverlayComponent implements OnInit {

  @Input() overlayData: BuyerID;
  @Output() closeOverlay: EventEmitter<BuyerID> = new EventEmitter<BuyerID>();

  /* agentsCollection: AngularFirestoreCollection<Buyer>;
  agentItems: Observable<BuyerID[]>; */

  selectedPic = 0;

  constructor(/* private afs: AngularFirestore */) { }

  ngOnInit(): void {
    /* document.getElementById('content').classList.add('not-scroll'); */
    /* this.search(); */
  }

  disposeOverlay() {
    /* document.getElementById('content').classList.remove('not-scroll'); */
    this.closeOverlay.emit(null);
  }

}
