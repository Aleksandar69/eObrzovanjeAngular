import { Component, Input, OnInit } from '@angular/core';
import { RegistracijaZahtev } from 'src/app/model/registracijaZahtev';
import { RegistracijaZahtevService } from 'src/app/service/registracija-zahtev.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-registracija-zahtev-administracija',
  templateUrl: './registracija-zahtev-administracija.component.html',
  styleUrls: ['./registracija-zahtev-administracija.component.css']
})
export class RegistracijaZahtevAdministracijaComponent implements OnInit {

  @Input() users:any[] = [];
  activePage: number = 1;
  size: number = 5;
  filterIme: string;
  filterPrezime: string;
  pageCount = [];
  currentUser = {id: null, username:"", password:"", ime:"", prezime:"", adresa:"", role:"STUDENT", brojIndexa: "", tekuciRacun: "", jmbg:"", odobren: false};
  userNameOriginal:string;
  odobriName: String;



  constructor(private registracijaZahtevService: RegistracijaZahtevService, private userService: UserService, ) { }

  ngOnInit(): void {
    this.getZahtevi();
  }

  getZahtevi(){
    this.registracijaZahtevService.getNeodobreni(this.activePage-1, this.size, this.filterIme, this.filterPrezime).subscribe(
      res => {
        this.pageCount = Array(parseInt(res.headers.get("total"))).fill(0).map((x,i)=>i);
        if (this.pageCount.length == 0){
          this.pageCount.push(0);
        }
        this.users = res.body;
      }
    )
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

    this.odobriName = user.ime;
  }

  odobriConfirm(){

    this.currentUser.odobren = true;

    this.registracijaZahtevService.odobri(this.currentUser.id, this.currentUser).subscribe(x => {
      var index;
      for (let i =0; i<this.users.length; i++){
        if (this.users[i].id == x.id){
          this.users[i] = x;
          index = i;
          }
        }
  });

  this.currentUser.id = null;
  this.userService.addUser2(this.currentUser).subscribe(
    u => {
      console.log(u);
    }
  );

  this.users.splice(this.currentUser.id, 1);
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

}
