import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';
import { PrijavaService } from '../service/prijava.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  user: User;
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

  // @Input() users:any[] = [];



  constructor(public userService: UserService, private prijavaService: PrijavaService,  public authService: AuthenticationService, private router:Router) {}


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


    // this.getUsers2();
    // this.getUsers();
  }

  getDokument(){
    this.userService.getDokumentiByStudentId(1).subscribe(
      d =>{
        d.forEach(element => {
          element.datumDokumenta = this.datePipe.transform(element.datumDokumenta, "yyyy-MM-dd");
        });
        this.dokumenti = d
      }
    );
  }


  getPrijave(userId){
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
    });
  }

  getPolozeniPredmeti(userId){
    this.userService.getPolozeniPredmeti(userId).subscribe( p => {
      p.forEach(element => {
        element.ocena = Math.ceil(element.osvojeniBodoviIspit/10);
      });
      this.polozeni = p;
      console.log("polozeni: ");
      console.log(...this.polozeni);
    });
  }

  getNepolozeniPredmeti(userId){
    this.userService.getNepolozeniPredmeti(userId).subscribe( n => {this.nepolozeni = n; });
  }


  getUplate(userId){
    this.userService.getUplateByStudentId(userId).subscribe( u => {
      this.uplate = u.body;
      this.uplate.forEach(element => {
        element.datumUplate = this.datePipe.transform(element.datumUplate, "yyyy-MM-dd");
      });
    }
    );
  }

  getDokumenti(userId){
    this.userService.getDokumentiByStudentId(userId).subscribe( d => {
      d.forEach(element => {
        element.datumDokumenta = this.datePipe.transform(element.datumDokumenta, "yyyy-MM-dd");
      });
      this.dokumenti = d; });
  }

  changePassword(){}

  izmenaBroja(user: User){}

  posaljiIzmenuBroja(){}

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

  confirmOdjava(){}

    // getUsers(){
  //   this.userService.getUsers().subscribe(
  //     (response) =>
  //     {
  //       this.userService.addUsersToLocalCache(response);
  //       this.users = response;

  //      }
  //    )
  //  }

  // getUsers2(){
  //   this.userService.getUsers2().subscribe(
  //     (response) =>
  //     {
  //       this.users = response.body;

  //     }
  //   )
  // }


}
