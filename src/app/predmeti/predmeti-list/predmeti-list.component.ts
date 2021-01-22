import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { PredmetService } from 'src/app/service/predmet.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-predmeti-list',
  templateUrl: './predmeti-list.component.html',
  styleUrls: ['./predmeti-list.component.css']
})
export class PredmetiListComponent implements OnInit, OnDestroy {

  predmeti:any[] = [];
  user: any;
  private subscriptions: Subscription[] = [];

  constructor(private predmetService: PredmetService, public auth: AuthenticationService, private userservice: UserService) { }

  ngOnInit(): void {

    this.user = this.auth.getUserFromLocalCache();

    if(this.user.role === "NASTAVNIK"){
      this.subscriptions.push(
       this.predmetService.getPredmetByNastavnikId(this.user.id).subscribe(res => this.predmeti = res));
    }
    else if(this.user.role === "STUDENT"){
      this.subscriptions.push(
       this.predmetService.getPredmetByStudentId(this.user.id).subscribe(res => this.predmeti = res));
    }
    else{
      this.subscriptions.push(
      this.predmetService.getPredmeti().subscribe(res => this.predmeti = res));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


}
