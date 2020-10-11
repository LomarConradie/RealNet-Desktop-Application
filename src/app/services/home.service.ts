//Imports used in this file is done here. 
import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection , AngularFirestoreDocument} from '@angular/fire/firestore'; 
/* import {Item} from '../models/Item';  */
import { Observable } from 'rxjs'; 
import { map } from 'rxjs/operators';  
//Injectable is used for the dataabse functions. 
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  //We are working with collections in this file , so we create a object and reference the Item interface made in item.ts file. 
/* itemsCollection: AngularFirestoreCollection<Item>; 
items: Observable<Item[]>;   */

  constructor(/* public afs: AngularFirestore */) {

   // this.items = this.afs.collection('UsersTest').valueChanges();   
   /* this.itemsCollection = this.afs.collection('UsersTest'); 
   this.items = this.itemsCollection.snapshotChanges().pipe(map(changes => {
      return changes.map(a =>{
        const data = a.payload.doc.data() as Item; 
        data.id =  a.payload.doc.id; 
        return data; 
      });
   }));   */
}

getItems() {
  /* return this.items;  */
}
addItem(/* item: Item */) {
  /* this.itemsCollection.add(item);  */
}

}

