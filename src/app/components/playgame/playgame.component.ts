
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MarketPlaceService } from 'src/app/services/marketPlace.service';

@Component({
  selector: 'app-user',
  templateUrl: './playgame.component.html',
  styleUrls: ['./playgame.component.css']  
})
export class PlayGameComponent implements OnInit {

  video : boolean = false; 
  superadoTiempoFarming1!: boolean; 
  superadoTiempoFarming2!: boolean; 
  superadoTiempoFarming3!: boolean; 
  recompensaAcumulada1!: number;
  recompensaAcumulada2!: number;
  recompensaAcumulada3!: number;
  tiempoDeFarmingTotal1!: number;
  tiempoDeFarmingTotal2!: number;
  tiempoDeFarmingTotal3!: number;
  balanceDelFarming!: number;
  balanceDelToken!: number;
  decimalesToken : number = 1000; 
  decimalesJuego : number = 10000000000; 
  nftTotales1!: number;
  nftTotales2!: number;
  nftTotales3!: number;
  balanceDelNFT!: number;
  /* ------------------- */ 
  unidadHora1: number = 0;
  decenaMinutos1: number = 0; 
  unidadMinutos1: number = 0;
  unidadHora2: number = 0
  decenaMinutos2: number = 0;
  unidadMinutos2: number = 0;
  unidadHora3: number = 0;
  decenaMinutos3: number = 0;
  unidadMinutos3: number = 0;
  unidadPrueba: number = 0; 

  /* ----------------------------------------*/
  existenciaNFT1: boolean = false;
  existenciaNFT2: boolean = false;
  existenciaNFT3: boolean = false;
  videoFin: boolean = true;
  
  /* -------------------- */
  

  

  constructor(private marketPlaceService : MarketPlaceService,private router : Router) { }


  ngOnInit() {
    this.desactivarVideo();
    this.marketPlaceService.superadoTiempoDeFarming(1).then(data => this.superadoTiempoFarming1 = data );
    this.marketPlaceService.superadoTiempoDeFarming(2).then(data => this.superadoTiempoFarming2 = data );
    this.marketPlaceService.superadoTiempoDeFarming(3).then(data => this.superadoTiempoFarming3 = data );

  //  setTimeout(() => {
  //    this.desactivarVideo();
  //  }, 13800);

    this.marketPlaceService.recompensaAcumulada(1).then(data =>{
      if (isNaN(data ) ){ this.recompensaAcumulada1=0; } else { this.recompensaAcumulada1 = data; } 
    });
    this.marketPlaceService.recompensaAcumulada(2).then(data => {
      if (isNaN(data ) ){ this.recompensaAcumulada2=0; } else { this.recompensaAcumulada2 = data; } 
    });
    this.marketPlaceService.recompensaAcumulada(3).then(data => {
      if (isNaN(data ) ){ this.recompensaAcumulada3=0; } else { this.recompensaAcumulada3 = data; } 
    });

    this.marketPlaceService.tiempoDeFarmingTotal(1).then(data => {
      this.marketPlaceService.tiempoDeFarming().then(tiempoFarming => {
        let tiempoRestante;
        //let dato = 14123;
          if (data >= tiempoFarming) {
          tiempoRestante = 0;
        } else { tiempoRestante = tiempoFarming - data; }
        
        let minutos = tiempoRestante / 60;
        let hora = minutos / 60;
        let cantidadMinutos = (Math.trunc(minutos) - (Math.trunc(hora) * 60) );
        let minutosDecena = cantidadMinutos / 10;
  
        this.unidadHora1= Math.trunc(hora);
        this.decenaMinutos1 = Math.trunc(minutosDecena);
        this.unidadMinutos1 = cantidadMinutos - (this.decenaMinutos1 * 10);
        this.tiempoDeFarmingTotal1 = data;
        //Mostrar NFT
        this.existenciaNFT1 = true;
  
        if(isNaN(data)){
        this.unidadHora1= 0;
        this.decenaMinutos1 = 0;
        this.unidadMinutos1 = 0;
        this.existenciaNFT1 = false;
        }
      }
      );
    } );
  
    this.marketPlaceService.tiempoDeFarmingTotal(2).then(data => {
      this.marketPlaceService.tiempoDeFarming().then(tiempoFarming => {
        let tiempoRestante;
        //let dato = 14123;
          if (data >= tiempoFarming) {
          tiempoRestante = 0;
        } else { tiempoRestante = tiempoFarming - data; }
        
        let minutos = tiempoRestante / 60;
        let hora = minutos / 60;
        let cantidadMinutos = (Math.trunc(minutos) - (Math.trunc(hora) * 60) );
        let minutosDecena = cantidadMinutos / 10;
  
        this.unidadHora2= Math.trunc(hora);
        this.decenaMinutos2 = Math.trunc(minutosDecena);
        this.unidadMinutos2 = cantidadMinutos - (this.decenaMinutos2 * 10);
        this.tiempoDeFarmingTotal2 = data;
        //Mostrar NFT
        this.existenciaNFT2 = true;
  
        if(isNaN(data)){
        this.unidadHora2= 0;
        this.decenaMinutos2 = 0;
        this.unidadMinutos2 = 0;
        this.existenciaNFT2 = false;
        }
      }
      );
    } );

    this.marketPlaceService.tiempoDeFarmingTotal(3).then(data => {
      this.marketPlaceService.tiempoDeFarming().then(tiempoFarming => {
        let tiempoRestante;
        //let dato = 14123;
          if (data >= tiempoFarming) {
          tiempoRestante = 0;
        } else { tiempoRestante = tiempoFarming - data; }
        
        let minutos = tiempoRestante / 60;
        let hora = minutos / 60;
        let cantidadMinutos = (Math.trunc(minutos) - (Math.trunc(hora) * 60) );
        let minutosDecena = cantidadMinutos / 10;
  
        this.unidadHora3= Math.trunc(hora);
        this.decenaMinutos3 = Math.trunc(minutosDecena);
        this.unidadMinutos3 = cantidadMinutos - (this.decenaMinutos3 * 10);
        this.tiempoDeFarmingTotal3 = data;
        //Mostrar NFT
        this.existenciaNFT3 = true;
  
        if(isNaN(data)){
        this.unidadHora3= 0;
        this.decenaMinutos3 = 0;
        this.unidadMinutos3 = 0;
        this.existenciaNFT3 = false;
        }
      }
      );
    } );

    this.marketPlaceService.balanceDelFarming().then(data => this.balanceDelFarming = data / this.decimalesJuego );

    this.marketPlaceService.balanceDelToken().then(data => this.balanceDelToken = data / this.decimalesToken );

    this.marketPlaceService.balanceDelNFT().then(data => this.balanceDelNFT = data != null ? data : 0);

    this.marketPlaceService.propietarioNFT(1).then(data => {
        this.nftTotales1 = data != null ? data.cantidad :0; 
    });
    this.marketPlaceService.propietarioNFT(2).then(data => {
      this.nftTotales2 = data != null ? data.cantidad :0; 
    });
    this.marketPlaceService.propietarioNFT(3).then(data => {
      this.nftTotales3 = data != null ? data.cantidad :0; 
    });
}
  
  reclamarRecompensa(idCaja : number){
    this.marketPlaceService.reclamarRecompensa(idCaja).then(data =>   this.ngOnInit()    );
  }

  agregarIconDeadCakeToken() {
    this.marketPlaceService.agregarIconDeadCakeToken().then();
  }

  agregarIconDeadCakeFarming() {
    this.marketPlaceService.agregarIconDeadCakeFarming().then();
  }

  agregarIconDeadCakeNFT() {
    this.marketPlaceService.agregarIconDeadCakeNFT().then();
  }

  desactivarVideo(){
    this.video = true;
  }
  /*
  riempiModaleConId(idRiga:number){
      this.usersService.getUser(idRiga).subscribe((userById: User) => {
      this.singleUser = userById;
    }, err => {
      console.log(err);
    });
  }
  aprimodaleInfo(id:number){
    this.riempiModaleConId(id);
    this.openNTTmodal(this.modalUserInfo)
  }
  aprimodaleModifica(){;
      this.usersService.getUser(this.singleUser.id).subscribe((userById: User) => {
      this.userDaModificare = userById;
    }, err => {
      console.log(err);
    });
    this.openNTTmodal(this.modalUserModifica)
  }
  

  modificaUtente(){
    this.usersService.update(this.userDaModificare).subscribe(
      (res: User) =>{
        this.openNTTpopUp(this.modalConfermaUpdate)
        this.router.navigateByUrl('/interfell');
        this.stampaAll();
        setTimeout(() => {
          this.closebutton.nativeElement.click();
        }, 2000);
        this.router.navigateByUrl('/interfell');
      },
      err => {
        console.log(err);
      }
    );
  }

  openNTTpopUp(content:any) {
    this.modalService.open(content,{
      windowClass: 'modalePopUpNTTAngular',
      size:"sm",
      backdrop: 'static',
      centered: true
    })
  }

  openNTTmodal(content: any) {
    this.modalService.open(content,{
      windowClass: 'modaleNTTAngular',
      size:"lg",
      backdrop: 'static',
      centered: true 
    })
  }

  newUserModal(content: any) {
    this.newUser = new User();
    this.openNTTmodal(content);
  }

  insertUser(){
    this.usersService.insert(this.newUser).subscribe(
      (res: User) =>{
        this.openNTTpopUp(this.modalConfermaInsert)
          this.stampaAll();
      },
      err => {
        console.log(err);
      }
    );
  }

  closeAllModal(){
    this.modalService.dismissAll()
    this.stampaAll();
  }

  confermaEliminazione(){
    this.openNTTpopUp(this.modalRichiestaDelete)
  }
 
  eliminaDipendente(){
    this.usersService.deleteUserById(this.userDaModificare.id).subscribe(
      (risultato) => {
        if(risultato == true){
          this.openNTTpopUp(this.modalConfermaDelete)
        }
      },  
      (errore) => {
        console.log(errore);
      }  
    );
  }*/
}