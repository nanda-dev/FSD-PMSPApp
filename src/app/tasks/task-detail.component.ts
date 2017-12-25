import { Component, OnInit } from '@angular/core';

import { ITask } from './task';
import { TaskService } from './task.service';

@Component({
  selector: 'pm-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {
	tasks: ITask[];
	errorMessage: string;

	constructor(private taskSvc: TaskService) { }

	ngOnInit() {
		this.taskSvc.getTasks()
                .subscribe(tasks => this.tasks = tasks,
                           error => this.errorMessage = <any>error);
	}
	
	editTask(taskId: number): void {
		console.log('Edit Task: ' + taskId);
	}
	
	endTask(taskId: number): void {
		console.log('End Task: ' + taskId);
	}
	
	popUpSelectProject(): void {
		
	}

}
