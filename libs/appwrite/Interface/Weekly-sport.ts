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
	type: 'junior' | 'intermediate';
};

export type Game = {
	// TODO: remove date
	date: DateInterfaceDocument | null;
	team: TeamDocument | null;
	teacher: TeacherDocument | null;
	opponent: OpponentDocument | null;
	venue: VenueDocument | null;
	transportation: TransportationDocument | null;
	transportation_number: number;
	// transportation is Datetime in string format
	out_of_class: string | null;
	// start is Datetime in string format
	start: string | null;
	note: NoteDocument | null;
};

// date.$id is the date in UTC timestamp
export type DateInterface = {
	// Game could be an empty array
	game: GameDocument[];
	// day is Datetime in string format, and should be always inserted with time 00:00:00
	day: string;
};

// Venue code is venue.$id
export type Venue = {
	venue: string;
	address: string;
	court_field_number: string;
	// Game could be an empty array
	game: GameDocument[];
};

// Opponent school code is opponent.$id
export type Opponent = {
	name?: string;
	// Game could be an empty array
	game: GameDocument[];
};

export type Transportation = {
	name: string;
};

export type Note = {
	description: string;
};

export type TeacherDocument = Teacher & Models.Document;
export type TeamDocument = Team & Models.Document;
export type GameDocument = Game & Models.Document;
export type DateInterfaceDocument = DateInterface & Models.Document;
export type VenueDocument = Venue & Models.Document;
export type OpponentDocument = Opponent & Models.Document;
export type TransportationDocument = Transportation & Models.Document;
export type NoteDocument = Note & Models.Document;

export type QueryPickDocument<T, K extends keyof T> = Pick<T, K> & { $collectionId: string; $databaseId: string };
