import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrijavaService {

  private host = environment.apiUrl;

  constructor(public http:HttpClient) { }

  getPrijave(){
    return this.http.get(`${this.host}/prijave`).pipe(
      map((res:any) => res)
    );
  }

  getPrijaveByStudentId( id: number){
    return this.http.get(`${this.host}/studenti/` + id + '/prijave').pipe(
      map((res:any) => res)
    );
  }

  getPrijaveByIspitId( id: number){
    return this.http.get(`${this.host}/ispit/` + id + '/prijave').pipe(map((res:any) => res));
  }


  addPrijava(prijava){
    return this.http.post(`${this.host}` + '/prijave/', prijava).pipe(map((res:any) => res)
    );
  }

  updatePrijava(id, prijava){
    return this.http.put(`${this.host}` + '/prijave/'+id, prijava).pipe(map((res:any) => res)
    );
  }

  deletePrijava(id){
    return this.http.delete(`${this.host}/prijave/` + id).pipe(map((res:any) => res)
    );
  }

}
