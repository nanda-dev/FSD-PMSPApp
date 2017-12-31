import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  orderByKey: string;
  sortReverse: boolean = false;
  isEdit: boolean = false;
  
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
	  firstName: ['', [Validators.required, Validators.minLength(3)]],
	  lastName: ['', [Validators.required]],
	  id: ['',[Validators.required, Validators.pattern('[0-9]{6}')]]		  
	});
	
    this.refreshUserList();
	
	//control.setValidators([]);
	//control.clearValidators();
	//control.updateValueAndValidity();
  }
  
  sort(key): void {
	if(this.orderByKey == key){
		this.sortReverse = !this.sortReverse
	}
	this.orderByKey = key;
  }
  
  save(): void {
	  //console.log('Save UserForm...isEdit?' + this.isEdit);
	  //console.log('userForm = ' + JSON.stringify(this.userForm));
	  let u = Object.assign({}, this.user, this.userForm.value);
	  //console.log('user = ' + u.id + ',' + u.firstName + ',' + u.lastName);
	  
	  this.usrSvc.saveUser(u, this.isEdit)
				.subscribe(user => {
					//console.log('User Saved:' + user);
					this.resetForm();
					this.refreshUserList();																	
				},
				error => this.errorMessage = <any>error);
	  
  }
  
  editUser(user: IUser): void {
	//console.log('user.id=' + user.id);
	this.userForm.patchValue({
		firstName: user.firstName,
		lastName: user.lastName,
		id: user.id
	});
	
	this.isEdit = true;
	
  }
  
  deleteUser(id: number) {
	  //console.log('Delete user id: ' + id);
	  this.usrSvc.deleteUser(id)
				.subscribe(user => {
								//console.log('User deleted:' + (user ? user ['id'] : 'undefined'));
								this.refreshUserList();
							},
						   error => this.errorMessage = <any>error);
  }
  
  performFilter(filterBy: string): IUser[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.users.filter((user: IUser) =>
              (user.firstName.toLocaleLowerCase().indexOf(filterBy) !== -1) 
				|| (user.lastName.toLocaleLowerCase().indexOf(filterBy) !== -1));
  }
  
  resetForm(): void {
		this.userForm.reset();
		this.isEdit = false;		
  }
  
  refreshUserList(): void {
		this.usrSvc.getUsers()
			.subscribe(users => {
						this.users = users;
						this.filteredUsers = this.users;
					},
					error => this.errorMessage = <any>error);
  }
  

}
