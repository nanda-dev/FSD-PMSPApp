import { Component } from '@angular/core';

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ ]
  
})


/*@Component({
	selector: 'pm-root',
	template: `
		<div>
			<nav class='navbar navbar-default'>
				<div class='container-fluid'>
					<a class='navbar-brand'>{{pageTitle}}</a>
					<ul class='nav navbar-nav'>
						<li><a [routerLink]="['/welcome']">Home</a></li>
						<li><a [routerLink]="['/products']">Product List</a></li>
					</ul>
				</div>
			</nav>
		</div>
		<div class='container'>
			<router-outlet></router-outlet>
		</div>
		`,
	

})*/

export class AppComponent {
	pageTitle: string = 'Project Manager';
}
