import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { IspitService } from 'src/app/service/ispit.service';
import { PredmetService } from 'src/app/service/predmet.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-predmeti-ispiti-list',
  templateUrl: './predmeti-ispiti-list.component.html',
  styleUrls: ['./predmeti-ispiti-list.component.css']
})
export class PredmetiIspitiListComponent implements OnInit {

  @Input() predmet: any;
  ispiti: any[] = [];
  datePipe = new DatePipe("en-US");
  user: any;


  constructor(private ispitService: IspitService, private authService: AuthenticationService, private userService: UserService) { }

  ngOnInit(): void {

    this.user = this.authService.getUserFromLocalCache();

    this.ispitService.getIspitByPredmetIdandNastavnikId(this.predmet.id, this.user.id).subscribe(res => {
      console.log(this.user.id + "tu je broj samo je debilcina");
        res.reverse();
        res.forEach(element => {
        element.datum = this.datePipe.transform(element.datum,"yyyy-MM-dd");
        element.rokZaPrijavu = this.datePipe.transform(element.rokZaPrijavu,"yyyy-MM-dd");
      });
      this.ispiti = res;
    });
    console.log( this.user.id + " tu je AAAAAAAAAAAAAAAA");

  }

}
