import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { Subscription } from 'rxjs';
import { IspitService } from 'src/app/service/ispit.service';
import { PredmetService } from 'src/app/service/predmet.service';

@Component({
  selector: 'app-ispiti-administracija',
  templateUrl: './ispiti-administracija.component.html',
  styleUrls: ['./ispiti-administracija.component.css']
})
export class IspitiAdministracijaComponent implements OnInit, OnDestroy {

  @Input() predmetId:any;
  currentIspit = { id:"", predmet:" ", nastavnik:"",datum: "" ,rokZaPrijavu:"", usmeniUkupnoBodova:"", usmeniMinimumBodova:""};
  ispiti : any[] = [];
  deleteId:number;
  deleteName:string;
  isUpdate: boolean;
  firstDate= new Date();
  touched = false;
  predmetNastavnici= [];
  datePipe = new DatePipe("en-US");
  activePage: number = 1;
  size: number = 5;
  pageCount = [];
  private subscriptions: Subscription[] = [];

  constructor(public ispitService: IspitService, public predmetService: PredmetService, private snotify: SnotifyService) {
  }


  ngOnInit(): void {
    this.getIspiti();
  }

  changePage(page) {
    this.activePage = page;
    this.getIspiti();
  }

  getIspiti(){
    this.currentIspit.predmet = this.predmetId;
    this.subscriptions.push(
    this.predmetService.getNastavnici(this.predmetId).subscribe(res => this.predmetNastavnici = res));
    this.subscriptions.push(
    this.ispitService.getIspitbyPredmetIdPages(this.predmetId, this.activePage-1, this.size).subscribe(res => {
      this.pageCount = Array(parseInt(res.headers.get("total"))).fill(0).map((x,i)=>i);
      if (this.pageCount.length == 0){
        this.pageCount.push(0);
      }
      this.ispiti = res.body;
      this.ispiti.forEach(element => {
        element.datum = this.datePipe.transform(element.datum,"yyyy-MM-dd");
        element.rokZaPrijavu = this.datePipe.transform(element.rokZaPrijavu,"yyyy-MM-dd");
      });
    },
    (errorResponse: HttpErrorResponse) => {
      this.notify(errorResponse.error.message, "error");
    }
    )
    );
  }

  deleteIspit(id){
    this.deleteId = id;
  }

  deleteConfirm(){
    var deleteIndex: number;
    this.subscriptions.push(
    this.ispitService.deleteIspit(this.deleteId).subscribe(res => {
    this.ispiti.forEach((element, index) => {
        if (this.deleteId == element.id){
          deleteIndex = index;
        }
      });
    this.ispiti.splice(deleteIndex,1);
    this.notify("Uspesno Obrisan Ispit", "success");
    if (this.ispiti.length == 0){
      if (this.activePage!=1){
        this.activePage = this.activePage - 1;
        }
        this.getIspiti();
    }else{
      if (this.activePage < this.pageCount.length){
        this.getIspiti();
      }
      }
    },
    (errorResponse: HttpErrorResponse) => {
      this.notify(errorResponse.error.message, "error");
    }
    )
    );
  }

  saveConfirm(){
    if (!this.isUpdate){
       this.create();
       }else{
       this.update();
     }
   }


  reset(){
    this.currentIspit.id="";
    this.currentIspit.nastavnik="";
    this.currentIspit.datum="";
    this.currentIspit.usmeniUkupnoBodova="";
    this.currentIspit.usmeniMinimumBodova="";
    this.currentIspit.rokZaPrijavu="";
  }

  addIspit(){
    this.isUpdate = false;
    this.reset();
  }

  create(){
    this.subscriptions.push(
    this.ispitService.addIspit(this.predmetId, this.currentIspit).subscribe(res => {
      res.datum = this.datePipe.transform(res.datum,"yyyy-MM-dd");
      res.rokZaPrijavu = this.datePipe.transform(res.rokZaPrijavu,"yyyy-MM-dd");
      this.notify("Uspesno Dodat Ispit", "success");
      this.ispiti.push(res);
    },
    (errorResponse: HttpErrorResponse) => {
      this.notify(errorResponse.error.message, "error");
    })
    );
  }

  update(){
    this.subscriptions.push(
    this.ispitService.updateIspit(this.currentIspit.id, this.currentIspit).subscribe(x => {
      x.datum = this.datePipe.transform(x.datum,"yyyy-MM-dd");
      x.rokZaPrijavu = this.datePipe.transform(x.rokZaPrijavu,"yyyy-MM-dd");
      this.notify("Uspesno Izmenjen Ispit", "success");
      for (let i =0; i<this.ispiti.length; i++){
        if (this.ispiti[i].id == x.id){
          this.ispiti[i] = x;
      }
    }
  },
  (errorResponse: HttpErrorResponse) => {
    this.notify(errorResponse.error.message, "error");
  })
    );
  }

  editIspit(ispit){
    this.isUpdate = true;
    this.currentIspit.id = ispit.id;
    this.currentIspit.rokZaPrijavu = ispit.rokZaPrijavu;
    this.currentIspit.datum = ispit.datum;
    this.currentIspit.usmeniMinimumBodova = ispit.usmeniMinimumBodova;
    this.currentIspit.usmeniUkupnoBodova = ispit.usmeniUkupnoBodova;
    this.currentIspit.nastavnik = ispit.nastavnik.id;
  }

  change(event){
    if (!this.touched) this.touched = true;
  }


  notify(message: string, type: string){
    if(type==="error"){
    this.snotify.error(message,
      {
        timeout: 2000,
        showProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true
      });
    }
    else if(type=="success"){
      this.snotify.success(message,
        {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true
        });
      }
    else if(type=="info"){
      this.snotify.info(message,
        {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true
        });
      }
    else if(type=="warning"){
      this.snotify.warning(message,
        {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true
        });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
