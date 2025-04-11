import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_URL = `https://jsonplaceholder.typicode.com/users`;

  constructor(private http: HttpClient) { }

  fetchUsers(): Observable<any> {
    return this.http.get<any>(this.API_URL);
  }
}
