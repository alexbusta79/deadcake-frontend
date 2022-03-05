import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MarketPlaceService } from './../../services/marketPlace.service';

@Component({
  selector: 'app-root',
  templateUrl: './lading.component.html',
  styleUrls: ['./lading.component.css'],
})
export class LadingComponent implements OnInit {
  
  nftNoMinteadosCaja1!: number; 
  nftNoMinteadosCaja2!: number; 
  nftNoMinteadosCaja3!: number; 

  precioCaja1!: number; 
  precioCaja2!: number; 
  precioCaja3!: number; 

  decimalesBUSD : number = 1000000000000000000; 

  constructor(private marketPlaceService : MarketPlaceService) {
  }

  ngOnInit(): void {
    this.marketPlaceService.openMetamask().then();
    this.nftNoMinteados();
    this.marketPlaceService.precioCaja(1).then(data => this.precioCaja1 = data / this.decimalesBUSD );
    this.marketPlaceService.precioCaja(2).then(data => this.precioCaja2 = data / this.decimalesBUSD );
    this.marketPlaceService.precioCaja(3).then(data => this.precioCaja3 = data / this.decimalesBUSD );
  }

  aprobarEnvioTokensAlContrato(idCaja : number) {
    this.marketPlaceService.precioCaja(idCaja).then(data => {
      this.marketPlaceService.aprobarEnvioTokensAlContrato(data).then(data => {
        this.marketPlaceService.mintNFT(idCaja).then(data => this.nftNoMinteados() );
      });
    });
  }

  nftNoMinteados() {
    this.marketPlaceService.nftNoMinteados(1).then(data => this.nftNoMinteadosCaja1 = data );
    this.marketPlaceService.nftNoMinteados(2).then(data => this.nftNoMinteadosCaja2 = data );
    this.marketPlaceService.nftNoMinteados(3).then(data => this.nftNoMinteadosCaja3 = data );
  }
}