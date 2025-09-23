export interface IGroup {
	id: string;
	name: string;
	description: string;
	address: string;
	latitude: number;
	longitude: number;
	distance?: number;
	members: number;
	maxMembers: number;
	category: string;
	createdBy: string;
	createdAt: string;
	isActive: boolean;
}

export interface ICreateGroupRequest {
	name: string;
	description: string;
	address: string;
	latitude: number;
	longitude: number;
	maxMembers: number;
	category: string;
}

export interface INearbyGroupsRequest {
	latitude: number;
	longitude: number;
	radius: number;
	category?: string;
}

// La interfaz IGroupCategoriesResponse se movió a interfaces/category.ts
// para mantener una mejor organización de las interfaces
