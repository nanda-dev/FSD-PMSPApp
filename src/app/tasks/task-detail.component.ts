import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ITask } from './task';
import { TaskService } from './task.service';

import { IProject } from '../projects/project';
import { ProjectService } from '../projects/project.service';

@Component({
  selector: 'pm-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
	tasks: ITask[];
	errorMessage: string;
	modalRef: BsModalRef;
	projects: IProject[];
	projectId: string;
	selectedProj: IProject;
	
	orderByKey: string;
	sortReverse: boolean = false;
	
	taskIdToEnd: number;
	
	constructor(private taskSvc: TaskService, 
				private projSvc: ProjectService, 
				private modalService: BsModalService, 
				private _router: Router) { }

	ngOnInit() {
		/*this.taskSvc.getTasks()
                .subscribe(tasks => this.tasks = tasks,
                           error => this.errorMessage = <any>error);*/
		this.projSvc.getProjects()
                .subscribe(projects => {
							this.projects = projects;							
							},
                           error => this.errorMessage = <any>error);
	}
	
	editTask(taskId: number): void {
		//console.log('Edit Task: ' + taskId);
		this._router.navigate(['/taskupdate/' + taskId]);
	}
	
	endTask(taskId: number, template: TemplateRef<any>): void {
		//console.log('End Task: ' + taskId);
		this.taskIdToEnd = taskId;
		this.showModalPopUp(template);		
	}	
	
	showModalPopUp(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}
	
	selectProject(proj: IProject): void {
		//console.log(proj);
		this.selectedProj = proj;
	}
	
	closePopUp(): void {
		//console.log('selectedProj==' + this.selectedProj);
		if(this.selectedProj){
			this.projectId = '' + this.selectedProj.id;
			this.refreshTaskList();
		}
		//modalRef.hide()
		this.modalRef.hide();
	}
	
	refreshTaskList(): void {
		this.taskSvc.getTasksByProject(this.selectedProj.id)
                .subscribe(tasks => {										
										this.tasks = tasks;
										//console.log('tasksByProj=' + JSON.stringify(this.tasks));
									},
                           error => this.errorMessage = <any>error);
	}
	
	sort(key): void {
		if(this.orderByKey == key){
			this.sortReverse = !this.sortReverse
		}
		this.orderByKey = key;
	}
	
	confirm(): void {
		this.confirmEndTask();
		this.modalRef.hide();
	}
	decline(): void {
		this.modalRef.hide();
	}
	confirmEndTask(): void {
		this.taskSvc.endTask(this.taskIdToEnd)
				.subscribe(task => {
					//console.log('Task ended:' + JSON.stringify(task));
					this.taskIdToEnd = undefined;
					this.refreshTaskList();					
				}, error => this.errorMessage = <any>error);
	}

}
