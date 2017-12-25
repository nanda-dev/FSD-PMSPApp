import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { ITask } from './task';
import { TaskService } from './task.service';

@Component({
  selector: 'pm-task-add-edit',
  templateUrl: './task-add-edit.component.html',
  styleUrls: ['./task-add-edit.component.css']
})
export class TaskAddEditComponent implements OnInit {
	taskForm: FormGroup;
	tasks: ITask[];	
	errorMessage: string;
	saveButtonLabel: string = 'Add Task';

	constructor(private fb: FormBuilder,
				private taskSvc: TaskService) { }

	ngOnInit() {
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
	}
	
	save(): void {
		console.log('Save Task:' + JSON.stringify(this.taskForm));//ToDo		
	}
	
	popUpSelectProject(): void {
		//ToDo
	}
	
	resetForm(): void {
		this.taskForm.reset();
		this.saveButtonLabel = 'Add Task';		
	}

}
