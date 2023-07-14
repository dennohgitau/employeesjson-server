import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './components/emp-add-edit/emp-add-edit.component';
import { EmployeeapiService } from './services/employeeapi.service';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { CoreService } from './core/core.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  displayedColumns: string[] = ['id',
  'firstName',
  'lastName',
  'email',
  'dob',
  'gender',
  'education',
  'company',
  'experience',
  'package',
  'action'
];
  message: string = '';
  action: string = '';

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  constructor(private _dialog: MatDialog, private _empservice: EmployeeapiService, private _notify: CoreService){  }

  ngOnInit(): void {
    this.getEmployeeList()
  }

  openAddEditForm(){
    const dialogRef = this._dialog.open(EmpAddEditComponent)
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList()
        }
      }
    })
  }

  getEmployeeList(){
    this._empservice.getEmployeeList().subscribe({
      next:(res ) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

      },
      error: (err: any) =>{
        this.message = 'Error'
        this.action = '';
        this._notify.openSnackBar(this.message, this.action)
      }
    })
  }

  deleteEmployee(id: number){
    this._empservice.deleteEmployee(id).subscribe({
      next: (res) => {
        this.message = 'Employee deleted!'
        this.action = 'Okay'
        this._notify.openSnackBar(this.message, this.action)
        this.getEmployeeList();
      },
      error: (err: any) =>{
        this.message = 'Error'
        this.action = '';
        this._notify.openSnackBar(this.message, this.action)
      }
    })
  }


  openEditForm(data: any){
     const dialogRef = this._dialog.open(EmpAddEditComponent, {
      data,
     });
     dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList()
        }
      }
    })

  }
}
