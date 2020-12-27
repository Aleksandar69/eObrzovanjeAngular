import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministracijaComponent } from './administracija/administracija.component';
import { PredmetiAdministracijaComponent } from './administracija/predmeti-administracija/predmeti-administracija.component';
import { ProfesorAdministracijaComponent } from './administracija/profesor-administracija/profesor-administracija.component';
import { StudentAdministracijaComponent } from './administracija/student-administracija/student-administracija.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { LoginComponent } from './login/login/login.component';
import { PredmetiListComponent } from './predmeti/predmeti-list/predmeti-list.component';
import { ProfilComponent } from './profil/profil.component';
import { RegisterComponent } from './register/register/register.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {path: '', redirectTo:"login", pathMatch:"full"},
  {path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent },
  {path: 'profil', component: ProfilComponent, canActivate: [AuthenticationGuard]},
  {path: 'user', component: UserComponent, canActivate: [AuthenticationGuard] },
  {path: 'predmeti', component: PredmetiListComponent, canActivate: [AuthenticationGuard]},
  {path: 'administracija', component: AdministracijaComponent, canActivate: [AuthenticationGuard]},

  {path: 'administracija/predmeti', component: PredmetiAdministracijaComponent , canActivate: [AuthenticationGuard]},
  { path: 'administracija/studenti', component: StudentAdministracijaComponent , canActivate: [AuthenticationGuard]},
  { path: 'administracija/nastavnici', component: ProfesorAdministracijaComponent , canActivate: [AuthenticationGuard]},
];



@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
