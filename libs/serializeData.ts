import { CustomUser } from '@/next-auth';
import { Page, SelectedPick } from '@xata.io/client';
import { User } from 'next-auth';
import { RawTeam, RawVenue } from './tableData';
import { GamesRecord, TeamsRecord, TicketMessagesRecord, TicketsRecord, VenuesRecord } from './xata';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type SerializedTeam = RawTeam;
type TeamRecord = SelectedPick<TeamsRecord, ['name', 'isJunior']>;

export function serializeTeams(teams: TeamRecord[]): SerializedTeam[] {
	return teams.map((team) => serializeTeam(team));
}
export function serializeTeam({ id, name, isJunior }: TeamRecord): SerializedTeam {
	return {
		id,
		name,
		isJunior,
	};
}

export type SerializedVenue = RawVenue;
type VenueRecord = SelectedPick<VenuesRecord, ['name', 'address', 'court_field_number']>;

export function serializeVenues(venues: VenueRecord[]): SerializedVenue[] {
	return venues.map((venue) => serializeVenue(venue));
}
export function serializeVenue({ id, name, address, court_field_number }: VenueRecord): SerializedVenue {
	return {
		id,
		name,
		address,
		court_field_number,
	};
}

export type SerializedGame = {
	id: string;
	date?: Date | null;
	team: PartialBy<SerializedTeam, 'id'> | null;
	isHome?: boolean | null;
	opponent?: string | null;
	venue: PartialBy<SerializedVenue, 'id'> | null;
	teacher: {
		id?: string;
		name?: string | null;
	};
	extra_teachers?: string[] | null;
	transportation?: string | null;
	out_of_class?: Date | null;
	start?: Date | null;
	notes?: string | null;
	confirmed: boolean;
	xata: {
		createdAt: Date;
		updatedAt: Date;
	};
};

export type SerializedGameWithId = {
	id: string;
	date?: Date | null;
	team?: string;
	isHome?: boolean | null;
	opponent?: string | null;
	venue?: string;
	teacher?: string;
	extra_teachers?: string[] | null;
	transportation?: string | null;
	out_of_class?: Date | null;
	start?: Date | null;
	notes?: string | null;
	confirmed: boolean;
	xata: {
		createdAt: Date;
		updatedAt: Date;
	};
};

export function serializeGames(
	games: SelectedPick<GamesRecord, ('*' | 'team.*' | 'venue.*' | 'teacher.*')[]>[],
	isTeacher: boolean,
): SerializedGame[] {
	return games.map((game) => serializeGame(game, isTeacher));
}

export function serializeGamesWithId(
	games: SelectedPick<GamesRecord, ('*' | 'team.id' | 'venue.id' | 'teacher.id')[]>[],
	isTeacher: boolean,
): SerializedGameWithId[] {
	return games.map((game) => serializeGameWithId(game, isTeacher));
}

export function serializeGame(
	{
		id,
		date,
		team,
		isHome,
		opponent,
		venue,
		teacher,
		extra_teachers,
		transportation,
		out_of_class,
		start,
		notes,
		confirmed,
		xata: { createdAt, updatedAt },
	}: SelectedPick<GamesRecord, ('*' | 'team.*' | 'venue.*' | 'teacher.*')[]>,
	isTeacher: boolean,
): SerializedGame {
	return {
		id,
		date,
		team: {
			id: team?.id,
			name: team?.name,
			isJunior: team?.isJunior,
		},
		isHome: isHome,
		opponent,
		venue: {
			id: venue?.id,
			name: venue?.name,
			address: venue?.address,
			court_field_number: venue?.court_field_number,
		},
		teacher: {
			id: teacher?.id,
			name: teacher?.name,
		},
		extra_teachers: extra_teachers,
		transportation,
		out_of_class,
		start,
		notes: isTeacher ? notes : undefined,
		confirmed: isTeacher ? confirmed : false,
		xata: {
			createdAt,
			updatedAt,
		},
	};
}

export function serializeGameWithId(
	{
		id,
		date,
		team,
		isHome,
		opponent,
		venue,
		teacher,
		extra_teachers,
		transportation,
		out_of_class,
		start,
		notes,
		confirmed,
		xata: { createdAt, updatedAt },
	}: SelectedPick<GamesRecord, ('*' | 'team.id' | 'venue.id' | 'teacher.id')[]>,
	isTeacher: boolean,
) {
	return {
		id,
		date,
		team: team?.id,
		isHome,
		opponent,
		venue: venue?.id,
		teacher: teacher?.id,
		extra_teachers,
		transportation,
		out_of_class,
		start,
		notes: isTeacher ? notes : undefined,
		confirmed: isTeacher ? confirmed : false,
		xata: {
			createdAt,
			updatedAt,
		},
	};
}

// Tickets
export type SerializedTicket = {
	id: string;
	title: string;
	latest_message?: {
		id: string;
		message?: string | null;
		seen: boolean;
		createdAt?: Date | null;
		senderId?: string | null;
	} | null;
};

export function serializeTickets(
	tickets: Page<TicketsRecord, SelectedPick<TicketsRecord, ('*' | 'latest_message.*')[]>>,
): SerializedTicket[] {
	return tickets.records.map((ticket) => serializeTicket(ticket));
}

export function serializeTicket({
	id,
	title,
	latest_message,
}: SelectedPick<TicketsRecord, ('*' | 'latest_message.*')[]>): SerializedTicket {
	return {
		id,
		title,
		latest_message: latest_message
			? {
					id: latest_message.id,
					message: latest_message.message,
					seen: latest_message.seen,
					createdAt: latest_message.xata.createdAt,
					senderId: latest_message.sender?.id,
			  }
			: latest_message,
	};
}

export type SerializedTicketMessage = {
	id: string;
	ticket_id?: string | null;
	sender?: {
		id?: string | null;
		name?: string | null;
		email?: string | null;
		image?: string | null;
	} | null;
	seen: boolean;
	message?: string | null;
	xata: {
		createdAt: Date;
		updatedAt: Date;
	};
};

export function serializeTicketMessages(
	messages:
		| Page<
				TicketMessagesRecord,
				SelectedPick<TicketMessagesRecord, ('*' | 'sender.name' | 'sender.email' | 'sender.image')[]>
		  >
		| SelectedPick<TicketMessagesRecord, ('*' | 'sender.name' | 'sender.email' | 'sender.image')[]>[],
): SerializedTicketMessage[] {
	const messagesArray = 'records' in messages ? messages.records : messages;
	return messagesArray.map((message) => serializeTicketMessage(message));
}

export function serializeTicketMessage({
	id,
	ticket_id,
	sender,
	seen,
	message,
	xata,
}:
	| SelectedPick<TicketMessagesRecord, ('*' | 'sender.name' | 'sender.email' | 'sender.image')[]>
	| (Readonly<SelectedPick<TicketMessagesRecord, ['*']>> & { sender: CustomUser & User })): SerializedTicketMessage {
	return {
		id,
		ticket_id,
		sender: {
			id: sender?.id,
			name: sender?.name,
			email: sender?.email,
			image: sender?.image,
		},
		seen,
		message,
		xata,
	};
}
