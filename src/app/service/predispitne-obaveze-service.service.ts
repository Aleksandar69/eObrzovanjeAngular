import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PredispitneObavezeServiceService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPredispitneObavezeByStudentIdandPredmetId( studentId: number, predmetId: number){
    return this.http.get(`${this.host}/studenti/` + studentId + '/predispitne-obaveze?predmet='+predmetId).pipe(
      map((res:any) => res)
    );
  }

  addPredispitnaObaveza(predispitnaObaveza){
    return this.http.post(`${this.host}/predispitne-obaveze`, predispitnaObaveza).pipe(map((res:any) => res)
  );
  }
}
