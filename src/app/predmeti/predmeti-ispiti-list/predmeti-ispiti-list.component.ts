import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { IspitService } from 'src/app/service/ispit.service';
import { PredmetService } from 'src/app/service/predmet.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-predmeti-ispiti-list',
  templateUrl: './predmeti-ispiti-list.component.html',
  styleUrls: ['./predmeti-ispiti-list.component.css']
})
export class PredmetiIspitiListComponent implements OnInit, OnDestroy {

  @Input() predmet: any;
  ispiti: any[] = [];
  datePipe = new DatePipe("en-US");
  user: User;
  private subscriptions: Subscription[] = [];


  constructor(private ispitService: IspitService, private authService: AuthenticationService, private userService: UserService) { }

  ngOnInit(): void {

    this.user = this.authService.getUserFromLocalCache();

    if (this.user.role == "NASTAVNIK") {
      this.subscriptions.push(
      this.ispitService.getIspitByPredmetIdandNastavnikId(this.predmet.id, this.user.id).subscribe(res => {
        res.reverse();
        res.forEach(element => {
          element.datum = this.datePipe.transform(element.datum, "yyyy-MM-dd");
          element.rokZaPrijavu = this.datePipe.transform(element.rokZaPrijavu, "yyyy-MM-dd");
        });
        this.ispiti = res;
      }));
    }
    else {
      this.subscriptions.push(
      this.ispitService.getIspitByPredmetId(this.predmet.id).subscribe(res => {
        res.reverse();
        res.forEach(element => {
          element.datum = this.datePipe.transform(element.datum, "yyyy-MM-dd");
          element.rokZaPrijavu = this.datePipe.transform(element.rokZaPrijavu, "yyyy-MM-dd");
        });
        this.ispiti = res;
      }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
