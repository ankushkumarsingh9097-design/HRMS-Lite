import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService, Employee } from '../../../services/api.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = true;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.api.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load employees';
        this.loading = false;
        console.error(err);
      },
    });
  }

  deleteEmployee(id: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.api.deleteEmployee(id).subscribe({
        next: () => {
          this.employees = this.employees.filter((e) => e._id !== id);
        },
        error: (err) => {
          alert('Failed to delete employee');
          console.error(err);
        },
      });
    }
  }
}
