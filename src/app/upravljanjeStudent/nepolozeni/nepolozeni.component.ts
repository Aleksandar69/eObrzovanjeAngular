import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-nepolozeni',
  templateUrl: './nepolozeni.component.html',
  styleUrls: ['./nepolozeni.component.css']
})
export class NepolozeniComponent implements OnInit, OnDestroy {

  user : User;
  nepolozeni: any[];
  private subscriptions: Subscription[] = [];


  constructor(private userService: UserService, private authService: AuthenticationService) {  }

  ngOnInit(): void {

    this.user = this.authService.getUserFromLocalCache();
    this.subscriptions.push(
    this.userService.getByUsername(this.user.username).subscribe(user =>{
    this.user = user;
    this.getNepolozeniPredmeti(this.user.id);
    }));
  }

  getNepolozeniPredmeti(userId){
    this.subscriptions.push(
    this.userService.getNepolozeniPredmeti(userId).subscribe( n => {this.nepolozeni = n; }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
