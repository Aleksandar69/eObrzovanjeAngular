import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-nepolozeni',
  templateUrl: './nepolozeni.component.html',
  styleUrls: ['./nepolozeni.component.css']
})
export class NepolozeniComponent implements OnInit {

  user : User;
  nepolozeni: any[];

  constructor(private userService: UserService, private authService: AuthenticationService) {  }

  ngOnInit(): void {

    this.user = this.authService.getUserFromLocalCache();
    this.userService.getByUsername(this.user.username).subscribe(user =>{
    this.user = user;
    this.getNepolozeniPredmeti(this.user.id);
    })

  }

  getNepolozeniPredmeti(userId){
    this.userService.getNepolozeniPredmeti(userId).subscribe( n => {this.nepolozeni = n; });
  }

}
