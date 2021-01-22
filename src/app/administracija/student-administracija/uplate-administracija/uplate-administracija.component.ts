import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { Subscription } from 'rxjs';
import { UplataService } from 'src/app/service/uplata.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-uplate-administracija',
  templateUrl: './uplate-administracija.component.html',
  styleUrls: ['./uplate-administracija.component.css']
})
export class UplateAdministracijaComponent implements OnInit, OnDestroy {

  @Input() userId: any;
  @Input() racunPrimaoca: any;
  uplate: any[] = [];
  activePage: number = 1;
  size: number = 5;
  pageCount = [];
  currentUplata = { datumUplate: Date,  iznosUplate:"", racunPrimaoca:"", svrhaUplate:"", pozivNaBroj:""}
  // showDokumenti: boolean = false;
  // showUplate: boolean = false;
  private subscriptions: Subscription[] = [];


    constructor(public uplateDataService: UplataService,
      private snotify: SnotifyService) {

     }

    ngOnInit() {
      this.getUplate();
    }

    getUplate(){
      this.subscriptions.push(
      this.uplateDataService.getUplateByStudentId(this.userId, this.activePage-1, this.size).subscribe(res => {
        this.uplate = res.body;
        this.pageCount = Array(parseInt(res.headers.get("total"))).fill(0).map((x,i)=>i);
        if (this.pageCount.length == 0){
        this.pageCount.push(0);
        }
      }));
    }

    changePage(page) {
      this.activePage = page;
      this.getUplate();
    }

  save(){
    this.subscriptions.push(
    this.uplateDataService.addUplata(this.currentUplata).subscribe(x => {
        this.uplate.push(x);
        this.reset();
        this.notify("Uplata Uspesno Dodata", "success");
      },
      (errorResponse: HttpErrorResponse) => {
        this.notify(errorResponse.error.message, "error");
      }));
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
