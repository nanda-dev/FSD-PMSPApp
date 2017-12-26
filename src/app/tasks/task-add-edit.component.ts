import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ITask } from './task';
import { IProject } from '../projects/project';
import { IUser } from '../users/user';
import { TaskService } from './task.service';
import { ProjectService } from '../projects/project.service';
import { UserService } from '../users/user.service';

@Component({
  selector: 'pm-task-add-edit',
  templateUrl: './task-add-edit.component.html',
  styleUrls: ['./task-add-edit.component.css']
})
export class TaskAddEditComponent implements OnInit {
	taskForm: FormGroup;
		
	errorMessage: string;
	saveButtonLabel: string = 'Add Task';
	modalRef: BsModalRef;
	
	projects: IProject[];
	filteredProjects: IProject[];
	
	users: IUser[];
	filteredUsers: IUser[];
	
	tasks: ITask[];
	filteredTasks: ITask[];	
	
	paramId: number;
	
	_projectsFilter: string;
	get projectsFilter(): string {
		return this._projectsFilter;
	}
	set projectsFilter(value: string) {
		this._projectsFilter = value;
		this.filteredProjects = this.projectsFilter ? this.performFilterProjects(this.projectsFilter) : this.projects;
	}
	
	_usersFilter: string;
	get usersFilter(): string {
		return this._usersFilter;
	}
	set usersFilter(value: string) {
		this._usersFilter = value;
		this.filteredUsers = this.usersFilter ? this.performFilterUsers(this.usersFilter) : this.users;
	}
	
	_tasksFilter: string;
	get tasksFilter(): string {
		return this._tasksFilter;
	}
	set tasksFilter(value: string) {
		this._tasksFilter = value;
		this.filteredTasks = this.tasksFilter ? this.performFilterTasks(this.tasksFilter) : this.tasks;
	}

	constructor(private fb: FormBuilder,
				private taskSvc: TaskService, 
				private usrSvc: UserService, 
				private projSvc: ProjectService, 
				private modalService: BsModalService, 
				private _route: ActivatedRoute) { }

	ngOnInit() {
		
		
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
		this.taskSvc.getTasks()
                .subscribe(tasks => {
								this.tasks = tasks;
								this.filteredTasks = this.tasks;
							},
                           error => this.errorMessage = <any>error);
						   
		const param = +this._route.snapshot.paramMap.get('id');
		
		this._route.params.subscribe(params => this.paramId = params['id']);
		
		this.taskForm = this.fb.group({
			taskName: '',
			projectId: '',
			isParent: false,
			parentTaskId: '',
			userId: '',
			priority: '', 
			startDate: '', 
			endDate: '',
			id: ''
		});
		
		//if pathParam indicates update screen is to be used,
		//call appropriate method to set the button label, etc.
		if(!(this.paramId == undefined || isNaN(this.paramId))) {
			//Edit Task
			console.log('param=' + param + ', this.paramId=' + this.paramId);
			this.saveButtonLabel = 'Update Task';
		}
		else {
			//New Task
			console.log('param=' + param + ', this.paramId=' + this.paramId);			
		}
	}
	
	performFilterProjects(filterBy: string): IProject[] {
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
	
	performFilterTasks(filterBy: string): ITask[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.tasks.filter((task: ITask) =>
              (task.name.toLocaleLowerCase().indexOf(filterBy) !== -1) );
	}
	
	save(): void {
		console.log('Save Task:' + JSON.stringify(this.taskForm));//ToDo		
	}
	
	resetForm(): void {
		this.taskForm.reset();
		this.saveButtonLabel = 'Add Task';		
	}
	
	showModalPopUp(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}
	
	selectUser(user: any): void {
		console.log(user);
		this.taskForm.patchValue({userId: user.id});
	}
	
	selectTask(task: any): void {
		console.log(task);
		this.taskForm.patchValue({parentTaskId: task.id});
	}
	
	selectProject(proj: any): void {
		console.log(proj);
		this.taskForm.patchValue({projectId: proj.id});
	}

}
