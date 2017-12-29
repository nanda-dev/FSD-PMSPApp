import { NgModule } from '@angular/core';
//ngIf, ngFor structural directives
import { BrowserModule } from '@angular/platform-browser';
//ngModel - two way data binding
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
//httpClient injector
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { OrderModule } from 'ngx-order-pipe';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { ConvertToSpacesPipe } from './shared/convert-to-spaces.pipe';
import { StarComponent } from './shared/star.component';
import { WelcomeComponent } from './home/welcome.component';
import { UserDetailComponent } from './users/user-detail.component';
import { ProjectDetailComponent } from './projects/project-detail.component';
import { TaskDetailComponent } from './tasks/task-detail.component';
import { TaskAddEditComponent } from './tasks/task-add-edit.component';
import { UserService } from './users/user.service';
import { ProjectService } from './projects/project.service';
import { TaskService } from './tasks/task.service';

@NgModule({
  declarations: [
    AppComponent, 
	ConvertToSpacesPipe, 
	StarComponent, 
	WelcomeComponent,
	UserDetailComponent,
	ProjectDetailComponent,
	TaskDetailComponent,
	TaskAddEditComponent
  ],
  imports: [
    BrowserModule,
	FormsModule, 
	ReactiveFormsModule, 
	HttpClientModule, 
	HttpModule, 
	OrderModule,
	BsDatepickerModule.forRoot(), 
	ModalModule.forRoot(), 
	RouterModule.forRoot([
		{path: 'users', component: UserDetailComponent},
		{path: 'projects', component: ProjectDetailComponent},
		{path: 'taskupdate', component: TaskAddEditComponent},
		{path: 'taskupdate/:id', component: TaskAddEditComponent},
		
		{path: 'tasks', component: TaskDetailComponent},
		{path: 'welcome', component: WelcomeComponent},
		{path: '', redirectTo: 'welcome', pathMatch: 'full'},
		{path: '**', redirectTo: 'welcome', pathMatch: 'full'}
	])
  ],
  providers: [UserService, ProjectService, TaskService],
  bootstrap: [AppComponent]
})
export class AppModule { }
