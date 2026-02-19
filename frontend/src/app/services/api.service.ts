import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Employee {
  _id?: string;
  employee_id: string;
  name: string;
  email: string;
  department: string;
  created_at?: string;
}

export interface Attendance {
  _id?: string;
  employee_id: string;
  date: string;
  status: 'Present' | 'Absent';
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Employees
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees/`);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/employees/`, employee);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/employees/${id}`);
  }

  getEmployee(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/employees/${id}`);
  }

  updateEmployee(id: string, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/employees/${id}`, employee);
  }

  // Attendance
  markAttendance(attendance: Attendance): Observable<Attendance> {
    return this.http.post<Attendance>(`${this.apiUrl}/attendance/`, attendance);
  }

  getAllAttendance(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/attendance/`);
  }

  getAttendance(employeeId: string): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/attendance/${employeeId}`);
  }
}
