import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MarketPlaceService } from './../../services/marketPlace.service';

@Component({
  selector: 'app-root',
  templateUrl: './lading.component.html',
  styleUrls: ['./lading.component.css'],
})
export class LadingComponent implements OnInit {
  title = 'ngEth';
  
  private window: any;

  nftNoMinteadosCaja1!: number; 
  nftNoMinteadosCaja2!: number; 
  nftNoMinteadosCaja3!: number; 

  constructor(@Inject(DOCUMENT) private document: Document,private marketPlaceService : MarketPlaceService) {
    this.window = this.document.defaultView;
  }

  ngOnInit(): void {
    this.marketPlaceService.openMetamask().then();
    this.marketPlaceService.nftNoMinteados(1).then(data => this.nftNoMinteadosCaja1 = data );
    this.marketPlaceService.nftNoMinteados(2).then(data => this.nftNoMinteadosCaja2 = data );
    this.marketPlaceService.nftNoMinteados(3).then(data => this.nftNoMinteadosCaja3 = data );
  }

  aprobarEnvioTokensAlContrato(idCaja : number) {
    this.marketPlaceService.precioCaja(idCaja).then(data => {
      console.log(data); 
      this.marketPlaceService.aprobarEnvioTokensAlContrato(data).then(data => {
        console.log(data); 
        this.marketPlaceService.mintNFT(idCaja).then(data => console.log(data));
      });
    });
  }
}