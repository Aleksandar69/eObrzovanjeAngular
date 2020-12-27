import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DokumentService } from 'src/app/service/dokument.service';

@Component({
  selector: 'app-dokument-administracija',
  templateUrl: './dokument-administracija.component.html',
  styleUrls: ['./dokument-administracija.component.css']
})
export class DokumentAdministracijaComponent implements OnInit {

  @ViewChild('sadrzaj')
  sadrzajInput: any;
  dokumenti:any[] = [];
  deleteId:number;
  deleteName:string;
  isUpdate:boolean;
  currentDokument = {id:"", naziv:"", datumDokumenta:"",sadrzaj:""};
  sadrzaj: any;
  isDocLocked:boolean;
  @Input() userId: any;
  datePipe = new DatePipe("en-US");
  activePage: number = 1;
  size: number = 5;
  pageCount = [];
  filterNaziv: string;


  constructor(public dokumentiService:DokumentService, private cdRef: ChangeDetectorRef) {

  }

  ngOnInit() {
      this.getDokumenti();
    }

    changePage(page) {
      this.activePage = page;
      this.getDokumenti();
    }

    getDokumenti(){
      this.dokumentiService.getDokumentsByStudentId(this.userId, this.activePage-1, this.size, this.filterNaziv).subscribe(res =>{
        this.dokumenti = res.body;
        this.dokumenti.forEach(doc => {
          doc.datumDokumenta = this.datePipe.transform(doc.datumDokumenta, "yyyy-MM-dd");
        });
        this.pageCount = Array(parseInt(res.headers.get("total"))).fill(0).map((x,i)=>i);
        if (this.pageCount.length == 0){
          this.pageCount.push(0);
        }
      });
    }

  deleteDokument(id,naziv){
    this.deleteId = id;
    this.deleteName = naziv;
  }

  deleteConfirm(){
    var deleteIndex: number;
    this.dokumentiService.deleteDokument(this.deleteId).subscribe();
      this.dokumenti.forEach((element, index) => {
        if (this.deleteId == element.id){
          deleteIndex = index;
        }
      });
    this.dokumenti.splice(deleteIndex,1);
  }

  addDokument(){
    this.reset();
  }

  create(){

    this.dokumentiService.addDokument(this.userId, this.currentDokument).subscribe(x => {
        x.datumDokumenta = this.datePipe.transform(x.datumDokumenta, "yyyy-MM-dd");
        this.dokumenti.push(x);
      });
  }

  update(){
    this.dokumentiService.updateDokument(this.currentDokument.id, this.currentDokument).subscribe(x => {
    var index;
    for (let i =0; i<this.dokumenti.length; i++){
      if (this.dokumenti[i].id == x.id){
        this.dokumenti[i] = x;
        x.datumDokumenta = this.datePipe.transform(x.datumDokumenta, "yyyy-MM-dd");
        index = i;
          }
        }
    });
  }

  saveConfirm(){
    if (!this.isUpdate){
      this.create();
      }else{
      this.update();
  }
}


  getFiles(event){
    this.currentDokument.sadrzaj = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    this.isDocLockedCalc();
  }

  editDokument(dokument){
      this.isUpdate = true;
      this.currentDokument.id = dokument.id;
      this.currentDokument.naziv = dokument.naziv;
      this.currentDokument.datumDokumenta = dokument.datum;
  }

  reset(){
    this.isUpdate = false;
    this.currentDokument.id = "";
    this.currentDokument.naziv = "";
    this.currentDokument.datumDokumenta = "";
    this.currentDokument.sadrzaj = "";
    if (this.sadrzajInput!= undefined){
      this.sadrzajInput.nativeElement.value = "";
    }
    this.isDocLockedCalc();
  }

  isDocLockedCalc(){
    if (!this.isUpdate){
      if (this.currentDokument.sadrzaj=="" || this.currentDokument.sadrzaj == null){
        this.isDocLocked = true;
        return;
      }
    }
    this.isDocLocked = false;
  }

}
