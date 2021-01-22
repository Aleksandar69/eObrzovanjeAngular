import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { DokumentService } from 'src/app/service/dokument.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-dokumenti',
  templateUrl: './dokumenti.component.html',
  styleUrls: ['./dokumenti.component.css']
})
export class DokumentiComponent implements OnInit, OnDestroy {

  dokumenti: any[] = [];
  datePipe = new DatePipe("en-US");
  user: User;
  private subscriptions: Subscription[] = [];


  constructor(private dokumentiService: DokumentService, private userService: UserService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalCache();
    this.subscriptions.push(
        this.userService.getByUsername(this.user.username).subscribe(user =>{
        this.user = user;
        this.getDokumenti(this.user.id);
  }));
}

  getDokumenti(userId){
    this.subscriptions.push(
    this.userService.getDokumentiByStudentId(userId).subscribe( d => {
      d.forEach(element => {
        element.datumDokumenta = this.datePipe.transform(element.datumDokumenta, "yyyy-MM-dd");
      });
      this.dokumenti = d; }));
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
