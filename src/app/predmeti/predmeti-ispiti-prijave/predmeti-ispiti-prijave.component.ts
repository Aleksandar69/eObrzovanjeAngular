import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { Subscription } from 'rxjs';
import { PrijavaService } from 'src/app/service/prijava.service';

@Component({
  selector: 'app-predmeti-ispiti-prijave',
  templateUrl: './predmeti-ispiti-prijave.component.html',
  styleUrls: ['./predmeti-ispiti-prijave.component.css']
})
export class PredmetiIspitiPrijaveComponent implements OnInit, OnDestroy {

  @Input() ispit: any;
  prijave: any[] = [];
  datePipe = new DatePipe("en-US");
  currentPrijava = {id:"", student: "" , osvojeniBodoviUsmeni:"", ispit:""};
  private subscriptions: Subscription[] = [];

  constructor(private prijavaService: PrijavaService, private snotify: SnotifyService) { }

  ngOnInit(): void {

    this.currentPrijava.ispit = this.ispit.id;
    this.subscriptions.push(
    this.prijavaService.getPrijaveByIspitId(this.ispit.id).subscribe(res => {
      res.forEach(element => element.datumPrijave = this.datePipe.transform(element.datumPrijave,"yyyy-MM-dd hh:mm:ss"));
      this.prijave = res;
    }));
  }


  reset(){
    this.currentPrijava.id="";
    this.currentPrijava.osvojeniBodoviUsmeni="";
    this.currentPrijava.student="";
  }

  oceniPrijavu(prijava){
    this.currentPrijava.id = prijava.id;
    this.currentPrijava.osvojeniBodoviUsmeni = prijava.osvojeniBodoviUsmeni;
    this.currentPrijava.student = prijava.student.id;
  }

  save(){
    this.subscriptions.push(
    this.prijavaService.updatePrijava(this.currentPrijava.id, this.currentPrijava).subscribe(res => {
      res.datumPrijave = this.datePipe.transform(res.datumPrijave,"yyyy-MM-dd hh:mm:ss");
      for (let i =0; i<this.prijave.length; i++){
        if (this.prijave[i].id == res.id){
          this.prijave[i] = res;
      }
    }
    this.notify("Ispit Uspesno Ocenjen", "success");
    },
    (errorResponse: HttpErrorResponse) => {
      this.notify(errorResponse.error.message, "error");
    }));
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
