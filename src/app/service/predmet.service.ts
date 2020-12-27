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
    return this.http.get(`${this.host}/nastavnik/` + id + '/predmeti').pipe (
      map((res:any) => res)
    );
  }

  getPredmetByStudentId( id: number){
    return this.http.get(`${this.host}/studenti/` + id + '/predmeti').pipe(
      map((res:any) => res));
  }

  getNastavnici( predmetId: number){
    return this.http.get(`${this.host}/predmeti/` + predmetId + '/nastavnici').pipe(map((res:any) => res)
    );
  }


  deletePredmet(id){
    return this.http.delete(`${this.host}` + '/predmeti/' + id).pipe(map((res:any) => res)
  );
}
addPredmet(predmet){
  return this.http.post(`${this.host}` + '/predmeti/', predmet).pipe(map((res:any) => res)
  );
}

updatePredmet(id, predmet){
  return this.http.put(`${this.host}` + '/predmeti/'+id, predmet).pipe(map((res:any) => res)
  );
}

checkOznaka(oznaka){
  return this.http.get(`${this.host}` + '/predmeti/oznaka-check?oznaka='+oznaka).pipe(map((res:any) => {
      res.status
  }));
}

postNastavnici(id, nastavnici){
  var arraySend = [];
  nastavnici.forEach(element => {
    arraySend.push(element.id);
  });
   return this.http.post(`${this.host}` + '/predmeti/'+id+'/nastavnici', arraySend).pipe(map((res:any) => res)
  );
}


postStudenti(id, studenti){
  var arraySend = [];
  studenti.forEach(element => {
    arraySend.push(element.id);
  });
   return this.http.post(`${this.host}` + '/predmeti/'+id+'/studenti', arraySend).pipe(map((res:any) => res)
   );
}

}

