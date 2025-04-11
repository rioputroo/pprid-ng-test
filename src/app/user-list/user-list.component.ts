import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Users } from './users';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  userService = inject(UserService);

  users: Users[] = [];

  isLoading = true;

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.fetchUsers().subscribe((resp) => {
      this.users = resp;
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      throw new Error(err);
    });
  }

}
