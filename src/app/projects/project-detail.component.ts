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
	project: IProject;
	
	projects: IProject[];
	filteredProjects: IProject[];
	
	errorMessage: string;
	
	saveButtonLabel: string = 'Add';
	isEdit: boolean = false;
	
	managerId: number;
	selectedUser: IUser;
	
	orderByKey: string;
	sortReverse: boolean = false;
	
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
	
	minDate: Date;
	startDateInitial: Date;
	endDateInitial: Date;
	dateRangeInit: Date[];

	constructor(private projSvc: ProjectService, 
				private fb: FormBuilder,
				private modalService: BsModalService, 
				private usrSvc: UserService) { 
				
	
		//Sample minDate to set in datePicker		
		this.minDate = new Date();
		this.minDate.setDate(this.minDate.getDate() - 7);
	}	
	
	ngOnInit() {
		//Set theme for date-picker
		this.bsConfig = Object.assign({}, { containerClass: 'theme-dark-blue'});
		
		this.refreshProjectList();
		
		this.usrSvc.getUsers()
                .subscribe(users => {
							this.users = users;
							this.filteredUsers = this.users;
							},
                           error => this.errorMessage = <any>error);
		
		this.projectForm = this.fb.group({
			name: '',
			managerId: {value: '', disabled: true},
			priority: '', 
			setDates: false, 
			dateRange: {value: [], disabled: true}, 
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
		this.project = project;
		this.projectForm.patchValue({
			name: project.name,
			managerId: project.managerId,
			priority: project.priority, 
			dateRange: {value: [Date.parse(project.startDate), Date.parse(project.endDate)], disabled: project.startDate ? true : false},//need to check this initialization
			setDates: project.startDate ? true : false,
			id: project.id
		});	
		
		//unable to enable/disable control in patchValue, hence this workaround is used.
		if(project.startDate){
			this.projectForm.controls['dateRange'].enable();
		}
		
		this.startDateInitial = new Date(project.startDate);
		this.endDateInitial = new Date(project.endDate);
		this.dateRangeInit = [this.startDateInitial, this.endDateInitial];
		
		this.saveButtonLabel = 'Update';
		this.isEdit = true;
	}	
	
	resetForm(): void {
		this.projectForm.reset();
		this.saveButtonLabel = 'Add';
		this.isEdit = false;
	}
	
	refreshProjectList(): void {
		this.projSvc.getProjects()
                .subscribe(projects => {
							this.projects = projects;
							this.filteredProjects = this.projects;
							},
                           error => this.errorMessage = <any>error);
	}
	
	save(): void {
		console.log('date1=' + this.projectForm.controls['dateRange'].value[0].toISOString());
		//let d = new Date();
		//d.setDate(Date.parse(this.projectForm.controls['dateRange'].value[0].toISOString().replace('T',' ').replace('Z', '')));
		//console.log('d=' + d);
		
		console.log('date2=' + this.projectForm.controls['dateRange'].value[1].toISOString());
		console.log('setDates=' + this.projectForm.controls['setDates'].value);
		
		
		let p = Object.assign({}, this.project, this.projectForm.value);
		p.startDate = this.projectForm.controls['dateRange'].value[0].toISOString();
		p.endDate = this.projectForm.controls['dateRange'].value[1].toISOString();
		
		console.log('managerId=' + this.projectForm.controls['managerId'].value);
		//There seems to be some issues when assigning managerId value from form to IProject object.
		//Could be because the field is disabled in template? Hence using this workaround for now.		
		p.managerId = this.projectForm.controls['managerId'].value;
		
		console.log('saveProject:' + JSON.stringify(p));
		
		this.projSvc.saveProject(p, this.isEdit)
					.subscribe(proj => {
							console.log('Proj saved:' + JSON.stringify(proj));
							this.resetForm();
							this.refreshProjectList();
						},
						error => this.errorMessage = <any>error);
		
	}
	
	suspendProject(projectId: number): void {
		console.log('suspend project: ' + projectId);
		this.projSvc.suspendProject(projectId)
					.subscribe(proj => {
							console.log('Proj suspendedd:' + JSON.stringify(proj));
							this.resetForm();
							this.refreshProjectList();
						},
						error => this.errorMessage = <any>error);
	}
	
	toggleSetDates(): void {
		//console.log(this.projectForm.controls['setDates'].value);
		if(!this.projectForm.controls['setDates'].value){
			this.projectForm.controls['dateRange'].disable();				
		}
		else {
			this.projectForm.controls['dateRange'].enable();				
		}
	}
	
	showManagerModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}
	
	selectUser(): void {
		/*console.log('Selected Manager:' + JSON.stringify(user));
		this.managerId = user.id;
		this.projectForm.patchValue({managerId: user.id});*/
	}
	
	closeUserPopUp(): void {
		console.log('selectedUser=' + JSON.stringify(this.selectedUser));		
		if(this.selectedUser){
			this.projectForm.patchValue({managerId: this.selectedUser.id});			
		}
		this.modalRef.hide();
	}
	
	sort(key): void {
		if(this.orderByKey == key){
			this.sortReverse = !this.sortReverse
		}
		this.orderByKey = key;
	}

}
