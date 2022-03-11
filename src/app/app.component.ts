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
  numeroWallet : any; 
  mostrarConnect : boolean =  false;
  /*  */
  muestraWallet!: string;
  menuDesplegable: boolean = false;
  /*  */



  constructor(@Inject(DOCUMENT) private document: Document,private marketPlaceService : MarketPlaceService) {
    this.window = this.document.defaultView;
  }

  ngOnInit(): void{ //No sé porque el void ngOnInit(): void {}
    this.quitarMenu();
  }
  
  conectarMetamask() {
   // this.marketPlaceService.openMetamask().then();
    this.marketPlaceService.getAddress().then(data => {
      if(data != false && data != null ) {
        let anyToString!: String; /* */

        this.numeroWallet = data;
        this.mostrarConnect = true;
        /* */
        anyToString = String(this.numeroWallet);
        this.muestraWallet = anyToString.substr(0,9);
      }
    });
  }

  desplegarMenu() {
    this.menuDesplegable= !this.menuDesplegable;
  }
  quitarMenu() {
    this.menuDesplegable= false;
  }
}