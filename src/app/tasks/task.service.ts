import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/find';
import 'rxjs/add/observable/of';

import { ITask } from './task';

@Injectable()
export class TaskService {
    private baseUrl = 'http://localhost:8085/api/task';
	private _taskUrl = './api/tasks.json';

    constructor(private http: Http) { }

    getTasks(): Observable<ITask[]> {
        return this.http.get(this._taskUrl)
            .map((response: Response) => <ITask[]>response.json())
            .do(data => console.log('getTasks: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }
	
	getTasksByProject(projectId: number): Observable<ITask[]> {
		const url = `${this.baseUrl}/project/${projectId}`;
        return this.http.get(url)
            .map((response: Response) => <ITask[]>response.json())
            .do(data => console.log('getTasks: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getTask(id: number): Observable<ITask> {
		console.log('GETTASK:' + id);
        if (id === undefined || id === 0) {
			return Observable.of(this.initializeTask());
        // return Observable.create((observer: any) => {
        //     observer.next(this.initializeProduct());
        //     observer.complete();
        // });
        };
        const url = `${this.baseUrl}/${id}`;
        return this.http.get(url)
            .map((response: Response) => <ITask>response.json())
            .do(data => console.log('getTaskById: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }
	
	

    deleteTask(id: number): Observable<Response> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        const url = `${this.baseUrl}/${id}`;
        return this.http.delete(url, options)
            .do(data => console.log('deleteProduct: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    saveTask(task: ITask, isEdit: boolean): Observable<ITask> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        if (!isEdit) {
            return this.createTask(task, options);
        }
        return this.updateTask(task, options);
    }

    private createTask(task: ITask, options: RequestOptions): Observable<ITask> {
        task.id = undefined;
        return this.http.post(this.baseUrl, task, options)
            .map(this.extractData)
            .do(data => console.log('createTask: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    private updateTask(task: ITask, options: RequestOptions): Observable<ITask> {
        const url = `${this.baseUrl}/${task.id}`;
        return this.http.put(this.baseUrl, task, options)
            .map(() => task)
            .do(data => console.log('updateTask: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }
	
	endTask(taskId: number): Observable<ITask> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
		let task = null;
        const url = `${this.baseUrl}/${taskId}`;
        return this.http.put(url, {}, options)
            .map(() => task)
            .do(data => console.log('endTask: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    private extractData(response: Response) {
        let body = response.json();
        return body.data || {};
    }

    private handleError(error: Response): Observable<any> {
        console.error(error);//ToDo
        return Observable.throw(error.json().error || 'Server error');
    }

    initializeTask(): ITask {
        // Return an initialized object
        return {
            id: undefined,
			name: null,
			projectId: null,
			parentTaskId: null,
			userId: null,
			priority: null,
			startDate: null,
			endDate: null,
			status: null			
        };
    }
}
