import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { PrijavaService } from 'src/app/service/prijava.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-prijave',
  templateUrl: './prijave.component.html',
  styleUrls: ['./prijave.component.css']
})
export class PrijaveComponent implements OnInit, OnDestroy {

  user: User;
  prijavljeniPredmeti: any[] = [];
  currentDate = new Date();
  odjavaId: any;
  private subscriptions: Subscription[] = [];



  constructor(private userService: UserService, private authService: AuthenticationService, private prijavaService: PrijavaService,
    private snotify: SnotifyService) { }

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalCache();
    this.subscriptions.push(
    this.userService.getByUsername(this.user.username).subscribe(user =>{
    this.user = user;
    this.getPrijave(this.user.id);
    }));
  }

  getPrijave(userId){
    this.subscriptions.push(
    this.prijavaService.getPrijaveByStudentId(userId).subscribe( prijave => {
      prijave.forEach(element => {
        console.log(element.datumPrijave);
        console.log(this.currentDate);
        if (element.osvojeniBodoviIspit>51 && element.polozio){
          element.ocena = Math.ceil(element.osvojeniBodoviIspit/10);
        }else{
          element.ocena = "N/A";
        }

      });
      this.prijavljeniPredmeti = prijave;
    }));
  }

  compareDates(prijavaDate){
    if (prijavaDate<this.currentDate){
      return true;
    }else{
      return false;
    }
  }

  odjavi(prijavaId){
    this.odjavaId = prijavaId;
  }

  confirmOdjava(){
    let deleteIndex = null;
    this.subscriptions.push(
    this.prijavaService.deletePrijava(this.odjavaId).subscribe(res =>{
      this.prijavljeniPredmeti.forEach((element, index) => {
        if (this.odjavaId == element.id){
          deleteIndex = index;
        }
      });
    this.prijavljeniPredmeti.splice(deleteIndex,1);
    },(errorResponse: HttpErrorResponse) => {
      this.notify(errorResponse.error.message, "error");
    }
    ));
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
