import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredispitneObavezeService {

  private host = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getSabloniByPredmetId( id: number){
    return this.http.get(`${this.host}/predmeti/` + id + '/predispitne-obaveze').pipe(
      map((res:any) => res)
    );
  }


  deleteSablon(id){
    return this.http.delete(`${this.host}` + '/predispitne-obaveze/' + id).pipe(map((res:any) => res)

    );}


  addSablon(sablon){
    return this.http.post(`${this.host}` + '/predispitne-obaveze', sablon).pipe(map((res:any) => res)
  );}

  updateSablon(id,sablon){
    return this.http.put(`${this.host}` + '/predispitne-obaveze/'+id, sablon).pipe(map((res:any) => res)

    );}
  }

