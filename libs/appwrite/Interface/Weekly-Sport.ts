import { Models } from 'appwrite';

export type Teacher = {
	name: string;
	email: string;
	// Game could be an empty array
	game: GameDocument[];
};

export type Team = {
	team: string;
	// Game could be an empty array
	game: GameDocument[];
};

export type Game = {
	date: DateInterfaceDocument | null;
	team: TeamDocument | null;
	teacher: TeacherDocument | null;
	opponent: string | 'Bye';
	venue: string | null;
	transportation: string | null;
	'out-of-class': string | null;
	start: string | null;
};

export type DateInterface = {
	day: string;
	// Game could be an empty array
	game: GameDocument[];
};

export type TeacherDocument = Teacher & Models.Document;
export type TeamDocument = Team & Models.Document;
export type GameDocument = Game & Models.Document;
export type DateInterfaceDocument = DateInterface & Models.Document;
