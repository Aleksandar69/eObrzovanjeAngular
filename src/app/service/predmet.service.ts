import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PredmetService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPredmeti(page = 0, size = 0, naziv = ""){
    return this.http.get(`${this.host}/predmeti?size=`+size+'&page='+page+'&naziv='+naziv, {observe: 'response'}).pipe(map((res:any) => {
      return res;
      }
      )
    );
  }

  getStudenti( id: number){
    return this.http.get(`${this.host}/predmeti/` + id + '/studenti').pipe(
      map((res:any) => res)
  );
  }


  getPredmetByNastavnikId( id: number){
    return this.http.get(`${this.host}/nastavnik/` + id + '/predmeti').pipe(
      map((res:any) => res)
    );
  }

  getPredmetByStudentId( id: number){
    return this.http.get(`${this.host}/studenti/` + id + '/predmeti').pipe(
      map((res:any) => res));
  }

}
