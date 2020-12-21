import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from './guard/authentication.guard';
import { LoginComponent } from './login/login/login.component';
import { PredmetiListComponent } from './predmeti/predmeti-list/predmeti-list.component';
import { ProfilComponent } from './profil/profil.component';
import { RegisterComponent } from './register/register/register.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {path: '', redirectTo:"login", pathMatch:"full"},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path: 'profil', component: ProfilComponent},
  { path: 'user', component: UserComponent, canActivate: [AuthenticationGuard] },
  {path: 'predmeti', component: PredmetiListComponent},
];



@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
