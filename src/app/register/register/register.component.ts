import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { Subscription } from 'rxjs';
import { Student } from 'src/app/model/student';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import {RegistracijaZahtev} from 'src/app/model/registracijaZahtev'
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {


  public showLoading: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private authenticationService: AuthenticationService,
    private snotify: SnotifyService) {}



  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    }
  }


  public onRegister(registracijaZahtev: RegistracijaZahtev): void {
    this.showLoading = true;
    registracijaZahtev.stanje = 0;
    this.subscriptions.push(
      this.authenticationService.register(registracijaZahtev).subscribe(
        (response: RegistracijaZahtev) => {
          this.showLoading = false;
          this.snotify.success(`Zahtev za pravljenje novog naloga je poslan za korisnika: ${response.ime}.`,
            {
              timeout: 2000,
              showProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true
            });
      },
      (errorResponse: HttpErrorResponse) => {
        this.notify(errorResponse.error.message, "error");
        this.showLoading = false;
      }
      )
    );
  }


  isLetter(letter){
    let res = /^[a-zA-Z]+/;
    return res.test(letter);

  }

  isNumber(number){
    let res = /^\d+/;
    return res.test(number);
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
