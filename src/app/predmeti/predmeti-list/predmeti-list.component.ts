import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { PredmetService } from 'src/app/service/predmet.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-predmeti-list',
  templateUrl: './predmeti-list.component.html',
  styleUrls: ['./predmeti-list.component.css']
})
export class PredmetiListComponent implements OnInit {

  predmeti:any[] = [];
  user: any;

  constructor(private predmetService: PredmetService, public auth: AuthenticationService, private userservice: UserService) { }

  ngOnInit(): void {

    this.user = this.auth.getUserFromLocalCache();

    if(this.user.role === "NASTAVNIK"){
       this.predmetService.getPredmetByNastavnikId(this.user.id).subscribe(res => this.predmeti = res);
    }
    else if(this.user.role === "STUDENT"){
       this.predmetService.getPredmetByStudentId(this.user.id).subscribe(res => this.predmeti = res);
    }
    else{

      this.predmetService.getPredmeti().subscribe(res => this.predmeti = res);
    }

  }

}
