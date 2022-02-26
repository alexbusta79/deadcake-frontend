import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) { 
  }

  USER_URL = `${environment.basicURL}` + '/interfell';

  
  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.USER_URL); 
  }
  
  getUser(id: number): Observable<User> {
    const url = `${this.USER_URL}/${id}`;
    return this.httpClient.get<User>(url);
  } 
  update(userTemp:User): Observable<User>{
    const url = `${this.USER_URL}/update`;
    return this.httpClient.put<User>(url,userTemp);
  }
  deleteUserById(id:number): Observable<boolean>{
    const url=`${this.USER_URL}/${id}`;
    return this.httpClient.delete<boolean>(url);
  }
  insert(userTemp : User) : Observable<User>{
    const url = `${this.USER_URL}/insert`;
    return this.httpClient.post<User>(url,userTemp);
  }
}


