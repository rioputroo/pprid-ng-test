import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { Users } from '../user-list/users';

@Component({
  selector: 'app-user-details',
  imports: [CommonModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  userService = inject(UserService);
  route = inject(ActivatedRoute);

  user: Users | null = null;
  isLoading = true;

  ngOnInit(): void {
    // get id from url
    const id = this.route.snapshot.params['id'];
    this.fetchUser(id);
  }

  fetchUser(id: number): void {
    this.userService.fetchUser(id).subscribe({
      next: (resp) => {
        this.user = resp;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        throw new Error(err);
      }
    });
  }
}
