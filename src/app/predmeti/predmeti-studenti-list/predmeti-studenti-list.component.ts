import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PredmetService } from 'src/app/service/predmet.service';

@Component({
  selector: 'app-predmeti-studenti-list',
  templateUrl: './predmeti-studenti-list.component.html',
  styleUrls: ['./predmeti-studenti-list.component.css']
})
export class PredmetiStudentiListComponent implements OnInit, OnDestroy {

  @Input() predmet: any;
  studenti: any[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private predmetService: PredmetService) { }

  ngOnInit(): void {
    this.subscriptions.push(
    this.predmetService.getStudenti(this.predmet.id).subscribe(res => this.studenti = res));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
