import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { Event, RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { fader } from './route-animations';
import { AuthService } from './authService/auth.service';

export interface UsersTests { userName: string; }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fader
  ]
})

export class AppComponent implements AfterViewInit {
  title = 'Realnet Desktop';
  loading = false;
  user = null;
  showScroll = false;
  showScrollHeight = 300;
  hideScrollHeight = 10;
  advancedOptions = '▼';
  scrollPos = 0;

  constructor(private renderer: Renderer2, private router: Router, public auth: AuthService) {
    // Shows loading bar when navigating between pages
    this.user = auth.user$;
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  // This method will listen for when all elements are done loading and remove the page-loader spinner.
  ngAfterViewInit() {
    /* const loader = this.renderer.selectRootElement('#page-loader');
    loader.style.display = 'none'; // hide loader */
  }

  // Linked to routerOutlet in HTML, will run when routerLink is called/clicked (LJLG)
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  scrollToTop() {
    const element = document.querySelector('#content');
    if (element) {
      element.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  }

  checkScrollTop(scrollEvent: any) {
    const scroll = scrollEvent.target.scrollTop;
    if (scroll > this.showScrollHeight) {
      this.showScroll = true;
    } else if (this.showScroll
      && scroll < this.hideScrollHeight) {
      this.showScroll = false;
    }
  }
}
