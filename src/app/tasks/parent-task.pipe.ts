import { Pipe, PipeTransform, OnInit } from '@angular/core';

import { TaskService } from './task.service';

import { ITask } from './task';

@Pipe({
	name: 'parentTaskName'
})
export class ParentTaskPipe implements PipeTransform {
	
	transform(taskId: string, tasks: ITask[]): string {
		//debugger;
		if(taskId) {
			
			let id = +taskId;
			
			for(let t of tasks){
				if(id == t.id){
					return t.name;
				}
			}			
			
		}
		
		return '-';
	}	
	
}