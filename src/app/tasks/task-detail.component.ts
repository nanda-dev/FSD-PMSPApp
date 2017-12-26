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
	
	constructor(private taskSvc: TaskService, 
				private projSvc: ProjectService, 
				private modalService: BsModalService, 
				private _router: Router) { }

	ngOnInit() {
		this.taskSvc.getTasks()
                .subscribe(tasks => this.tasks = tasks,
                           error => this.errorMessage = <any>error);
		this.projSvc.getProjects()
                .subscribe(projects => {
							this.projects = projects;							
							},
                           error => this.errorMessage = <any>error);
	}
	
	editTask(taskId: number): void {
		console.log('Edit Task: ' + taskId);
		this._router.navigate(['/taskupdate/' + taskId]);
	}
	
	endTask(taskId: number): void {
		console.log('End Task: ' + taskId);
	}	
	
	showModalPopUp(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}
	
	selectProject(proj: IProject): void {
		console.log(proj);
		this.selectedProj = proj;
	}
	
	closePopUp(): void {
		console.log('selectedProj==' + this.selectedProj);
		if(this.selectedProj){
			this.projectId = '' + this.selectedProj.id;
			this.taskSvc.getTasks()
                .subscribe(tasks => {
										this.tasks = tasks.filter( (task: ITask) => task.projectId === this.selectedProj.id);
										console.log('tasksByProj='+JSON.stringify(this.tasks));
									},
                           error => this.errorMessage = <any>error);
		}
		//modalRef.hide()
		this.modalRef.hide();
	}

}
