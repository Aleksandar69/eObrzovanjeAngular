import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';
import { Observable } from 'rxjs';
import { map, tap, take, exhaustMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private host = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.host}/users`);
  }

  public addUser(formData: FormData): Observable<User> {
    return this.http.post<User>(`${this.host}/users/add`, formData);
  }

  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache(): User[] {
    if (localStorage.getItem('users')) {
        return JSON.parse(localStorage.getItem('users'));
    }
    return null;
  }

  public getUsers2() {
    return this.http.get(`${this.host}/users`, {observe: 'response'}).pipe(
      map((res: any) =>{
        return res;
      })
    );
  }

  public createUserFormDate(loggedInUsername: string, user: User): FormData {
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.ime);
    formData.append('lastName', user.prezime);
    formData.append('username', user.username);
    formData.append('role', user.role);
    return formData;
  }


  getAdmini(){
    return this.http.get(`${this.host}/admin`).pipe(
      map((res:any) => res)
    );
  }

  getStudenti(page = 0, size = 0, ime = "", prezime = ""){
    return this.http.get(`${this.host}/studenti?size=`+size+'&page='+page+'&ime='+ime+'&prezime='+prezime, {observe: 'response'}).pipe(
    map((res:any) => {
      return res;
    }
    ));
  }

  getNastavnici(page = 0, size = 0, ime = "", prezime = ""){
    return this.http.get(`${this.host}/studenti?size=`+size+'&page='+page+'&ime='+ime+'&prezime='+prezime, {observe: 'response'}).pipe(
      map((res:any) => {
      return res;
    }
      ));
  }

  getUser( id: number){
    return this.http.get(`${this.host}/users` + id).pipe(
      map((res:any) => res)
    )
  }

  getDokumentiByStudentId(id: number){
    return this.http.get(`${this.host}/studenti/`+ id + "/dokumenti" ).pipe(
      map((res:any) => res)
    );
  }

  getPolozeniPredmeti(id:any){
    return this.http.get(`${this.host}/studenti/` + id + "/polozeni-ispiti" ).pipe
    (map((res:any) => res)
    );
  }

  getNepolozeniPredmeti(id: any){
    return this.http.get(`${this.host}/studenti/` + id + "/nepolozeni-ispiti" ).pipe(
      map((res:any) => res)
    );
  }

  getUplateByStudentId( id: number, page = 0, size = 0){
    return this.http.get(`${this.host}/studenti/` + id + '/uplate?page='+page+'&size='+size, {observe: 'response'})
    .pipe(map(
      (res: any) => res)
    );
  }

  getByUsername(username: String){
    return this.http.get(`${this.host}/users/user`+ username).pipe(
      map((res:any) => res)
    );
  }

}
