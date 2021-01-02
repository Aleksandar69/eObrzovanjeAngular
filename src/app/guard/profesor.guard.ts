import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ProfesorGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private snotify: SnotifyService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if(this.authService.getUserFromLocalCache().role == "NASTAVNIK"){
        return true;
      }
      this.router.navigate(['/profil']);
      this.snotify.error(`You must be a Professor to access this page.`);
      return false;
  }

}
