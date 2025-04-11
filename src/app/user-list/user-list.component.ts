import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Users } from './users';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  userService = inject(UserService);
  private route = inject(ActivatedRoute);

  users: Users[] = [];
  filteredUsers: Users[] = [];
  searchQuery: string = '';
  private queryParamSubscription!: Subscription;

  isLoading = true;

  ngOnInit(): void {
    this.fetchUsers();

    this.queryParamSubscription = this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.filterUsers();
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
  }

  fetchUsers(): void {
    this.userService.fetchUsers().subscribe((resp) => {
      this.users = resp;
      this.filterUsers();
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
      throw new Error(err);
    });
  }

  filterUsers(): void {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.filteredUsers = [...this.users];
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.username.toLowerCase().includes(query) ||
      user.website.toLowerCase().includes(query) ||
      user.company.name.toLowerCase().includes(query)
    );
  }

}
