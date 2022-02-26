
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UsersService } from '../../services/users.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user',
  templateUrl: './newOffering.component.html',
  styleUrls: ['./newOffering.component.css'],
  encapsulation: ViewEncapsulation.None, 
  
})

export class NewOfferingComponent implements OnInit {
  newUser:User = new User();
  users: User[] = [];
  userDaModificare: User= new User();
  singleUser: User = new User;

  @ViewChild('closebutton') closebutton: any;
  @ViewChild('modalUserInfo') modalUserInfo: any;
  @ViewChild('modalConfermaUpdate') modalConfermaUpdate: any;
  @ViewChild('modalRichiestaDelete') modalRichiestaDelete: any;
  @ViewChild('modalConfermaDelete') modalConfermaDelete: any;
  @ViewChild('modalConfermaInsert') modalConfermaInsert: any;
  @ViewChild('modalUserModifica') modalUserModifica: any;

  constructor(
    private usersService: UsersService,
    private router : Router,
    private modalService: NgbModal
   
    ) { }

  ngOnInit() {
    this.stampaAll();
  }
  
  stampaAll(){
    this.usersService.getUsers().subscribe((res: User[]) => { 
      this.users = res;
    }, err => {
      console.log(err);
    });

  }

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
  }
}