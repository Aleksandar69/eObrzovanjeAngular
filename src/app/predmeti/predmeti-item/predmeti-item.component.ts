import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-predmeti-item',
  templateUrl: './predmeti-item.component.html',
  styleUrls: ['./predmeti-item.component.css']
})
export class PredmetiItemComponent implements OnInit {

  showStudenti = false;
  showIspiti = false;
  @Input() predmet = { id:"1", naziv:"Osnove racunarstva", oznaka:"OR1",espb:"7"};

  constructor() { }

  ngOnInit(): void {
  }

}
