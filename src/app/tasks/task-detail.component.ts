import { Component, OnInit, TemplateRef } from '@angular/core';
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
	
	constructor(private taskSvc: TaskService, 
				private projSvc: ProjectService, 
				private modalService: BsModalService) { }

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
	}
	
	endTask(taskId: number): void {
		console.log('End Task: ' + taskId);
	}	
	
	showModalPopUp(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template);
	}
	
	selectProject(proj: any): void {
		console.log(proj);
		this.projectId = proj.id;
	}

}
