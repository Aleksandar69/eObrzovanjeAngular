import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistracijaZahtevService {


  private host = environment.apiUrl;


  constructor(public http:HttpClient) { }


  getZahtevi(page = 0, size = 0, ime = "", prezime = ""){
    return this.http.get(`${this.host}` + '/registracija-zahtev?size='+size+'&page='+page+'&ime='+ime+'&prezime='+prezime, {observe: 'response'}).pipe(
      map((res:any) => {
        return res;
      }));
  }

  getNeodobreni(page = 0, size = 0, ime = "", prezime = ""){
    return this.http.get(`${this.host}` + '/registracija-zahtev/neodobreni?size='+size+'&page='+page+'&ime='+ime+'&prezime='+prezime, {observe: 'response'}).pipe(
      map((res:any) => {
        return res;
      }));
  }

  odobri(id, user){
    return this.http.put(`${this.host}/registracija-zahtev` +'/'+id, user).pipe(map((res:any) => res)
    );
  }
}
