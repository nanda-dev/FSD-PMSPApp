export interface ITask {	
	id: number;
	name: string;
	projectId: number;
	parentTaskId: number;
	userId: number;
	priority: number;
	startDate: string;
	endDate: string;
	status: string;		
}