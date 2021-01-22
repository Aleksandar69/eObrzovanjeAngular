import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-polozeni',
  templateUrl: './polozeni.component.html',
  styleUrls: ['./polozeni.component.css']
})
export class PolozeniComponent implements OnInit, OnDestroy {

  user : User;
  polozeni: any[];
  private subscriptions: Subscription[] = [];


  constructor(private userService: UserService, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalCache();
    this.subscriptions.push(
    this.userService.getByUsername(this.user.username).subscribe(user =>{
    this.user = user;
    this.getPolozeniPredmeti(this.user.id);
    }));
  }

  getPolozeniPredmeti(userId){
    this.subscriptions.push(
    this.userService.getPolozeniPredmeti(userId).subscribe( p => {
      p.forEach(element => {
        element.ocena = Math.ceil(element.osvojeniBodoviIspit/10);
      });
      this.polozeni = p;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
