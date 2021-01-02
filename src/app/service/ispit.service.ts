import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IspitService {

  private host = environment.apiUrl;

  constructor(private http:HttpClient) { }

  getIspitByPredmetIdandNastavnikId( id: number, nastavnikId: any){
    console.log(nastavnikId)
     return this.http.get(`${this.host}/predmeti/` + id + '/ispiti?nastavnik='+nastavnikId).pipe(
       map((res:any) => res));
   }

   getIspitByPredmetId( id: number){
     return this.http.get(`${this.host}/predmeti/` + id + '/ispiti').pipe(
       map((res:any) => res));
   }

   getIspitbyPredmetIdPages( predmetId: number, page=0, size=0){
    return this.http.get(`${this.host}/predmeti/` + predmetId + '/ispiti?page='+page+'&size='+size, {observe: 'response'}).pipe(map((res:any) => {
      return res;
    })
    );
  }

  deleteIspit(id){
    return this.http.delete(`${this.host}`+'/ispit/' + id).pipe(map((res:any) => res)
    );
  }

  addIspit(predmetId , ispit){
    return this.http.post(`${this.host}`+'/predmeti/' + predmetId + '/ispiti', ispit).pipe(map((res:any) => res)
    );
  }


  updateIspit(id, ispit){
    return this.http.put(`${this.host}`+ '/ispit/'+id, ispit).pipe(map((res:any) => res)
    );
  }

  getIspitiZaPrijavu(id: number){
    return this.http.get(`${this.host}` + '/studenti/' + id + "/prijava-ispita" ).pipe(map((res:any) => res)
    );
  }

}
