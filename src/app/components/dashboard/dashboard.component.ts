import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public isCollapsed = false;
  public areaAmministrativa = false;
  constructor() { }

  ngOnInit(): void {
  }
  toogleAreaAmministrativa(){
    this.areaAmministrativa = !this.areaAmministrativa;
  }
}
