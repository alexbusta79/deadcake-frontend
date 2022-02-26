import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { MarketPlaceComponent } from './components/marketplace/marketplace.component';
import { UsersService } from './services/users.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewOfferingComponent } from './components/newOffering/newOffering.component';
import { PlayGameComponent } from './components/playgame/playgame.component';

import {Moment} from 'moment/moment';

import { LadingComponent } from './components/lading/lading.component';

@NgModule({
  declarations: [
    AppComponent,
    MarketPlaceComponent,
    LadingComponent,
    DashboardComponent,
    NewOfferingComponent,
    PlayGameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,FormsModule,
    CommonModule,
  ],
  providers: [
    UsersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
