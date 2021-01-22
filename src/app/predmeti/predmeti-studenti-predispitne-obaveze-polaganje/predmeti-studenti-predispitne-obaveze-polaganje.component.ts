import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PredispitneObavezeService } from 'src/app/service/predispitne-obaveze-service.service';
import { PredispitneObavezePolaganjeServiceService } from 'src/app/service/predispitne-obaveze-polaganje-service.service';
import { SnotifyService } from 'ng-snotify';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-predmeti-studenti-predispitne-obaveze-polaganje',
  templateUrl: './predmeti-studenti-predispitne-obaveze-polaganje.component.html',
  styleUrls: ['./predmeti-studenti-predispitne-obaveze-polaganje.component.css']
})
export class PredmetiStudentiPredispitneObavezePolaganjeComponent implements OnInit {

  @Input() student: any;
  @Input() predmet: any;
  currentPredispitnaObaveza = {osvojeniBodovi:" ", student: "" , sablon:"", predmet: ""};
  predmetPredispitneObaveze: any[];
  studentPredispitneObaveze: any[];
  datePipe = new DatePipe("en-US");
  private subscriptions: Subscription[] = [];

  constructor(public sablonService: PredispitneObavezeService, public predispitneObavezeService: PredispitneObavezePolaganjeServiceService,
    private snotify: SnotifyService) { }

  ngOnInit(): void {
    this.currentPredispitnaObaveza.student = this.student.id;
    this.currentPredispitnaObaveza.predmet = this.predmet.id;
    this.subscriptions.push(
    this.sablonService.getSabloniByPredmetId(this.predmet.id).subscribe(resPredmet => {
      this.predispitneObavezeService.getPredispitneObavezeByStudentIdandPredmetId(this.student.id, this.predmet.id).subscribe(resStudent => {
        this.studentPredispitneObaveze= resStudent;
        for (var i = 0; i< resPredmet.length; i++){
          var found = false;
          resStudent.forEach(elementStudent =>{
            if (resPredmet[i].id == elementStudent.sablon.id){
              elementStudent.datum = this.datePipe.transform(elementStudent.datum,"yyyy/MM/dd");
              resPredmet[i] = elementStudent;
              found = true;
            }
          })
          if (!found){
            resPredmet[i].sablon = resPredmet[i];
            resPredmet[i].osvojeniBodovi = 0;
            resPredmet[i].datum = "N/A"
          }
        };
        this.predmetPredispitneObaveze = resPredmet;
      });
    }));
  }

  reset(){
    this.currentPredispitnaObaveza.osvojeniBodovi = "";
    this.currentPredispitnaObaveza.sablon = "";
  }

  addPredispitnaObaveza(id){
    this.currentPredispitnaObaveza.sablon = id;
  }

  save(){
    this.subscriptions.push(
    this.predispitneObavezeService.addPredispitnaObaveza(this.currentPredispitnaObaveza).subscribe(res => {
      res.datum = this.datePipe.transform(res.datum,"yyyy/MM/dd");
      for (let i =0; i<this.predmetPredispitneObaveze.length; i++){
        if (this.predmetPredispitneObaveze[i].sablon.id == res.sablon.id)
          this.predmetPredispitneObaveze[i] = res;

      }
      this.notify("Ocenjivanje Uspesno", "success");

    },
    (errorResponse: HttpErrorResponse) => {
      this.notify(errorResponse.error.message, "error");
    }));
    this.reset();
  }

  notify(message: string, type: string){
    if(type==="error"){
    this.snotify.error(message,
      {
        timeout: 2000,
        showProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true
      });
    }
    else if(type=="success"){
      this.snotify.success(message,
        {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true
        });
      }
    else if(type=="info"){
      this.snotify.info(message,
        {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true
        });
      }
    else if(type=="warning"){
      this.snotify.warning(message,
        {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true
        });
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
