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
}
