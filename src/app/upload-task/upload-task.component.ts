import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { tap, finalize } from 'rxjs/operators';
import { firestore } from 'firebase/app';

@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss']
})
export class UploadTaskComponent implements OnInit {

  @Input() file: File;
  @Input() itemID: string;
  @Output() URLAdded: EventEmitter<string> = new EventEmitter<string>();
  @Output() fileCanceled: EventEmitter<File> = new EventEmitter<File>();
  @Output() fileDeleted: EventEmitter<string> = new EventEmitter<string>();

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL;
  path;
  /* cancelled = false; */
  done = false;

  constructor(private storage: AngularFireStorage, private afs: AngularFirestore) { }

  ngOnInit() {
    this.startUpload();
  }

  startUpload() {
    // Name of the local file
    const fileName = this.file.name;

    // The storage path on firebase
    this.path = `${this.itemID}/${Date.now()}_${fileName}`;

    // Reference to storage bucket
    const ref = this.storage.ref(this.path);

    // Main upload task
    this.task = this.storage.upload(this.path, this.file);
    this.task.catch(e => {
      console.log(`Upload of picture could not be completed, MESSAGE: ${e.message}`);
    });

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot = this.task.snapshotChanges().pipe(
      /* tap(console.log), */
      // The file's download URL
      finalize(async () => {
        this.downloadURL = await ref.getDownloadURL().toPromise().catch(e => {
          console.log('downloadURL could not be generated: ' + e.message);
        });
        this.done = true;
        this.URLAdded.emit(this.downloadURL);
        /* this.afs.doc(`PropertyData/${this.propertyID}`).update({
          propertyPictureURLs: firestore.FieldValue.arrayUnion(this.downloadURL)
        }).catch(e => {
          console.log(`Could not save Firebase record for file: ${fileName} MESSAGE: ${e}`);
        }); */
      })
    );
  }

  isActive(snapshot) {
    return snapshot.state === 'running'
      && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  removeFile() {
    this.task.cancel();
    this.fileCanceled.emit(this.file);
  }

  /* deletePicture() {
    console.log('URL of Image to be deleted: ' + this.downloadURL);
    this.storage.ref(this.path).delete().toPromise().catch(e => {
      console.log('Could not delete file from storage: ' + e);
    });
  } */

}
