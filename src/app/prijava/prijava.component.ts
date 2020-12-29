import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { IspitService } from '../service/ispit.service';
import { PrijavaService } from '../service/prijava.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.css']
})
export class PrijavaComponent implements OnInit {


  dokumenti: any;
  user: any;
  ispitiZaPrijavu: any[] = [];
  prijava = { ispit: "", student:"", osvojeniBodoviUsmeni:"0"};
  currentPrijava: any;
  ispiti: any;
  datePipe = new DatePipe("en-US");

  constructor(public userDataService: UserService ,public auth: AuthenticationService, public prijavaService: PrijavaService, public ispitiService: IspitService) {
      this.user = this.auth.getUserFromLocalCache();
      this.userDataService.getByUsername(this.user.username).subscribe(user =>{
      this.user = user;
      this.ispitiService.getIspitiZaPrijavu(parseInt(user.id)).subscribe( i => {this.ispitiZaPrijavu = i; });
        });
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
    this.prijavaService.addPrijava(this.prijava).subscribe(res => {
      var deleteIndex;
      this.ispitiZaPrijavu.forEach((element, index) => {
        if (element.id == res.ispit.id){
          deleteIndex = index;
        }
        this.ispitiZaPrijavu.splice(deleteIndex,1);
      });
    });

  }

}
