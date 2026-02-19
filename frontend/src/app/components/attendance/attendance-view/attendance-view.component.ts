import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, Attendance, Employee } from '../../../services/api.service';

@Component({
  selector: 'app-attendance-view',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './attendance-view.component.html',
  styleUrl: './attendance-view.component.css',
})
export class AttendanceViewComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployeeId = '';
  attendanceRecords: Attendance[] = [];
  loading = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getEmployees().subscribe((data) => (this.employees = data));
    this.loadAllAttendance();
  }

  loadAllAttendance(): void {
    this.loading = true;
    this.api.getAllAttendance().subscribe({
      next: (data) => {
        this.attendanceRecords = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load attendance', err);
        this.loading = false;
      },
    });
  }

  onEmployeeSelect(): void {
    if (!this.selectedEmployeeId) {
      this.loadAllAttendance();
      return;
    }

    this.loading = true;
    this.api.getAttendance(this.selectedEmployeeId).subscribe({
      next: (data) => {
        this.attendanceRecords = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load attendance', err);
        this.loading = false;
      },
    });
  }

  getEmployeeName(empId: string): string {
    const emp = this.employees.find((e) => e.employee_id === empId);
    return emp ? emp.name : empId;
  }
}
