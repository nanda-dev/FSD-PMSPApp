import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { IProject } from './project';
import { ProjectService } from './project.service';

@Component({
  selector: 'pm-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
	projectForm: FormGroup;
	projects: IProject[];
	filteredProjects: IProject[];
	errorMessage: string;
	saveButtonLabel: string = 'Add';
	isEdit: boolean = false;
	
	_listFilter: string;
	get listFilter(): string {
		return this._listFilter;
	}
	set listFilter(value: string) {
		this._listFilter = value;
		this.filteredProjects = this.listFilter ? this.performFilter(this.listFilter) : this.projects;
	}

	constructor(private projSvc: ProjectService, 
				private fb: FormBuilder) { }

	ngOnInit() {
		this.projSvc.getProjects()
                .subscribe(projects => {
							this.projects = projects;
							this.filteredProjects = this.projects;
							},
                           error => this.errorMessage = <any>error);
		
		this.projectForm = this.fb.group({
			projectName: '',
			managerId: '',
			priority: '', 
			startDate: '', 
			endDate: '',
			id: ''
		});
	}
	
	performFilter(filterBy: string): IProject[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.projects.filter((project: IProject) =>
              (project.name.toLocaleLowerCase().indexOf(filterBy) !== -1) );
	}
	
	editProject(project: IProject): void {
		console.log('project.id=' + project.id);
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
		console.log('suspend project: ' + projectId);
	}
	
	resetForm(): void {
		this.projectForm.reset();
		this.saveButtonLabel = 'Add';
	}
	
	save(): void {
		console.log('Save Project:' + JSON.stringify(this.projectForm));//ToDo
		
	}

}
