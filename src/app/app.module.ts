import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './register/register/register.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { ProfilComponent } from './profil/profil.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { PredmetiIspitiListComponent } from './predmeti/predmeti-ispiti-list/predmeti-ispiti-list.component';
import { PredmetiIspitiPrijaveComponent } from './predmeti/predmeti-ispiti-prijave/predmeti-ispiti-prijave.component';
import { PredmetiStudentiListComponent } from './predmeti/predmeti-studenti-list/predmeti-studenti-list.component';
import { PredmetiItemComponent } from './predmeti/predmeti-item/predmeti-item.component';
import { PredmetiListComponent } from './predmeti/predmeti-list/predmeti-list.component';
import { NavComponent } from './nav/nav.component';
import { AdministracijaComponent } from './administracija/administracija.component';
import { PredmetiAdministracijaComponent } from './administracija/predmeti-administracija/predmeti-administracija.component';
import { ProfesorAdministracijaComponent } from './administracija/profesor-administracija/profesor-administracija.component';
import { IspitiAdministracijaComponent } from './administracija/predmeti-administracija/ispiti-administracija/ispiti-administracija.component';
import { StudentAdministracijaComponent } from './administracija/student-administracija/student-administracija.component';
import { DokumentAdministracijaComponent } from './administracija/student-administracija/dokument-administracija/dokument-administracija.component';
import { UplateAdministracijaComponent } from './administracija/student-administracija/uplate-administracija/uplate-administracija.component';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { PrijavaComponent } from './prijava/prijava.component';
import { DokumentiComponent } from './upravljanjeStudent/dokumenti/dokumenti.component';
import { UplateComponent } from './upravljanjeStudent/uplate/uplate.component';
import { PolozeniComponent } from './upravljanjeStudent/polozeni/polozeni.component';
import { NepolozeniComponent } from './upravljanjeStudent/nepolozeni/nepolozeni.component';
import { PrijaveComponent } from './upravljanjeStudent/prijave/prijave.component';
import { RegistracijaZahtevAdministracijaComponent } from './administracija/registracija-zahtev-administracija/registracija-zahtev-administracija.component';
import { PredmetiStudentiPredispitneObavezePolaganjeComponent } from './predmeti/predmeti-studenti-predispitne-obaveze-polaganje/predmeti-studenti-predispitne-obaveze-polaganje.component';
import { PredispitneObavezeAdministracijaComponent } from './administracija/predmeti-administracija/predispitne-obaveze-administracija/predispitne-obaveze-administracija.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfilComponent,
    PredmetiIspitiListComponent,
    PredmetiIspitiPrijaveComponent,
    PredmetiStudentiListComponent,
    PredmetiStudentiPredispitneObavezePolaganjeComponent,
    PredmetiItemComponent,
    PredmetiListComponent,
    NavComponent,
    AdministracijaComponent,
    PredmetiAdministracijaComponent,
    PredispitneObavezeAdministracijaComponent,
    ProfesorAdministracijaComponent,
    IspitiAdministracijaComponent,
    StudentAdministracijaComponent,
    DokumentAdministracijaComponent,
    UplateAdministracijaComponent,
    PrijavaComponent,
    DokumentiComponent,
    UplateComponent,
    PolozeniComponent,
    NepolozeniComponent,
    PrijaveComponent,
    RegistracijaZahtevAdministracijaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SnotifyModule,
    MDBBootstrapModule.forRoot(),
    AngularDualListBoxModule,
    FontAwesomeModule

  ],
  providers: [AuthenticationGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, { provide: 'SnotifyToastConfig', useValue: ToastDefaults}, SnotifyService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
