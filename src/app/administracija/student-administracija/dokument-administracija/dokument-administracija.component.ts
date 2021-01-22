import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DokumentService } from 'src/app/service/dokument.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SnotifyService } from 'ng-snotify';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { faArrowCircleLeft, faSearch } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-dokument-administracija',
  templateUrl: './dokument-administracija.component.html',
  styleUrls: ['./dokument-administracija.component.css']
})
export class DokumentAdministracijaComponent implements OnInit, OnDestroy {

  @ViewChild('sadrzaj')
  sadrzajInput: any;
  dokumenti:any[] = [];
  deleteId:number;
  deleteName:string;
  isUpdate:boolean;
  currentDokument = {id:"", naziv:"", datumDokumenta:"",sadrzaj:""};
  sadrzaj: any;
  isDocLocked:boolean;
  @Input() userId: number;
  datePipe = new DatePipe("en-US");
  activePage: number = 1;
  size: number = 5;
  pageCount = [];
  filterNaziv: string;
  fileName: string;
  fileData: File;
  currentDocSadrzaj: any;
  private subscriptions: Subscription[] = [];
  faSearch = faSearch;



  constructor(public dokumentiService:DokumentService, private cdRef: ChangeDetectorRef, private sanitizer:DomSanitizer,
    private snotify: SnotifyService) {
  }


  ngOnInit() {
      this.getDokumenti();
    }

    changePage(page) {
      this.activePage = page;
      this.getDokumenti();
    }

    getDokumenti(){
      this.subscriptions.push(
      this.dokumentiService.getDokumentsByStudentId(this.userId, this.activePage-1, this.size, this.filterNaziv).subscribe(res =>{
        this.dokumenti = res.body;
        this.dokumenti.forEach(doc => {
          doc.datumDokumenta = this.datePipe.transform(doc.datumDokumenta, "yyyy-MM-dd");
        });
        this.pageCount = Array(parseInt(res.headers.get("total"))).fill(0).map((x,i)=>i);
        if (this.pageCount.length == 0){
          this.pageCount.push(0);
        }
      }));
    }

  deleteDokument(id,naziv){
    this.deleteId = id;
    this.deleteName = naziv;
  }

  deleteConfirm(){
    var deleteIndex: number;
    this.subscriptions.push(
    this.dokumentiService.deleteDokument(this.deleteId).subscribe(
     () =>{ this.notify("Dokument Uspesno Obrisan", "success");
     },
     (errorResponse: HttpErrorResponse) => {
       this.notify(errorResponse.error.message, "error");
     }
     ));

      this.dokumenti.forEach((element, index) => {
        if (this.deleteId == element.id){
          deleteIndex = index;
        }
      })
    this.dokumenti.splice(deleteIndex,1);
  }

  addDokument(){
    this.reset();
    this.isUpdate = false;

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
    this.fileData = null;
    this.fileName = "";
    if (this.sadrzajInput!= undefined){
      this.sadrzajInput.nativeElement.value = "";
    }
  }


  onAddFile(){
    const formData = new FormData();
    formData.append('file', this.fileData);
    formData.append('naziv', this.currentDokument.naziv);

    if(!this.isUpdate){
      this.subscriptions.push(
    this.dokumentiService.addDokument(formData, this.userId).subscribe(
      x => {
      x.datumDokumenta = this.datePipe.transform(x.datumDokumenta, "yyyy-MM-dd");
      this.dokumenti.push(x);
      this.notify("Dokument Uspesno Dodat", "success");
      }
    ,
    (errorResponse: HttpErrorResponse) => {
      this.notify(errorResponse.error.message, "error");
    }));
    }
    else{
      formData.append('docid', this.currentDokument.id);
      this.subscriptions.push(
      this.dokumentiService.editDokument(formData, this.userId).subscribe(
        x => {
          var index;
          for (let i =0; i<this.dokumenti.length; i++){
            if (this.dokumenti[i].id == x.id){
              this.dokumenti[i] = x;
              x.datumDokumenta = this.datePipe.transform(x.datumDokumenta, "yyyy-MM-dd");
              index = i;
                }
              }
              this.notify("Dokument Uspesno Izmenjen", "success");

          },
          (errorResponse: HttpErrorResponse) => {
            this.notify(errorResponse.error.message, "error");
          }));
    }
  }

  addNewFile(file:any){
    this.fileName = file.target.files[0].name;
    this.fileData = file.target.files[0];
  }

  onGetDokument(sadrzaj: any){
    this.currentDocSadrzaj=sadrzaj;
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
