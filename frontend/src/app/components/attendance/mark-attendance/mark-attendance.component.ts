import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, Employee } from '../../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mark-attendance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mark-attendance.component.html',
  styleUrl: './mark-attendance.component.css',
})
export class MarkAttendanceComponent implements OnInit {
  attendanceForm: FormGroup;
  employees: Employee[] = [];
  loading = false;
  message = '';
  isError = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.attendanceForm = this.fb.group({
      employee_id: ['', Validators.required],
      date: [today, Validators.required],
      status: ['Present', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.api.getEmployees().subscribe({
      next: (data) => (this.employees = data),
      error: (err) => console.error('Failed to load employees', err),
    });
  }

  onSubmit(): void {
    if (this.attendanceForm.invalid) return;

    this.loading = true;
    this.message = '';
    this.isError = false;

    this.api.markAttendance(this.attendanceForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Attendance marked successfully!';
        this.isError = false;
        setTimeout(() => this.router.navigate(['/attendance']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.isError = true;
        if (err.status === 400) {
          this.message = 'Attendance already marked for this date.';
        } else {
          this.message = 'Failed to mark attendance.';
        }
        console.error(err);
      },
    });
  }
}
