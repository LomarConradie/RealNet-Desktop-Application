// Module imports
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Component imports
import { HomeComponent } from './home/home.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { ViewPropertiesComponent } from './view-properties/view-properties.component';
import { AddBuyerComponent } from './add-buyer/add-buyer.component';
import { ViewBuyersComponent } from './view-buyers/view-buyers.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';
import { ViewAgentsComponent } from './view-agents/view-agents.component';
import { AddAgentComponent } from './add-agent/add-agent.component';

// Predefined routes to navigate between components
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { animation: '0' } },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { animation: '1' } },
  { path: 'properties', component: ViewPropertiesComponent, canActivate: [AuthGuard], data: { animation: '2' } },
  { path: 'addproperty', component: AddPropertyComponent, canActivate: [AuthGuard], data: { animation: '3' } },
  { path: 'addproperty/:propertyId', component: AddPropertyComponent, canActivate: [AuthGuard], data: { animation: '3' } },
  { path: 'buyers', component: ViewBuyersComponent, canActivate: [AuthGuard], data: { animation: '4' } },
  { path: 'addbuyer', component: AddBuyerComponent, canActivate: [AuthGuard], data: { animation: '5' } },
  { path: 'addbuyer/:buyerId', component: AddBuyerComponent, canActivate: [AuthGuard], data: { animation: '5' } },
  { path: 'agents', component: ViewAgentsComponent, canActivate: [AuthGuard], data: { animation: '6' } },
  { path: 'addagent', component: AddAgentComponent, canActivate: [AuthGuard], data: { animation: '7' } },
  { path: 'addagent/:agentId', component: AddAgentComponent, canActivate: [AuthGuard], data: { animation: '8' } },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
