import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authService/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
    const loader = document.getElementById('page-loader');
    loader.classList.add('fadeloader');
  }

  signOut() {
    this.auth.signOut();
  }

}
