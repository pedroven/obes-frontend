export interface Book {
	id: number;
	title: string;
	description: string;
	author: string;
	price: number;
}

export interface Page {
	content: Book[];
}
