import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeapiService } from '../../services/employeeapi.service';
import {  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from 'src/app/core/core.service';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss']
})
export class EmpAddEditComponent implements OnInit {

  empForm: FormGroup

  education: string[] = [
    'Masters',
    'Bachelors',
    'Diploma',
    'Intermediate'
  ]
  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeapiService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _notify: CoreService

    ){
    this.empForm = this._fb.group({
      firstName: '',
      lastName:  '',
      email: '',
      dob: '',
      gender: '',
      experience: '',
      education: '',
      company: '',
      package: ''
    })
  }
  message: string = '';
  action: string = '';

  ngOnInit(): void {
    this.empForm.patchValue(this.data)
  }


  onFormSubmit() {
    if (this.empForm.valid) {
      if (this.data) {
        this._empService
          .updateEmployee(this.data.id, this.empForm.value)
          .subscribe({
            next: (val: any) => {
              this._notify.openSnackBar('Employee detail updated!', 'Okay');
              this._dialogRef.close(true);
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this._empService.addEmployee(this.empForm.value).subscribe({
          next: (val: any) => {
            this._notify.openSnackBar('Employee added successfully', 'Okay');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }

}
