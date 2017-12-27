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
  user: IUser;
  
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
	  id: ''		  
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
	  //console.log('userForm = ' + JSON.stringify(this.userForm));
	  let t = [this.user];
	  
	  let u = Object.assign({}, this.user, this.userForm.value);
	  console.log('user = ' + u.id + ',' + u.firstName + ',' + u.lastName);
	  this.usrSvc.saveUser(u).subscribe(user => {
													console.log('User Saved:' + user);
													this.usrSvc.getUsers()
																.subscribe(users => {
																			this.users = users;
																			this.filteredUsers = this.users;
																			},
																		   error => this.errorMessage = <any>error);
													
												},
										error => this.errorMessage = <any>error);
  }
  
  editUser(user: IUser): void {
	console.log('user.id=' + user.id);
	this.userForm.patchValue({
		firstName: user.firstName,
		lastName: user.lastName,
		id: user.id
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
