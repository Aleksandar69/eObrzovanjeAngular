import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { Subscription } from 'rxjs';
import { RegistracijaZahtev } from 'src/app/model/registracijaZahtev';
import { RegistracijaZahtevService } from 'src/app/service/registracija-zahtev.service';
import { UserService } from 'src/app/service/user.service';
import { faArrowCircleLeft, faSearch } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-registracija-zahtev-administracija',
  templateUrl: './registracija-zahtev-administracija.component.html',
  styleUrls: ['./registracija-zahtev-administracija.component.css']
})
export class RegistracijaZahtevAdministracijaComponent implements OnInit, OnDestroy {

  @Input() users:any[] = [];
  activePage: number = 1;
  size: number = 5;
  filterIme: string;
  filterPrezime: string;
  pageCount = [];
  currentUser = {id: null, username:"", password:"", ime:"", prezime:"", adresa:"", role:"STUDENT", brojIndexa: "", tekuciRacun: "", jmbg:"", odobren: false, brojTelefona: ""};
  userNameOriginal:string;
  odobriName: String;
  deleteIndex;
  deleteId;
  deleteName: String;
  private subscriptions: Subscription[] = [];
  faSearch = faSearch;


  constructor(private registracijaZahtevService: RegistracijaZahtevService, private userService: UserService,
    private snotify: SnotifyService) { }

  ngOnInit(): void {
    this.getZahtevi();
  }

  getZahtevi(){
    this.subscriptions.push(
    this.registracijaZahtevService.getNeodobreni(this.activePage-1, this.size, this.filterIme, this.filterPrezime).subscribe(
      res => {
        this.pageCount = Array(parseInt(res.headers.get("total"))).fill(0).map((x,i)=>i);
        if (this.pageCount.length == 0){
          this.pageCount.push(0);
        }
        this.users = res.body;
      }
    ));
  }


  onOdobri(user){
    this.currentUser.adresa = user.adresa;
    this.currentUser.id = user.id;
    this.currentUser.ime = user.ime;
    this.currentUser.prezime = user.prezime;
    this.currentUser.username = user.username;
    this.userNameOriginal = user.username;
    this.currentUser.tekuciRacun = user.tekuciRacun;
    this.currentUser.jmbg = user.jmbg;
    this.currentUser.brojIndexa = user.brojIndexa;
    this.currentUser.brojTelefona = user.brojTelefona;

    this.odobriName = user.ime;
  }




reset(){
  this.currentUser.ime="";
  this.currentUser.adresa="";
  this.currentUser.prezime="";
  this.currentUser.password="";
  this.currentUser.username="";
  this.userNameOriginal="";
  this.currentUser.brojIndexa = "";
  this.currentUser.tekuciRacun = "";
  this.currentUser.jmbg = "";
}

changePage(page) {
  this.activePage = page;
  this.getZahtevi();
}

deleteUser(user){
  this.deleteId = user.id;
  this.deleteName = user.username;
}

odobriConfirm(){
  this.currentUser.odobren = true;
  var deleteIndex: number;
  this.users.forEach((element, index) => {
    if (this.deleteId == element.id){
      deleteIndex = index;
    }
  });
  this.subscriptions.push(
  this.registracijaZahtevService.odobri(this.currentUser.id, this.currentUser).subscribe(x => {
    var index;
    this.users.splice(deleteIndex,1);
    for (let i =0; i<this.users.length; i++){
      if (this.users[i].id == x.id){
        this.users[i] = x;
        index = i;
        }
      }
    this.notify("Uspesno Odobren Zathev", "success");
},
(errorResponse: HttpErrorResponse) => {
  this.notify(errorResponse.error.message, "error");
}));
this.currentUser.id = null;
this.userService.addUser2(this.currentUser).subscribe(
  u => {
  }
);
// var deleteIndex: number;
//  this.users.forEach((user, index) => {
//     if(user.id == this.currentUser.id){
//       deleteIndex = index;
//   }
//   this.users.splice(deleteIndex, 1);
// });
}

deleteConfirm(){
  var deleteIndex: number;
  this.users.forEach((element, index) => {
    if (this.deleteId == element.id){
      deleteIndex = index;
    }
  },
  this.subscriptions.push(
  this.registracijaZahtevService.obrisi(this.deleteId).subscribe(
    (x)=>{
    this.notify("Uspesno Obrisan Zathev", "success");
    this.users.splice(deleteIndex,1);
    },
    (errorResponse: HttpErrorResponse) => {
      this.notify(errorResponse.error.message, "error");
    })
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
