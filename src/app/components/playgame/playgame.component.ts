
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

  constructor(private marketPlaceService : MarketPlaceService,private router : Router) { }


  ngOnInit() {
    this.marketPlaceService.superadoTiempoDeFarming(1).then(data => this.superadoTiempoFarming1 = data );
    this.marketPlaceService.superadoTiempoDeFarming(2).then(data => this.superadoTiempoFarming2 = data );
    this.marketPlaceService.superadoTiempoDeFarming(3).then(data => this.superadoTiempoFarming3 = data );

    this.marketPlaceService.recompensaAcumulada(1).then(data => this.recompensaAcumulada1 = data );
    this.marketPlaceService.recompensaAcumulada(2).then(data => this.recompensaAcumulada2 = data );
    this.marketPlaceService.recompensaAcumulada(3).then(data => this.recompensaAcumulada3 = data );

    this.marketPlaceService.tiempoDeFarmingTotal(1).then(data => this.tiempoDeFarmingTotal1 = data );
    this.marketPlaceService.tiempoDeFarmingTotal(2).then(data => this.tiempoDeFarmingTotal2 = data );
    this.marketPlaceService.tiempoDeFarmingTotal(3).then(data => this.tiempoDeFarmingTotal3 = data );

    this.marketPlaceService.balanceDelFarming().then(data => this.balanceDelFarming = data / this.decimalesJuego );

    this.marketPlaceService.balanceDelToken().then(data => this.balanceDelToken = data / this.decimalesToken );

    this.marketPlaceService.propietarioNFT().then(data => {
      this.nftTotales1 = data.caja1; 
      this.nftTotales2 = data.caja2;
      this.nftTotales3 = data.caja3;
    });
  }
  
  reclamarRecompensa(idCaja : number){
    this.marketPlaceService.reclamarRecompensa(idCaja).then(data =>   this.ngOnInit()    );
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