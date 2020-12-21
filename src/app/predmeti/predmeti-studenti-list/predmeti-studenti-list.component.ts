import { Component, Input, OnInit } from '@angular/core';
import { PredmetService } from 'src/app/service/predmet.service';

@Component({
  selector: 'app-predmeti-studenti-list',
  templateUrl: './predmeti-studenti-list.component.html',
  styleUrls: ['./predmeti-studenti-list.component.css']
})
export class PredmetiStudentiListComponent implements OnInit {

  @Input() predmet: any;
  studenti: any[] = [];


  constructor(private predmetService: PredmetService) { }

  ngOnInit(): void {
    this.predmetService.getStudenti(this.predmet.id).subscribe(res => this.studenti = res);
  }

}
