import { Component, OnInit, TemplateRef  } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { IProject } from './project';
import { IUser } from '../users/user';
import { ProjectService } from './project.service';
import { UserService } from '../users/user.service';

@Component({
  selector: 'pm-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
	bsConfig: Partial<BsDatepickerConfig>;
	modalRef: BsModalRef;
	projectForm: FormGroup;
	projects: IProject[];
	filteredProjects: IProject[];
	errorMessage: string;
	saveButtonLabel: string = 'Add';
	managerId: number;
	isEdit: boolean = false;
	users: IUser[];
	filteredUsers: IUser[];
	
	_listFilter: string;
	get listFilter(): string {
		return this._listFilter;
	}
	set listFilter(value: string) {
		this._listFilter = value;
		this.filteredProjects = this.listFilter ? this.performFilter(this.listFilter) : this.projects;
	}
	
	_usersFilter: string;
	get usersFilter(): string {
		return this._usersFilter;
	}
	set usersFilter(value: string) {
		this._usersFilter = value;
		this.filteredUsers = this.usersFilter ? this.performFilterUsers(this.usersFilter) : this.users;
	}

	constructor(private projSvc: ProjectService, 
				private fb: FormBuilder,
				private modalService: BsModalService, 
				private usrSvc: UserService) { }
				
	
	
	test() {
			alert('test');
	}

	ngOnInit() {
		this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue'});
		this.projSvc.getProjects()
                .subscribe(projects => {
							this.projects = projects;
							this.filteredProjects = this.projects;
							},
                           error => this.errorMessage = <any>error);
		this.usrSvc.getUsers()
                .subscribe(users => {
							this.users = users;
							this.filteredUsers = this.users;
							},
                           error => this.errorMessage = <any>error);
		
		this.projectForm = this.fb.group({
			projectName: '',
			managerId: '',
			priority: '', 
			hasDate: false, 
			date: [], 
			id: ''
		});
	}
	
	performFilter(filterBy: string): IProject[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.projects.filter((project: IProject) =>
              (project.name.toLocaleLowerCase().indexOf(filterBy) !== -1) );
	}
	
	performFilterUsers(filterBy: string): IUser[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.users.filter((user: IUser) =>
              (user.firstName.toLocaleLowerCase().indexOf(filterBy) !== -1) 
			  || (user.lastName.toLocaleLowerCase().indexOf(filterBy) !== -1));
	}
	
	editProject(project: IProject): void {
		//console.log('edit project.id=' + project.id);
		this.projectForm.patchValue({
			projectName: project.name,
			managerId: project.managerId,
			priority: project.priority, 
			startDate: project.startDate, 
			endDate: project.endDate,
			id: project.id
		});	
		
		this.saveButtonLabel = 'Update';
	}
	
	suspendProject(projectId: number): void {
		//console.log('suspend project: ' + projectId);
	}
	
	resetForm(): void {
		this.projectForm.reset();
		this.saveButtonLabel = 'Add';
	}
	
	save(): void {
		//console.log('Save Project:' + JSON.stringify(this.projectForm));//ToDo
		
	}
	check(): void {
		//console.log(this.projectForm.controls['hasDate'].value);
		if(this.projectForm.controls['hasDate'].value){
			this.projectForm.controls['date'].disable();				
		}
		else {
			this.projectForm.controls['date'].enable();				
		}
	}
	
	showManagerModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}
	
	selectUser(user: any): void {
		console.log(user);
		this.projectForm.patchValue({managerId: user.id});
	}

}
