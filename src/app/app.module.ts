import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './register/register/register.component';
import { UserComponent } from './user/user.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { ProfilComponent } from './profil/profil.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    ProfilComponent,  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SnotifyModule

  ],
  providers: [AuthenticationGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, { provide: 'SnotifyToastConfig', useValue: ToastDefaults}, SnotifyService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
