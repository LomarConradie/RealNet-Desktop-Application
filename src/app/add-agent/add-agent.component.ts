import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import {
  Agent,
  AgentID
} from '../models/item';
import { Observable } from 'rxjs';
import { firestore } from 'firebase/app';
import { SnackbarService } from '../snackbar/snackbar.service';
import { inOutAnimation } from '../route-animations';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss'],
  animations: [inOutAnimation],
})
export class AddAgentComponent implements OnInit {
  userCreated = false;

  constructor(
    public afs: AngularFirestore,
    /* public authService: AuthService, */
    private fns: AngularFireFunctions,
    private snackbar: SnackbarService,
    private route: ActivatedRoute,
    private storage: AngularFireStorage,
    private router: Router) { }

  /* PAGE VARIABLES */
  // These arrays and indexes are used to keep track of navigation between components.
  addAgentRoutes: string[] = ['AgentDetails', 'AgentPictures'];
  addAgentNames: string[] = ['Agent Details', 'Agent Image'];
  currentIndex = 0;
  nextIndex = 1;
  previousIndex = -1;
  loading = false;
  uploading = false;

  /* AGENT DETAILS VARIABLES */
  /* password = ''; */

  /* PICTURE UPLOAD VARIABLES */
  isHovering: boolean;
  pics: File[] = [];
  /* pictureURLs: string[] = []; */
  fileError = '';
  globaldocID = '';
  agentEditID = '';

  /*  agentPicturesURLs: string[] = []; */
  agentMapCollection: AngularFirestoreCollection<Agent>;
  agentMapItems: Observable<AgentID[]>;
  agentMapInsert: Agent = {
    dateCreated: firestore.Timestamp.now(),
    admin: null,
    name: '',
    surname: '',
    email: '',
    password: '',
    contactNum: '',
    agentPicUrl: '',
    dev: false,
    userID: '',
    isEdit: false,
  };

  ngOnInit(): void {
    /* this.globaldocID = this.afs.createId();
    this.agentMapInsert.userID = this.globaldocID; */
    /* console.log('new user id:' + this.globaldocID);
    console.log(this.agentMapInsert); */

    this.route.paramMap.subscribe(params => {
      this.agentEditID = params.get('agentId');
    });
    if (this.agentEditID === null) {
      this.globaldocID = this.afs.createId();
      this.agentMapInsert.userID = this.globaldocID;
      /* console.log('new user id:' + this.globaldocID); */
    } else {
      this.globaldocID = this.agentEditID;
      const agentDoc = this.afs.doc<Agent>('Agents/' + this.globaldocID);
      agentDoc.valueChanges().subscribe((agent: Agent) => {
        this.agentMapInsert = agent;
        this.agentMapInsert.userID = this.globaldocID;
        this.agentMapInsert.isEdit = true;
      });
    }
  }

  /* PAGE METHODS */
  onNextButton() {
    const currentForm: HTMLFormElement = (document.getElementById(this.addAgentRoutes[this.currentIndex]) as HTMLFormElement);
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
    this.createAgent();
  }

  incrementIndexes() {
    if (this.currentIndex < this.addAgentRoutes.length - 1) {
      this.currentIndex++;
      this.previousIndex++;
    }
    if (this.nextIndex < this.addAgentRoutes.length) {
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

  /* agentDataInsert(userID) {
    this.agentMapCollection = this.afs.collection<Agent>('Agents');
    this.agentMapItems = this.agentMapCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Agent;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    this.agentMapInsert.dateCreated = firestore.Timestamp.now();
    this.agentMapCollection.doc(userID).set(this.agentMapInsert).then(() => {
      console.log('Agent Inserted');
      this.loading = false;
      this.snackbar.show('Agent added successfully :)', 'success');
    }).catch(error => {
      console.log('Error' + error);
      this.loading = false;
      this.snackbar.show('Agent could not be added currently, try again later :(', 'error');
    });
  } */

  createAgent() {
    this.loading = true;
    this.agentMapInsert.dateCreated = firestore.Timestamp.now();

    const callable = this.fns.httpsCallable('createAgent');
    callable(this.agentMapInsert).toPromise().then((result) => {
      console.log(result);
      switch (result.code) {
        case 'agent-account-not-created':
          this.snackbar.show('Agent account could not be created, try again later :(', 'error');
          break;
        case 'agent-record-not-created':
          this.snackbar.show('Agent record could not be created, try again later :(', 'error');
          break;
        case 'agent-created':
          this.snackbar.show('Agent added successfully!', 'success');
          this.router.navigate(['/agents']);
          break;
          case 'agent-account-not-updated':
          this.snackbar.show('Agent account could not be updated, try again later :(', 'error');
          break;
        case 'agent-record-not-updated':
          this.snackbar.show('Agent record could not be updated, try again later :(', 'error');
          break;
        case 'agent-updated':
          this.snackbar.show('Agent updated successfully!', 'success');
          this.router.navigate(['/agents']);
          break;
        default:
          this.snackbar.show('An unexpected error occured :\'(', 'error');
          break;
      }
      this.loading = false;
    });
    /* this.afAuth.createUserWithEmailAndPassword(this.agentMapInsert.email, this.password).then((result) => {
      console.log('userID' + result.user.uid);
      if (result.user.uid === 'Error' || result.user.uid === '') {
        console.log('Insert Error');
        this.loading = false;
        this.snackbar.show('Agent account could not be created, try again later :(', 'error');
      } else {
        this.agentDataInsert(result.user.uid);
      }
    }); */
  }

  /* AGENT IMAGE UPLOAD METHODS */
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
    this.agentMapInsert.agentPicUrl = url;
    this.uploading = false;
  }

  removePictureFile(file: File) {
    this.pics.splice(this.pics.indexOf(file), 1);
  }

  removePictureURL() {
    this.agentMapInsert.agentPicUrl = '';
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
