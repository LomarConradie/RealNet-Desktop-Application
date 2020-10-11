import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Agent } from '../models/item';
import { auth } from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../authService/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  forgotPassword = false;
  loading = false;

  constructor(private authService: AuthService, private router: Router) {
    if (authService.user$ !== null) {
      this.router.navigate(['/home']);
    }
  }

  signIn(email, password) {
    this.loading = true;
    this.authService.signIn(email, password).then(() => {
      this.loading = false;
    });
  }

  resetPassword(email) {
    this.loading = true;
    this.authService.resetPassword(email).then((sent: boolean) => {
      this.loading = false;
      if (sent === true) {
        this.toggleForgotPassword();
      }
    });

  }

  toggleForgotPassword() {
    this.forgotPassword = !this.forgotPassword;
  }

  ngOnInit(): void {

  }

}
