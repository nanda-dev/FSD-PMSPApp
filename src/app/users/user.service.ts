import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { IUser } from './user';

@Injectable()
export class UserService {
	//ToDo: use config/env file to get URLs?
    private baseUrl = 'http://localhost:8085/api/user';
	private _userUrl = './api/users.json';
	

    constructor(private http: Http) { }

    getUsers(): Observable<IUser[]> {
        return this.http.get(this.baseUrl)
            .map((response: Response) => <IUser[]>response.json())
            .do(data => console.log('getUsers: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getUser(id: number): Observable<IUser> {
        if (id === 0) {
        return Observable.of(this.initializeUser());
        // return Observable.create((observer: any) => {
        //     observer.next(this.initializeProduct());
        //     observer.complete();
        // });
        };
        const url = `${this.baseUrl}/${id}`;
        return this.http.get(this._userUrl)
            .map(this.extractData)
            .do(data => console.log('getUserById: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    deleteUser(id: number): Observable<Response> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        const url = `${this.baseUrl}/${id}`;
        return this.http.delete(url, options)
            .do(data => console.log('deleteUser: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    saveUser(user: IUser, isEdit: boolean): Observable<IUser> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        if (!isEdit) {
			return this.createUser(user, options);
        }
        else {
			return this.updateUser(user, options);
		}
    }

    private createUser(user: IUser, options: RequestOptions): Observable<IUser> {
        user.id = undefined;
		return this.http.post(this.baseUrl, user, options)
            .map(this.extractData)
            .do(data => console.log('createUser: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    private updateUser(user: IUser, options: RequestOptions): Observable<IUser> {
        const url = `${this.baseUrl}/${user.id}`;
        return this.http.put(this.baseUrl, user, options)
            .map(() => user)
            .do(data => console.log('updateUser: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    private extractData(response: Response) {
        let body = response.json();
        return body.data || {};
    }

    private handleError(error: Response): Observable<any> {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    initializeUser(): IUser {
        // Return an initialized object
        return {
            id: 0,
            firstName: null,
            lastName: null
        };
    }
}
