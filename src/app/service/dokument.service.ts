import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DokumentService {

  public host = environment.apiUrl;

  constructor(private http:HttpClient) { }


  getDokumentsByStudentId( id: number, page = 0, size = 0, naziv = ""){
    return this.http.get(`${this.host}` + '/studenti/' + id + '/dokumenti?page='+page+'&size='+size+'&naziv='+naziv,{observe: 'response'}).pipe(map((res:any) => {
      return res;
    })
    );
  }

  deleteDokument(id){
    return this.http.delete(`${this.host}` + '/dokumenti/' + id).pipe(map((res:any) => res)
    );
  }

  // addDokument(studentId, dokument){
  //   const formData = new FormData();
  //   formData.set("naziv", dokument.naziv);
  //   formData.set("dokument", dokument.sadrzaj);
  //   return this.http.post(`${this.host}` + '/studenti/' + studentId + '/dokumenti', formData).pipe(map((res:any) => res)
  //  );
  // }

  addDokument(formData: FormData, studentId){
    return this.http.post(`${this.host}` + '/studenti/' + studentId + '/dokumenti', formData).pipe(map((res:any) => res)
   );
  }

  updateDokument(id, dokument){
    return this.http.put(`${this.host}` + '/dokumenti/'+id, dokument).pipe(map((res:any) => res)
  );
  }

  editDokument(formData: FormData, studentId){
    return this.http.put(`${this.host}` + '/studenti/' + studentId + '/dokumenti', formData).pipe(map((res:any) => res)
   );
  }

}
