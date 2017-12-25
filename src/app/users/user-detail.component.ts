import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { IUser } from './user';
import { UserService } from './user.service';

@Component({
  selector: 'pm-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  userForm: FormGroup;
  users: IUser[];
  filteredUsers: IUser[];
  saveButtonLabel: string = 'Add';
  errorMessage: string;
  
  _listFilter: string;
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
  	this._listFilter = value;
	this.filteredUsers = this.listFilter ? this.performFilter(this.listFilter) : this.users;
  }

  constructor(private fb: FormBuilder, 
				private usrSvc: UserService) { }

  ngOnInit(): void {
	this.userForm = this.fb.group({
	  firstName: '',
	  lastName: '',
	  empId: ''		  
	});
	
    this.usrSvc.getUsers()
                .subscribe(users => {
							this.users = users;
							this.filteredUsers = this.users;
							},
                           error => this.errorMessage = <any>error);
  }
  
  save(): void {
	  console.log('Save UserForm...');
	  console.log('userForm = ' + JSON.stringify(this.userForm));
  }
  
  editUser(user: IUser): void {
	console.log('user.id=' + user.id);
	this.userForm.patchValue({
		firstName: user.firstName,
		lastName: user.lastName,
		empId: user.id
	});
	
	this.saveButtonLabel = 'Update';
	
  }
  
  performFilter(filterBy: string): IUser[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.users.filter((user: IUser) =>
              (user.firstName.toLocaleLowerCase().indexOf(filterBy) !== -1) || (user.lastName.toLocaleLowerCase().indexOf(filterBy) !== -1));
  }
  
  resetForm(): void {
		this.userForm.reset();
		this.saveButtonLabel = 'Add';
  }
  

}
