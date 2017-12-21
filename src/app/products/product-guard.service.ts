import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable()
export class ProductGuardService implements CanActivate {
  //Types of Guards:
  //CanActivate - guard nav to a route
  //CanDeactivate - guard nav from a route
  //Resolve - pre-fetch data before activating a route
  //CanLoad - prevent asynchronous routing

  constructor(private _router: Router) { }
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
	console.log('in canActivate');
	let id = +route.url[1].path;
	console.log('id=' + id);
	if(isNaN(id) || id < 1) {
		console.log('invalid id');
		alert('Invalid product Id');
		this._router.navigate(['/products']);
		return false;
	}
	return true;
  }
}
