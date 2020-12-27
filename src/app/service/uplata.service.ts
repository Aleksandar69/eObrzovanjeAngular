import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UplataService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }


  getUplateByStudentId( id: number, page = 0, size = 0){
    return this.http.get(`${this.host}`+ '/studenti/' + id + '/uplate?page='+page+'&size='+size, {observe: 'response'}).pipe(map((res:any) => {
      return res;
    }));
  }

  addUplata(uplata){
    return this.http.post(`${this.host}` + '/uplate/', uplata).pipe(map((res:any) => res)
   );
  }


}
