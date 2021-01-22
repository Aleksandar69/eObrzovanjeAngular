import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { Subscription } from 'rxjs';
import { PredispitneObavezeService } from 'src/app/service/predispitne-obaveze-service.service';
import { PredmetService } from 'src/app/service/predmet.service';

@Component({
  selector: 'app-predispitne-obaveze-administracija',
  templateUrl: './predispitne-obaveze-administracija.component.html',
  styleUrls: ['./predispitne-obaveze-administracija.component.css']
})
export class PredispitneObavezeAdministracijaComponent implements OnInit, OnDestroy {


  @Input() predmetId:any;
  @Input() currentSablon = { id:"", ukupnoBodova:" ", minimumBodova:"", naziv: "" , predmet:""};
  sabloni = [];
  deleteId:number;
  deleteName:string;
  isUpdate: boolean;
  obrisan: boolean;
  private subscriptions: Subscription[] = [];


  constructor(public sablonService: PredispitneObavezeService, public predmetService: PredmetService,
    private snotify: SnotifyService) {
  }


  ngOnInit() {
    this.currentSablon.predmet = this.predmetId;
    this.subscriptions.push(
    this.sablonService.getSabloniByPredmetId(this.predmetId).subscribe(res => this.sabloni = res));
  }

  deleteSablon(sablon){
    this.deleteId = sablon.id;
    this.deleteName = sablon.naziv;
  }

  deleteConfirm(){
    var deleteIndex: number;
    this.sabloni.forEach((element, index) => {
      console.log("element" + element.naziv + " index:" + index);
      if (this.deleteId == element.id){
        deleteIndex = index;
      }
    })
    this.subscriptions.push(
    this.sablonService.deleteSablon(this.deleteId).subscribe(
      () => {
        this.obrisan = true;
        this.notify("Uspesno Obrisan", "success");
        this.sabloni.splice(deleteIndex,1);

      },
        (errorResponse: HttpErrorResponse) => {
          this.notify(errorResponse.error.message, "error");
        }
      ));

  }

  saveConfirm(){
    if (!this.isUpdate){
       this.create();
       }else{
       this.update();
     }
   }

   reset(){
    this.currentSablon.id="";
    this.currentSablon.naziv="";
    this.currentSablon.minimumBodova="";
    this.currentSablon.ukupnoBodova="";
  }

  addSablon(){
    this.isUpdate = false;
    this.reset();
  }

  create(){
    this.subscriptions.push(
    this.sablonService.addSablon(this.currentSablon).subscribe(res => {
      this.sabloni.push(res);
      this.notify("Uspesno Dodat Sablon", "success");
    },
        (errorResponse: HttpErrorResponse) => {
          this.notify(errorResponse.error.message, "error");
        }
    ));
  }

  update(){
    this.subscriptions.push(

    this.sablonService.updateSablon(this.currentSablon.id, this.currentSablon).subscribe(x => {
      for (let i =0; i<this.sabloni.length; i++){
        if (this.sabloni[i].id == x.id){
          this.sabloni[i] = x;
          this.notify("Uspesno Izmenjen Sablon", "success");
      }
    }
  },
      (errorResponse: HttpErrorResponse) => {
        this.notify(errorResponse.error.message, "error");
      }
  ));
  }


  editSablon(sablon){
    this.isUpdate = true;
    this.currentSablon.id = sablon.id;
    this.currentSablon.minimumBodova = sablon.minimumBodova;
    this.currentSablon.ukupnoBodova = sablon.ukupnoBodova;
    this.currentSablon.naziv = sablon.naziv;
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
