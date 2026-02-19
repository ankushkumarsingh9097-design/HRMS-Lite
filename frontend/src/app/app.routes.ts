import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employees/employee-list/employee-list.component';
import { AddEmployeeComponent } from './components/employees/add-employee/add-employee.component';
import { AttendanceViewComponent } from './components/attendance/attendance-view/attendance-view.component';
import { MarkAttendanceComponent } from './components/attendance/mark-attendance/mark-attendance.component';

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'employees/add', component: AddEmployeeComponent },
  { path: 'employees/edit/:id', component: AddEmployeeComponent },
  { path: 'attendance', component: AttendanceViewComponent },
  { path: 'attendance/mark', component: MarkAttendanceComponent },
];
