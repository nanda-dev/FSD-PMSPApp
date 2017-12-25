import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { IProject } from './project';

@Injectable()
export class ProjectService {
    private baseUrl = 'api/projects';
	private _projectUrl = './api/projects.json';

    constructor(private http: Http) { }

    getProjects(): Observable<IProject[]> {
        return this.http.get(this._projectUrl)
            .map((response: Response) => <IProject[]>response.json())
            .do(data => console.log('getProjects: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getProject(id: number): Observable<IProject> {
        if (id === 0) {
        return Observable.of(this.initializeProject());
        // return Observable.create((observer: any) => {
        //     observer.next(this.initializeProduct());
        //     observer.complete();
        // });
        };
        const url = `${this.baseUrl}/${id}`;
        return this.http.get(this._projectUrl)
            .map(this.extractData)
            .do(data => console.log('getProduct: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    deleteProject(id: number): Observable<Response> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        const url = `${this.baseUrl}/${id}`;
        return this.http.delete(url, options)
            .do(data => console.log('deleteProduct: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    saveProject(project: IProject): Observable<IProject> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        if (project.id === 0) {
            return this.createProject(project, options);
        }
        return this.updateProject(project, options);
    }

    private createProject(project: IProject, options: RequestOptions): Observable<IProject> {
        project.id = undefined;
        return this.http.post(this.baseUrl, project, options)
            .map(this.extractData)
            .do(data => console.log('createProject: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    private updateProject(project: IProject, options: RequestOptions): Observable<IProject> {
        const url = `${this.baseUrl}/${project.id}`;
        return this.http.put(url, project, options)
            .map(() => project)
            .do(data => console.log('updateProject: ' + JSON.stringify(data)))
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

    initializeProject(): IProject {
        // Return an initialized object
        return {
            id: undefined,
			name: null,
			managerId: null,
			priority: null,
			startDate: null,
			endDate: null,
			status: null,
			taskCount: undefined			
        };
    }
}
