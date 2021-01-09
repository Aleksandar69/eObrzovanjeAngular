import { Component, Input, OnInit } from '@angular/core';
import { PredispitneObavezeService } from 'src/app/service/predispitne-obaveze-service.service';
import { PredmetService } from 'src/app/service/predmet.service';

@Component({
  selector: 'app-predispitne-obaveze-administracija',
  templateUrl: './predispitne-obaveze-administracija.component.html',
  styleUrls: ['./predispitne-obaveze-administracija.component.css']
})
export class PredispitneObavezeAdministracijaComponent implements OnInit {


  @Input() predmetId:any;
  @Input() currentSablon = { id:"", ukupnoBodova:" ", minimumBodova:"", naziv: "" , predmet:""};
  sabloni = [];
  deleteId:number;
  deleteName:string;
  isUpdate: boolean;

  constructor(public sablonService: PredispitneObavezeService, public predmetService: PredmetService) {
  }

  ngOnInit() {
    this.currentSablon.predmet = this.predmetId;
    this.sablonService.getSabloniByPredmetId(this.predmetId).subscribe(res => this.sabloni = res);
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
    this.sablonService.deleteSablon(this.deleteId).subscribe(
    );
    this.sabloni.splice(deleteIndex,1);


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
    this.sablonService.addSablon(this.currentSablon).subscribe(res => {
      this.sabloni.push(res);
    })
  }

  update(){
    this.sablonService.updateSablon(this.currentSablon.id, this.currentSablon).subscribe(x => {
      for (let i =0; i<this.sabloni.length; i++){
        if (this.sabloni[i].id == x.id){
          this.sabloni[i] = x;
      }
    }
  })
  }

  editSablon(sablon){
    this.isUpdate = true;
    this.currentSablon.id = sablon.id;
    this.currentSablon.minimumBodova = sablon.minimumBodova;
    this.currentSablon.ukupnoBodova = sablon.ukupnoBodova;
    this.currentSablon.naziv = sablon.naziv;
  }


}
