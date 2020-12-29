import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { PrijavaService } from 'src/app/service/prijava.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-prijave',
  templateUrl: './prijave.component.html',
  styleUrls: ['./prijave.component.css']
})
export class PrijaveComponent implements OnInit {

  user: User;
  prijavljeniPredmeti: any[] = [];
  currentDate = new Date();
  odjavaId: any;


  constructor(private userService: UserService, private authService: AuthenticationService, private prijavaService: PrijavaService) { }

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalCache();
    this.userService.getByUsername(this.user.username).subscribe(user =>{
    this.user = user;
    this.getPrijave(this.user.id);
    })
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
  }


}
