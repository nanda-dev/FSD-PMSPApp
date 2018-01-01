import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
	startDateInitial: any;
	endDateInitial: any;
		
	errorMessage: string;
	saveButtonLabel: string = 'Add Task';
	modalRef: BsModalRef;
	
	projects: IProject[];
	filteredProjects: IProject[];
	selectedProj: IProject;
	
	users: IUser[];
	filteredUsers: IUser[];
	selectedUser: IUser;
	
	tasks: ITask[];
	filteredTasks: ITask[];	
	selectedTask: ITask;
	
	paramId: number;
	task: ITask;
	
	isEdit: boolean = false;
	hasStartDate: boolean = false;
	isParentTask: boolean = false;
	
	bsConfig: Partial<BsDatepickerConfig>;
	
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
		//Set theme for date-picker
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
		
		//Get tasks after selecting the project.
		/*this.taskSvc.getTasks()
                .subscribe(tasks => {
								this.tasks = tasks;
								this.filteredTasks = this.tasks;
							},
                           error => this.errorMessage = <any>error);*/
						   
		//const param = +this._route.snapshot.paramMap.get('id');
		
		this._route.params.subscribe(params => this.paramId = params['id']);
		
		this.taskForm = this.fb.group({
			name: ['', [Validators.required, Validators.minLength(3)]],
			projectId: [undefined, Validators.required], 
			isParent: false,
			parentTaskId: undefined, 
			userId: [undefined, Validators.required], 
			priority: undefined, 
			startDate: [new Date(), Validators.required], 
			endDate: [null, Validators.required], 
			id: undefined
		});
		
		//if pathParam indicates update screen is to be used,
		//call appropriate method to set the button label, etc.
		if(!(this.paramId == undefined || isNaN(this.paramId))) {
			//Edit Task
			//console.log('param=' + param + ', this.paramId=' + this.paramId);
			//console.log('(Edit Task) this.paramId=' + this.paramId);			
			this.isEdit = true;
			this.saveButtonLabel = 'Update Task';
			this.taskSvc.getTask(this.paramId)
                .subscribe(task => {
								this.task = task;
								this.startDateInitial = new Date(task.startDate);
								this.endDateInitial = new Date(task.endDate);
								//console.log('this.task.name=' + this.task.name);
								//console.log('this.task.projectId=' + this.task.projectId);
								this.taskForm.patchValue({
									projectId: this.task.projectId,
									name: this.task.name,
									priority: this.task.priority,
									isParent: (this.task.parentTaskId ? false : true), 
									parentTaskId: this.task.parentTaskId, 
									userId: this.task.userId,
									id: this.task.id
								});
							},
                           error => this.errorMessage = <any>error);
			
			this.disableControlsForEdit();
		}
		else {
			//New Task
			//console.log('param=' + param + ', this.paramId=' + this.paramId);
			//console.log('(New Task) this.paramId=' + this.paramId);
			this.isEdit = false;
			
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
		//console.log('Save Task:' + JSON.stringify(this.taskForm));//ToDo	
		let t = Object.assign({}, this.task, this.taskForm.value);
		//console.log('Save Task: ' + JSON.stringify(t));
		this.taskSvc.saveTask(t, this.isEdit)
				.subscribe(task => {
					//console.log('Task saved:' + JSON.stringify(task));
					this.resetForm();
				}, error => this.errorMessage = <any>error);
	}
	
	disableControlsForEdit(): void {
		this.taskForm.controls['isParent'].disable();
		//this.taskForm.controls['projectId'].disable();		
	}
	
	resetForm(): void {
		this.taskForm.reset();
		this.saveButtonLabel = 'Add Task';		
		this.isEdit = false;
	}
	
	showModalPopUp(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}
	
	selectUser(): void {
		//console.log(user);
		//this.taskForm.patchValue({userId: user.id});
	}
	
	selectTask(): void {
		//console.log(task);
		//this.taskForm.patchValue({parentTaskId: task.id});
	}
	
	selectProject(): void {
		//console.log(JSON.stringify(this.selectedProj));
		//this.taskForm.patchValue({projectId: proj.id});
	}	
	
	closeUserPopUp(): void {
		//console.log('selectedUser=' + JSON.stringify(this.selectedUser));		
		if(this.selectedUser){
			this.taskForm.patchValue({userId: this.selectedUser.id});			
		}
		this.modalRef.hide();
	}
	
	closeTaskPopUp(): void {
		//console.log('selectedTask=' + JSON.stringify(this.selectedTask));		
		if(this.selectedTask){
			this.taskForm.patchValue({parentTaskId: this.selectedTask.id});			
		}
		this.modalRef.hide();
	}
	
	closeProjectPopUp(): void {
		//console.log('selectedProj=' + JSON.stringify(this.selectedProj));		
		if(this.selectedProj){
			this.taskForm.patchValue({ projectId: this.selectedProj.id, parentTaskId: null });
			this.taskSvc.getTasksByProject(this.selectedProj.id)
                .subscribe(tasks => {
										//Filter Parent tasks (move it to new API?):
										this.tasks = tasks.filter( (task: ITask) => !task.parentTaskId );
										this.filteredTasks = this.tasks;
										//console.log('parentTasksByProj=' + JSON.stringify(this.tasks));
									},
                           error => this.errorMessage = <any>error);
		}
		this.modalRef.hide();
	}
	
	changeStartDate(startDate: any): void {
		const endDateCtrl = this.taskForm.controls['endDate'];
		let endDateVal = new Date();
		endDateVal.setDate(endDateCtrl.value);
		if (!!startDate) {
			if(!!endDateVal){
				endDateVal = (startDate.getTime() > endDateVal.getTime()) ? null : endDateVal;
			}
			endDateCtrl.reset({ value: endDateVal, disabled: false });
		} else {
			endDateCtrl.reset({ value: null, disabled: true });
		}
		
		/*this.hasStartDate = this.taskForm.controls['startDate'].value ? true : false;
		if(this.hasStartDate){
			this.taskForm.controls['endDate'].enable();
		}
		else {
			this.taskForm.controls['endDate'].disable();
		}*/
			
	}
	
	changeEndDate(endDate: any): void {
	}
	
	toggleParentTask(): void {
		this.isParentTask = !this.isParentTask;
		if(this.isParentTask) {
			this.disableNonParentFields();
		}
		else{
			this.enableNonParentFields();
		}
	}

	disableNonParentFields(): void {
		this.taskForm.patchValue({
			userId: '',
			priority: undefined,
			startDate: null, 
			endDate: null
		});
		
		this.taskForm.controls.userId.clearValidators();		
		this.taskForm.controls.userId.updateValueAndValidity();
		this.taskForm.controls.userId.disable();
		
		this.taskForm.controls.priority.disable();
		
		this.taskForm.controls.startDate.clearValidators();
		this.taskForm.controls.startDate.updateValueAndValidity();
		this.taskForm.controls.startDate.disable();
		
		this.taskForm.controls.endDate.clearValidators();
		this.taskForm.controls.endDate.updateValueAndValidity();
		this.taskForm.controls.endDate.disable();		
	}
	
	enableNonParentFields(): void {
		this.taskForm.controls.userId.setValidators(Validators.required);		
		//this.taskForm.controls.userId.updateValueAndValidity();
		this.taskForm.controls.userId.enable();
		
		this.taskForm.controls.priority.enable();
		
		this.taskForm.controls.startDate.setValidators(Validators.required);
		//this.taskForm.controls.startDate.updateValueAndValidity();
		this.taskForm.controls.startDate.enable();
		
		this.taskForm.controls.endDate.setValidators(Validators.required);
		//this.taskForm.controls.endDate.updateValueAndValidity();
		this.taskForm.controls.endDate.disable();
		
		/*this.taskForm.patchValue({
			userId: ['', Validators.required],
			startDate: [new Date(), Validators.required], 
			endDate: [(new Date()).setDate((new Date()).getDate()+1), Validators.required]
		});*/
		
		this.taskForm.patchValue({
			userId: '',
			startDate: new Date(), 
			endDate: (new Date()).setDate((new Date()).getDate()+1)
		});
				
	}
}
