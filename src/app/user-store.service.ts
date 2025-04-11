import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Users } from './user-list/users';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private usersSubject = new BehaviorSubject<Users[]>([]);

  private selectedUserSubject = new BehaviorSubject<Users | null>(null);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public users$ = this.usersSubject.asObservable();
  public selectedUser$ = this.selectedUserSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor(private userService: UserService) {}

  loadUsers(): void {
    if (this.usersSubject.value.length > 0) {
      return;
    }

    this.loadingSubject.next(true);

    this.userService.fetchUsers().subscribe({
      next: (users) => {
        this.usersSubject.next(users);
        this.loadingSubject.next(false);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.loadingSubject.next(false);
      }
    });
  }

  loadUser(id: number): void {
    const cachedUsers = this.usersSubject.value;
    const existingUser = cachedUsers.find(user => user.id === id);

    if (existingUser) {
      this.selectedUserSubject.next(existingUser);
      return;
    }
    this.loadingSubject.next(true);

    this.userService.fetchUser(id).subscribe({
      next: (user) => {
        this.selectedUserSubject.next(user);

        if (!cachedUsers.some(u => u.id === user.id)) {
          this.usersSubject.next([...cachedUsers, user]);
        }

        this.loadingSubject.next(false);
      },
      error: (error) => {
        console.error(`Error fetching user with id ${id}:`, error);
        this.loadingSubject.next(false);
      }
    });
  }
}
