import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { Subscription } from 'rxjs';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { PrijavaService } from '../service/prijava.service';
import { UserService } from '../service/user.service';
import {ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  user: User;
  public users: User[];
  polozeni: any[];
  nepolozeni: any[];
  prijavljeniPredmeti:any[];
  uplate: any[];
  @Input()  uplata: any;
  @Input() predmet: any;
  @Input()  ispit: any;
  valid: boolean;
  dokumenti: any;
  currentDate = new Date();
  datePipe = new DatePipe("en-US");
  odjavaId: any;
  currentPassword = "";
  newPassword = "";
  confirmPassword = "";
  passwordConfirmation = false;
  public fileName: string;
  public profileImage: File;
  public fileStatus = {status:'', percentage: 0};
  updatedUser: User;


  // @Input() users:any[] = [];



  constructor(private cd : ChangeDetectorRef,public userService: UserService, private prijavaService: PrijavaService,  public authService: AuthenticationService, private router:Router,
    private snotify: SnotifyService) {}


  ngOnInit(): void {
    if (!this.authService.isUserLoggedIn()) {
      this.router.navigateByUrl('/login');
    }

    this.user = this.authService.getUserFromLocalCache();
    console.log(this.user.role);
    this.getPrijave(this.user.id);
    this.getPolozeniPredmeti(this.user.id);
    this.getNepolozeniPredmeti(this.user.id);
    this.getUplate(this.user.id);
    this.getDokumenti(this.user.id);

  }

  getDokument(){
    this.subscriptions.push(
    this.userService.getDokumentiByStudentId(1).subscribe(
      d =>{
        d.forEach(element => {
          element.datumDokumenta = this.datePipe.transform(element.datumDokumenta, "yyyy-MM-dd");
        });
        this.dokumenti = d
      }
    ));
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

  getPolozeniPredmeti(userId){
    this.subscriptions.push(
    this.userService.getPolozeniPredmeti(userId).subscribe( p => {
      p.forEach(element => {
        element.ocena = Math.ceil(element.osvojeniBodoviIspit/10);
      });
      this.polozeni = p;
      console.log("polozeni: ");
      console.log(...this.polozeni);
    }));
  }

  getNepolozeniPredmeti(userId){
    this.userService.getNepolozeniPredmeti(userId).subscribe( n => {this.nepolozeni = n; });
  }


  getUplate(userId){
    this.subscriptions.push(
    this.userService.getUplateByStudentId(userId).subscribe( u => {
      this.uplate = u.body;
      this.uplate.forEach(element => {
        element.datumUplate = this.datePipe.transform(element.datumUplate, "yyyy-MM-dd");
      });
    }
    ));
  }

  getDokumenti(userId){
    this.subscriptions.push(
    this.userService.getDokumentiByStudentId(userId).subscribe( d => {
      d.forEach(element => {
        element.datumDokumenta = this.datePipe.transform(element.datumDokumenta, "yyyy-MM-dd");
      });
      this.dokumenti = d; }));
  }

  changePassword(){
    this.subscriptions.push(
    this.userService.updatePassword(this.currentPassword,this.newPassword, this.user.username).subscribe(res => {
      this.authService.logOut();
      this.router.navigateByUrl('/login');
      this.notify("Lozinka Uspesno Promenjena", "success");
    },
    (errorResponse: HttpErrorResponse) => {
      this.notify(errorResponse.error.message, "error");
    }));
  }

  izmenaBroja(user: User){
    this.valid = true;
    this.user.brojTelefona = user.brojTelefona;
  }

  posaljiIzmenuBroja(){

    this.subscriptions.push(
    this.userService.changePhoneNumber(this.user.id, this.user).subscribe(x => {
      this.addUserToCache(this.user.id);
    },(errorResponse: HttpErrorResponse) => {
      this.notify(errorResponse.error.message, "error");
    }
    ));
  }

  compareDates(prijavaDate){
    if (prijavaDate<this.currentDate){
      return true;
    }else{
      return false;
    }
  }

  private addUserToCache(id: number){
    this.userService.getUser(id).subscribe(
      response =>{
      this.authService.addUserToLocalCache(response);
      this.user = this.authService.getUserFromLocalCache();
      }
    )
  }

  public onUpdateProfileImage(): void {
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('profileImage', this.profileImage);
    this.subscriptions.push(
      this.userService.updateProfileImage(formData).subscribe(
        (event: HttpEvent<any>) => {
          this.addUserToCache(this.user.id);
          this.reportUploadProgress(event);
          this.cd.detectChanges();
        },
        (errorResponse: HttpErrorResponse) => {
          this.notify(errorResponse.error.message, "error");
          this.fileStatus.status = 'done';
        }
      )
    );

     setTimeout(
       function() {
      location.reload();
      }, 500
    )
  }

  private reportUploadProgress(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.fileStatus.percentage = Math.round(100 * event.loaded / event.total);
        this.fileStatus.status = 'progress';
        break;
      case HttpEventType.Response:
        if (event.status === 200) {
          this.user.profileImageUrl = `${event.body.profileImageUrl}?time=${new Date().getTime()}`;
          this.notify(`image uploaded for ${event.body.ime}` , "success");
          this.fileStatus.status = 'done';
          break;
        } else {
          this.notify("Unable to upload image", "error");
          break;
        }
      default:
        `Finished all processes`;
    }
  }

  public updateProfileImage(): void {
    this.clickButton('profile-image-input');
  }

  private clickButton(buttonId: string): void {
    document.getElementById(buttonId).click();
  }

  public onProfileImageChange(file: any): void {
    this.fileName = file.target.files[0].name;
    this.profileImage = file.target.files[0];
    // this.fileName = fileName;
    // this.profileImage = profileImage;
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
