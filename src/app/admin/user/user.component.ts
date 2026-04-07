import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../shared/api.service';

interface User {
  id?: string;
  _id?: string;
  userName?: string;
  email: string;
  role?: string;
  isadmin?: boolean;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  users: User[] = [];
  loading = true;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;
    this.apiService.getUsers().subscribe({
      next: (data) => {
        this.users = data || [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.loading = false;
        this.cdr.markForCheck();
        alert('Error fetching users');
      },
    });
  }

  handleDelete(userId: string): void {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      this.apiService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter((user) => {
            const user_id = user.id || user._id;
            return user_id !== userId;
          });
          alert('User deleted successfully.');
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          alert(error.error?.error || 'Error deleting user.');
          this.cdr.markForCheck();
        },
      });
    }
  }
}
