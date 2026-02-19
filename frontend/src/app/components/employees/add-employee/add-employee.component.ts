import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css',
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  loading = false;
  error = '';
  success = '';
  isEditMode = false;
  employeeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      employee_id: ['', Validators.required],
      department: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.loadEmployee(this.employeeId);
    }
  }

  loadEmployee(id: string): void {
    this.loading = true;
    this.api.getEmployee(id).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue(employee);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load employee details.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    const employeeData = this.employeeForm.value;

    if (this.isEditMode && this.employeeId) {
      this.api.updateEmployee(this.employeeId, employeeData).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Employee updated successfully!';
          setTimeout(() => this.router.navigate(['/employees']), 1500);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Failed to update employee. Please try again.';
          console.error(err);
        },
      });
    } else {
      this.api.addEmployee(employeeData).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Employee added successfully!';
          setTimeout(() => this.router.navigate(['/employees']), 1500);
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 400) {
            this.error = 'Employee ID already exists.';
          } else {
            this.error = 'Failed to add employee. Please try again.';
          }
          console.error(err);
        },
      });
    }
  }
}
