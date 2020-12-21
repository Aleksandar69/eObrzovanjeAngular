import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredispitneObavezeSablonServiceService {

  private host = environment.apiUrl;


  constructor(private http: HttpClient) { }

  getSabloniByPredmetId( id: number){
    return this.http.get(`${this.host}/predmeti/` + id + '/predispitne-obaveze-sabloni').pipe(
      map((res:any) => res)
    );
  }
}
