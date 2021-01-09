import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PrijavaService } from 'src/app/service/prijava.service';

@Component({
  selector: 'app-predmeti-ispiti-prijave',
  templateUrl: './predmeti-ispiti-prijave.component.html',
  styleUrls: ['./predmeti-ispiti-prijave.component.css']
})
export class PredmetiIspitiPrijaveComponent implements OnInit {

  @Input() ispit: any;
  prijave: any[] = [];
  datePipe = new DatePipe("en-US");
  currentPrijava = {id:"", student: "" , osvojeniBodoviUsmeni:"", ispit:""};

  constructor(private prijavaService: PrijavaService) { }

  ngOnInit(): void {

    this.currentPrijava.ispit = this.ispit.id;
    this.prijavaService.getPrijaveByIspitId(this.ispit.id).subscribe(res => {
      res.forEach(element => element.datumPrijave = this.datePipe.transform(element.datumPrijave,"yyyy-MM-dd hh:mm:ss"));
      this.prijave = res;
    })
  }


  reset(){
    this.currentPrijava.id="";
    this.currentPrijava.osvojeniBodoviUsmeni="";
    this.currentPrijava.student="";
  }

  oceniPrijavu(prijava){
    this.currentPrijava.id = prijava.id;
    this.currentPrijava.osvojeniBodoviUsmeni = prijava.osvojeniBodoviUsmeni;
    this.currentPrijava.student = prijava.student.id;
  }

  save(){
    this.prijavaService.updatePrijava(this.currentPrijava.id, this.currentPrijava).subscribe(res => {
      res.datumPrijave = this.datePipe.transform(res.datumPrijave,"yyyy-MM-dd hh:mm:ss");
      for (let i =0; i<this.prijave.length; i++){
        if (this.prijave[i].id == res.id){
          this.prijave[i] = res;
      }
    }
    })
  }

}
