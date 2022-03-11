import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MarketPlaceService } from './services/marketPlace.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ngEth';
  private window: any;
  mostrarConnect : boolean =  false;
  muestraWallet!: string;
  menuDesplegable: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document,private marketPlaceService : MarketPlaceService) {
    this.window = this.document.defaultView;
  }

  ngOnInit(): void{ 
    this.quitarMenu();

    this.marketPlaceService.getAddress().then(addresses => {
      if (addresses == null) { 
        this.mostrarConnect = false;
      } else {
        this.muestraWallet = addresses.substr(0,9);
        this.mostrarConnect = true;
      }
    });
  }
  
  conectarMetamask() {
    this.marketPlaceService.openMetamask().then(data =>
      this.ngOnInit()
    );
  }

  desplegarMenu() {
    this.menuDesplegable= !this.menuDesplegable;
  }
  quitarMenu() {
    this.menuDesplegable= false;
  }
}