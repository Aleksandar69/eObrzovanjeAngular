import { Component, Input, OnInit } from '@angular/core';
import { UplataService } from 'src/app/service/uplata.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-uplate-administracija',
  templateUrl: './uplate-administracija.component.html',
  styleUrls: ['./uplate-administracija.component.css']
})
export class UplateAdministracijaComponent implements OnInit {

  @Input() userId: any;
  @Input() racunPrimaoca: any;
  uplate: any[] = [];
  activePage: number = 1;
  size: number = 5;
  pageCount = [];
  currentUplata = { datumUplate: Date,  iznosUplate:"", racunPrimaoca:"", svrhaUplate:"", pozivNaBroj:""}
  // showDokumenti: boolean = false;
  // showUplate: boolean = false;

    constructor(public uplateDataService: UplataService) {

     }

    ngOnInit() {
      this.getUplate();
    }

    getUplate(){
      this.uplateDataService.getUplateByStudentId(this.userId, this.activePage-1, this.size).subscribe(res => {
        this.uplate = res.body;
        this.pageCount = Array(parseInt(res.headers.get("total"))).fill(0).map((x,i)=>i);
        if (this.pageCount.length == 0){
        this.pageCount.push(0);
        }
      });
    }

    changePage(page) {
      this.activePage = page;
      this.getUplate();
    }

  save(){
    this.uplateDataService.addUplata(this.currentUplata).subscribe(x => {
        this.uplate.push(x);
        this.reset();
      });
  }

  reset(){
    this.currentUplata.iznosUplate="";
    this.currentUplata.racunPrimaoca="";
    this.currentUplata.svrhaUplate="";
    this.currentUplata.pozivNaBroj="";
  }

  addUplata(){
    this.reset();
    this.currentUplata.racunPrimaoca = this.racunPrimaoca;
  }


}
