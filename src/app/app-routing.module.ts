import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministracijaComponent } from './administracija/administracija.component';
import { PredmetiAdministracijaComponent } from './administracija/predmeti-administracija/predmeti-administracija.component';
import { ProfesorAdministracijaComponent } from './administracija/profesor-administracija/profesor-administracija.component';
import { RegistracijaZahtevAdministracijaComponent } from './administracija/registracija-zahtev-administracija/registracija-zahtev-administracija.component';
import { StudentAdministracijaComponent } from './administracija/student-administracija/student-administracija.component';
import { AdminGuard } from './guard/admin.guard';
import { AuthenticationGuard } from './guard/authentication.guard';
import { ProfesorGuard } from './guard/profesor.guard';
import { LoginComponent } from './login/login/login.component';
import { PredmetiListComponent } from './predmeti/predmeti-list/predmeti-list.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { ProfilComponent } from './profil/profil.component';
import { RegisterComponent } from './register/register/register.component';
import { DokumentiComponent } from './upravljanjeStudent/dokumenti/dokumenti.component';
import { NepolozeniComponent } from './upravljanjeStudent/nepolozeni/nepolozeni.component';
import { PolozeniComponent } from './upravljanjeStudent/polozeni/polozeni.component';
import { PrijaveComponent } from './upravljanjeStudent/prijave/prijave.component';
import { UplateComponent } from './upravljanjeStudent/uplate/uplate.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {path: '', redirectTo:"/profil", pathMatch:"full"},
  {path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent },
  {path: 'profil', component: ProfilComponent, canActivate: [AuthenticationGuard]},
  {path: 'user', component: UserComponent, canActivate: [AuthenticationGuard] },
  {path: 'prijava-ispita', component: PrijavaComponent, canActivate: [AuthenticationGuard]},
  {path: 'dokumenti', component: DokumentiComponent, canActivate: [AuthenticationGuard]},
  {path: 'nepolozeni', component: NepolozeniComponent, canActivate: [AuthenticationGuard]},
  {path: 'polozeni', component: PolozeniComponent, canActivate: [AuthenticationGuard]},
  {path: 'prijave', component: PrijaveComponent, canActivate: [AuthenticationGuard]},
  {path: 'uplate', component: UplateComponent, canActivate: [AuthenticationGuard]},

  {path: 'predmeti', component: PredmetiListComponent, canActivate: [AuthenticationGuard, ProfesorGuard]},

  {path: 'administracija', component: AdministracijaComponent, canActivate: [AuthenticationGuard, AdminGuard]},
  {path: 'administracija/predmeti', component: PredmetiAdministracijaComponent , canActivate: [AuthenticationGuard, AdminGuard]},
  { path: 'administracija/studenti', component: StudentAdministracijaComponent , canActivate: [AuthenticationGuard, AdminGuard]},
  { path: 'administracija/nastavnici', component: ProfesorAdministracijaComponent , canActivate: [AuthenticationGuard, AdminGuard]},
  { path: 'regzahtjev', component: RegistracijaZahtevAdministracijaComponent , canActivate: [AuthenticationGuard, AdminGuard]},


  {path: '**', redirectTo:"/profil", canActivate: [AuthenticationGuard]}
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
