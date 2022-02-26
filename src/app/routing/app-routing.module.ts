import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarketPlaceComponent } from '../components/marketplace/marketplace.component';
import { LadingComponent } from '.././components/lading/lading.component';
import { DashboardComponent } from '.././components/dashboard/dashboard.component';
import { NewOfferingComponent } from '.././components/newOffering/newOffering.component';
import { PlayGameComponent } from '.././components/playgame/playgame.component';

const routes: Routes = [
  //{path: "", redirectTo: "", pathMatch: "full"},
  {path:'lading', component: LadingComponent},
  {path:'dashboard', component: DashboardComponent},
  {path:'marketplace', component: MarketPlaceComponent},
  {path:'playgame', component: PlayGameComponent},
  {path:'newoffering', component: NewOfferingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
