import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UplataService } from 'src/app/service/uplata.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-uplate',
  templateUrl: './uplate.component.html',
  styleUrls: ['./uplate.component.css']
})
export class UplateComponent implements OnInit, OnDestroy {

  user : User;
  uplate: any[];
  datePipe = new DatePipe("en-US");
  private subscriptions: Subscription[] = [];



  constructor(private uplateService: UplataService, private authService: AuthenticationService, private userService: UserService) { }

  ngOnInit(): void {

    this.user = this.authService.getUserFromLocalCache();
    this.subscriptions.push(
        this.userService.getByUsername(this.user.username).subscribe(user =>{
        this.user = user;
        this.getUplate(this.user.id);
    }));
  }


  getUplate(userId){
    this.subscriptions.push(
    this.uplateService.getUplateByStudentId(userId).subscribe( u => {
      this.uplate = u.body;
      this.uplate.forEach(element => {
        element.datumUplate = this.datePipe.transform(element.datumUplate, "yyyy-MM-dd");
      });
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
