import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  currentUser: User;

  constructor(public authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserFromLocalCache();
  }

  ngLogout(){
    this.authService.logOut();
    this.router.navigateByUrl("/login");
  }

}
