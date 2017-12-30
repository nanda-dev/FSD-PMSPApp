import { Pipe, PipeTransform} from '@angular/core';
@Pipe({
	name: 'convertProjectStatus'
})
export class ProjectStatusPipe implements PipeTransform {
	statusValues = {"I": "No", "S": "No", "C": "Yes"};
	transform(statusCode: string): string{
		return this.statusValues[statusCode];
	}	
}