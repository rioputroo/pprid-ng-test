import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Users } from './users';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserStoreService } from '../user-store.service';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy {
  private userStore = inject(UserStoreService);
  private route = inject(ActivatedRoute);

  users: Users[] = [];
  filteredUsers: Users[] = [];
  searchQuery: string = '';
  private queryParamSubscription!: Subscription;
  private usersSubscription!: Subscription;
  private loadingSubscription!: Subscription;

  isLoading = true;

  ngOnInit(): void {
    this.userStore.loadUsers();

    this.usersSubscription = this.userStore.users$.subscribe(users => {
      this.users = users;
      this.filterUsers();
    });

    this.loadingSubscription = this.userStore.loading$.subscribe(loading => {
      this.isLoading = loading;
    });

    this.queryParamSubscription = this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.filterUsers();
    });
  }

  ngOnDestroy(): void {
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
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
