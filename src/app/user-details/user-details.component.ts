import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Users } from '../user-list/users';
import { UserStoreService } from '../user-store.service';
import { Subscription } from 'rxjs';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-details',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  private userStore = inject(UserStoreService);
  private route = inject(ActivatedRoute);

  user: Users | null = null;
  isLoading = true;

  private userSubscription!: Subscription;
  private loadingSubscription!: Subscription;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);

    this.userStore.loadUser(id);

    this.userSubscription = this.userStore.selectedUser$.subscribe(user => {
      this.user = user;
    });

    this.loadingSubscription = this.userStore.loading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}
