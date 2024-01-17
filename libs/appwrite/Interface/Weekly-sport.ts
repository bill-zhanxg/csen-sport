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

export type TeacherDocument = Teacher;
export type TeamDocument = Team;
export type GameDocument = Game;
export type DateInterfaceDocument = DateInterface;
export type VenueDocument = Venue;
export type OpponentDocument = Opponent;
export type TransportationDocument = Transportation;
export type NoteDocument = Note;

export type QueryPickDocument<T, K extends keyof T> = Pick<T, K> & { $collectionId: string; $databaseId: string };
