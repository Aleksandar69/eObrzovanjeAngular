import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { faArrowCircleLeft, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profesor-administracija',
  templateUrl: './profesor-administracija.component.html',
  styleUrls: ['./profesor-administracija.component.css']
})
export class ProfesorAdministracijaComponent implements OnInit, OnDestroy {

  users:User[] = [];
  deleteId;
  deleteName:string;
  currentUser = {id:"", username:"", password:"", ime:"", prezime:"", adresa:"", role:"NASTAVNIK",jmbg:""};
  passwordRepeat:string;
  valid:boolean;
  isUpdate: boolean;
  originalUsername:string;
  activePage: number = 1;
  size: number = 5;
  pageCount = [];
  filterIme: string;
  filterPrezime: string;
  private subscriptions: Subscription[] = [];
  faArrowCircleLeft = faArrowCircleLeft;
  faSearch = faSearch;


  constructor(public userService : UserService,
    private snotify: SnotifyService) {
      this.getNastavnici();

  }


  getNastavnici(){
    this.subscriptions.push(
      this.userService.getNastavnici(this.activePage-1, this.size, this.filterIme, this.filterPrezime).subscribe(res => {
        console.log("total: " + res.headers.get('total'));
      this.pageCount = Array(parseInt(res.headers.get("total"))).fill(0).map((x,i)=>i);

      this.users = res.body;

      }));
  }

  changePage(page) {
    this.activePage = page;
    this.getNastavnici();
  }

  deleteProfessor(id, name){
    this.deleteId = id;
    this.deleteName = name;
  }

  deleteConfirm(){
        var deleteIndex: number;
        this.subscriptions.push(
        this.userService.deleteNastavnik(this.deleteId).subscribe(res => {
          this.users.forEach((element, index) => {
            if (this.deleteId == element.id){
              deleteIndex = index;
            }
          });
          this.users.splice(deleteIndex,1);
          this.notify("Profesor Uspesno Obrisan", "success");
        if (this.users.length == 0){
          if (this.activePage!=1){
            this.activePage = this.activePage - 1;
            }
            this.getNastavnici();
        }else{
          if (this.activePage < this.pageCount.length){
            this.getNastavnici();
          }
        }
        },
        (errorResponse: HttpErrorResponse) => {
          this.notify(errorResponse.error.message, "error");
        }));
    }

  ngOnInit() {

  }

  saveConfirm(){
   if (!this.isUpdate){
      this.save();
      }else{
      this.update();
    }
  }


  save(){
    this.subscriptions.push(
    this.userService.addUser2(this.currentUser).subscribe(x => {
        if (this.users.length == this.size){
          this.pageCount.push(this.pageCount.length+1);
          this.changePage(1);
      }
      this.notify("Profesor Uspesno Dodat", "success");
      this.users.push(x);
      this.reset();
      },
      (errorResponse: HttpErrorResponse) => {
        this.notify(errorResponse.error.message, "error");
      }));
  }

  isLetter(letter){
    let res = /^[a-zA-Z]+/;
    return res.test(letter);

  }

  isNumber(number){
    let res = /^\d+/;
    return res.test(number);
  }

  reset(){
    this.currentUser.id = null;
    this.currentUser.ime="";
    this.currentUser.adresa="";
    this.currentUser.prezime="";
    this.currentUser.password="";
    this.currentUser.username="";
    this.originalUsername="";
    this.passwordRepeat="";
    this.currentUser.jmbg="";
  }

  checkForUsername(){
    this.valid = true;
    this.subscriptions.push(
    this.userService.checkForUsername(this.currentUser.username).subscribe((res)=>{
      if (this.currentUser.username != this.originalUsername || this.originalUsername=="")
        this.valid=false;
      }, (err)=>{
        if (err.status == 302){
          if (this.currentUser.username != this.originalUsername || this.originalUsername=="")
            this.valid=false;
        }
      }));
    }

  addNastavnik(){
    this.reset();
    this.isUpdate = false;

  }

  update(){
    this.subscriptions.push(
    this.userService.updateUser(this.currentUser.id, this.currentUser).subscribe(x => {
    var index;
    for (let i =0; i<this.users.length; i++){
      if (this.users[i].id == x.id){
        this.users[i] = x;
        index = i;
        }
      }
    this.notify("Profesor Uspesno Izmenjen", "success");
    },
    (errorResponse: HttpErrorResponse) => {
      this.notify(errorResponse.error.message, "error");
    }));;

  }

  editProfessor(id, user){
    this.isUpdate = true;
    this.valid = true;
    this.currentUser.adresa = user.adresa;
    this.currentUser.id = user.id;
    this.currentUser.ime = user.ime;
    this.currentUser.prezime = user.prezime;
    this.currentUser.username = user.username;
    this.originalUsername = user.username;
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
