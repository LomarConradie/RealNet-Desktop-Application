// Module imports.
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
// Component imports
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ViewPropertiesComponent } from './view-properties/view-properties.component';
// Environment imports
import { environment } from '../environments/environment';
import { DropzoneDirective } from './dropzone.directive';
import { UploadTaskComponent } from './upload-task/upload-task.component';
import { PropertyOverlayComponent } from './view-properties/property-overlay/property-overlay.component';
import { AddBuyerComponent } from './add-buyer/add-buyer.component';
import { ViewBuyersComponent } from './view-buyers/view-buyers.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { AddAgentComponent } from './add-agent/add-agent.component';
import { ViewAgentsComponent } from './view-agents/view-agents.component';
import { REGION, ORIGIN } from '@angular/fire/functions';
import { BuyerOverlayComponent } from './view-buyers/buyer-overlay/buyer-overlay.component';

// Pipe imports

@NgModule({
  // Main components are declared here.
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AddPropertyComponent,
    NavbarComponent,
    ViewPropertiesComponent,
    DropzoneDirective,
    UploadTaskComponent,
    PropertyOverlayComponent,
    AddBuyerComponent,
    ViewBuyersComponent,
    SnackbarComponent,
    LoadingSpinnerComponent,
    AddAgentComponent,
    ViewAgentsComponent,
    BuyerOverlayComponent,
  ],
  // Imports are declared here.
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireAnalyticsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: REGION, useValue: 'europe-west2' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
