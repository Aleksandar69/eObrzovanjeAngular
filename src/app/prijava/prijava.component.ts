import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { IspitService } from '../service/ispit.service';
import { PrijavaService } from '../service/prijava.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.css']
})
export class PrijavaComponent implements OnInit, OnDestroy {


  dokumenti: any;
  user: any;
  ispitiZaPrijavu: any[] = [];
  prijava = { ispit: "", student:"", osvojeniBodoviUsmeni:"0"};
  currentPrijava: any;
  ispiti: any;
  datePipe = new DatePipe("en-US");
  private subscriptions: Subscription[] = [];

  constructor(public userDataService: UserService ,public auth: AuthenticationService, public prijavaService: PrijavaService, public ispitiService: IspitService,
    private snotify: SnotifyService) {
      this.user = this.auth.getUserFromLocalCache();
      this.subscriptions.push(
      this.userDataService.getByUsername(this.user.username).subscribe(user =>{
      this.user = user;
      this.ispitiService.getIspitiZaPrijavu(parseInt(user.id)).subscribe( i => {this.ispitiZaPrijavu = i; });
        }));
  }

  ngOnInit() {
  }

  saveConfirm(){
      this.save();
  }

  addPrijava(prijavaIspit){
  this.prijava.ispit = prijavaIspit.id;
  this.prijava.student = this.user.id;
  this.prijava.osvojeniBodoviUsmeni = prijavaIspit.usmeniUkupnoBodova;
  }


  save(){
    this.subscriptions.push(
    this.prijavaService.addPrijava(this.prijava).subscribe(res => {
      var deleteIndex;
      this.ispitiZaPrijavu.forEach((element, index) => {
        if (element.id == res.ispit.id){
          deleteIndex = index;
        }
        this.notify("Prijavljivanje Ispita Uspesno", "success");
        this.ispitiZaPrijavu.splice(deleteIndex,1);
      });
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
