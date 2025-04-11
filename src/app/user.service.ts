import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from './user-list/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_URL = `https://jsonplaceholder.typicode.com/users`;

  constructor(private http: HttpClient) { }

  fetchUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(this.API_URL);
  }
}
