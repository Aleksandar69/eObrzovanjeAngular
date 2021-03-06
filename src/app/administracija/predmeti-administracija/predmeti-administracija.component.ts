import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { Subscription } from 'rxjs';
import { PredmetService } from 'src/app/service/predmet.service';
import { UserService } from 'src/app/service/user.service';
import { faArrowCircleLeft, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-predmeti-administracija',
  templateUrl: './predmeti-administracija.component.html',
  styleUrls: ['./predmeti-administracija.component.css']
})
export class PredmetiAdministracijaComponent implements OnInit, OnDestroy {

  predmeti: any[] = [];
  nastavnici = [];
  currentPredmet = { id: "", naziv: "", oznaka: "", espb: "" };
  deleteName: any;
  deleteId: number;
  isUpdate: boolean;
  valid: boolean = true;
  oznakaOriginal: string;
  sourceStudent = [];
  sourceNastavnik = [];
  destinationNastavnik = [];
  destinationStudent = [];
  display = "ime";
  key = "id";
  activePage: number = 1;
  size: number = 5;
  filterNaziv: string;
  pageCount = [];
  private subscriptions: Subscription[] = [];
  faArrowCircleLeft = faArrowCircleLeft;
  faSearch = faSearch;


  constructor(public predmetiService: PredmetService, public userService: UserService, private router: Router,
    private snotify: SnotifyService) {
    this.getPredmeti();
  }


  getPredmeti() {
    this.predmetiService.getPredmeti(this.activePage - 1, this.size, this.filterNaziv).subscribe(res => {
      this.predmeti = res.body;
      this.predmeti.forEach(element => {
        element.showIspiti = false;
        element.showSabloni = false;
      });
      this.pageCount = Array(parseInt(res.headers.get("total"))).fill(0).map((x, i) => i);
      if (this.pageCount.length == 0) {
        this.pageCount.push(0);
      }
    });
  }


  ngOnInit() {

    this.subscriptions.push(
    this.userService.getStudenti().subscribe(res => {
      res.body.forEach(element => {
        this.sourceStudent.push({ id: element.id, ime: element.brojIndexa + ": " + element.ime + " " + element.prezime });
      });
    }));

    this.subscriptions.push(

    this.userService.getNastavnici().subscribe(res => {
      res.body.forEach(element => {
        this.sourceNastavnik.push({ id: element.id, ime: element.ime + " " + element.prezime });
      });
    }));

  }

  changePage(page) {
    this.activePage = page;
    this.getPredmeti();
  }

  deletePredmet(id, naziv) {
    this.deleteId = id;
    this.deleteName = naziv;
  }

  deleteConfirm() {
    var deleteIndex: number;
    this.subscriptions.push(
    this.predmetiService.deletePredmet(this.deleteId).subscribe(res => {
      this.predmeti.forEach((element, index) => {
        if (this.deleteId == element.id) {
          deleteIndex = index;
        }
      });
      this.predmeti.splice(deleteIndex, 1);
      this.notify("Uspesno Obrisan Predmet", "success");
      if (this.predmeti.length == 0) {
        if (this.activePage != 1) {
          this.activePage = this.activePage - 1;
        }
        this.getPredmeti();
      } else {
        if (this.activePage < this.pageCount.length) {
          this.getPredmeti();
        }
      }
    },
      (errorResponse: HttpErrorResponse) => {
        this.notify(errorResponse.error.message, "error");
      }
    ));
  }

  isLetter(letter){
    let res = /^[a-zA-Z]+/;
    return res.test(letter);

  }
  saveConfirm() {
    if (!this.isUpdate) {
      this.save();
    } else {
      this.update();
    }
  }

  save() {
    this.subscriptions.push(
    this.predmetiService.addPredmet(this.currentPredmet).subscribe(x => {
      if (this.predmeti.length == this.size) {
        this.pageCount.push(this.pageCount.length + 1);
        this.changePage(1);
      }
      this.notify("Uspesno Dodat Predmet", "success");
      this.predmeti.push(x);
    },
      (errorResponse: HttpErrorResponse) => {
        this.notify(errorResponse.error.message, "error");
      }));

  }

  reset() {
    this.currentPredmet.naziv = "";
    this.currentPredmet.oznaka = "";
    this.currentPredmet.naziv = "";
    this.oznakaOriginal = "";
    this.valid = true;
  }

  addPredmet() {
    this.reset;
    this.isUpdate = false;

  }

  update() {
    this.subscriptions.push(
    this.predmetiService.updatePredmet(this.currentPredmet.id, this.currentPredmet).subscribe(x => {
      for (let i = 0; i < this.predmeti.length; i++) {
        if (this.predmeti[i].id == x.id) {
          this.predmeti[i] = x;
        }
      }
      this.notify("Uspesno Izmenjen Predmet", "success");
    },
      (errorResponse: HttpErrorResponse) => {
        this.notify(errorResponse.error.message, "error");
      }
    ));

  }

  editPredmet(predmet) {
    this.isUpdate = true;
    this.currentPredmet.id = predmet.id;
    this.currentPredmet.espb = predmet.espb;
    this.currentPredmet.naziv = predmet.naziv;
    this.currentPredmet.oznaka = predmet.oznaka;
    this.oznakaOriginal = predmet.oznaka;
  }

  showIspiti(id) {
    this.predmeti.forEach(element => {
      if (element.id == id) element.showIspiti = !element.showIspiti;
    }
    );
  }

  showSabloni(id) {
    this.predmeti.forEach(element => {
      if (element.id == id) element.showSabloni = !element.showSabloni;
    });
  }

  checkOznaka() {
    this.valid = true;
    this.subscriptions.push(
    this.predmetiService.checkOznaka(this.currentPredmet.oznaka).subscribe((res) => {
      if (this.currentPredmet.oznaka != this.oznakaOriginal || this.oznakaOriginal == "") {
        this.valid = false;
      }
    }, (err) => {
      if (err.status == 302) {
        if (this.currentPredmet.oznaka != this.oznakaOriginal || this.oznakaOriginal == "")
          this.valid = false;
      }
    }));
  }

  getNastavnici(id) {
    this.currentPredmet.id = id;
    this.destinationNastavnik = [];
    this.subscriptions.push(
    this.predmetiService.getNastavnici(id).subscribe(res => {
      res.forEach(element => {
        this.destinationNastavnik.push({ id: element.id, ime: element.ime + " " + element.prezime });
      });
    }));
  }

  saveNastavnici() {
    this.subscriptions.push(
    this.predmetiService.postNastavnici(this.currentPredmet.id, this.destinationNastavnik).subscribe(
      x => this.notify("Uspesno Dodati Nastavnici Na Predmet", "success"),
      (errorResponse: HttpErrorResponse) => {
        this.notify(errorResponse.error.message, "error");
      }
    ));
  }

  getStudenti(id) {
    this.destinationStudent = [];
    this.currentPredmet.id = id;
    this.subscriptions.push(
    this.predmetiService.getStudenti(id).subscribe(res => {
      res.forEach(element => {
        this.destinationStudent.push({ id: element.id, ime: element.brojIndexa + ": " + element.ime + " " + element.prezime });
      });
    }));
  }

  saveStudenti() {
    this.subscriptions.push(
    this.predmetiService.postStudenti(this.currentPredmet.id, this.destinationStudent).subscribe(
      x => this.notify("Uspesno Dodati Studenti Na Predmet", "success"),
      (errorResponse: HttpErrorResponse) => {
        this.notify(errorResponse.error.message, "error");
      }
    ));
  }

  notify(message: string, type: string) {
    if (type === "error") {
      this.snotify.error(message,
        {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true
        });
    }
    else if (type == "success") {
      this.snotify.success(message,
        {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true
        });
    }
    else if (type == "info") {
      this.snotify.info(message,
        {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true
        });
    }
    else if (type == "warning") {
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
1
