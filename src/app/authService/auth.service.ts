import { Injectable } from '@angular/core';
import { Agent } from '../models/item';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SnackbarService } from '../snackbar/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<Agent>;
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private snackbarService: SnackbarService
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<Agent>(`Agents/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async signIn(email, password) {
    /* const provider = new auth.EmailAuthProvider();
    const credential = */
    await this.afAuth.signInWithEmailAndPassword(email, password).then(() => {
      this.snackbarService.show('Log in successful!', 'success');
      console.log('logged in successfully!');
      this.router.navigate(['/home']);
    }).catch((e: string) => {
      this.snackbarService.show(e, 'error');
      console.log('Log in error: ' + e);
    });
    /* return this.setUserInfo(credential.user); */
  }


  async signOut() {
    await this.afAuth.signOut().then(() => {
      this.snackbarService.show('You are now logged out!', 'success');
    }).catch(e => {
      this.snackbarService.show('Could not log out right now!', 'error');
      console.log('Log out error: ' + e);
    });
    return this.router.navigate(['/login']);
  }

  async resetPassword(email): Promise<boolean> {
    return await this.afAuth.sendPasswordResetEmail(email).then(() => {
      this.snackbarService.show('Password change request sent!', 'success');
      return true;
    }).catch(e => {
      this.snackbarService.show('Could not reset password right now: ' + e, 'error');
      console.log('Password reset error: ' + e);
      return false;
    });
  }

  /* async createAgent(email, password): Promise<string> {
    console.log(email);
    console.log(password);
    return await this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result.user.uid);
        return result.user.uid;
      }).catch(e => {
        console.log(e.message);
        return 'Error';
      });
  } */
}
