'use server';

import { getXataClient } from '@/libs/xata';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { z } from 'zod';
import { ImportState } from './components/ImportPage';

dayjs.extend(utc);
dayjs.extend(timezone);

const xata = getXataClient();

export const GamesSchema = z.array(
	z.object({
		date: z.string(),
		teamId: z.string(),
		opponentCode: z.string(),
		venueCode: z.string(),
		teacher: z.string().optional(),
		transportation: z.string().optional(),
		out_of_class: z.string().optional(),
		start: z.string().optional(),
		notes: z.string().optional(),
	}),
);
export type Games = z.infer<typeof GamesSchema>;

export const OpponentsSchema = z.array(
	z.object({
		csenCode: z.string(),
		friendlyName: z.string(),
	}),
);
export type Opponents = z.infer<typeof OpponentsSchema>;

export const VenuesSchema = z.array(
	z.object({
		venue: z.string(),
		address: z.string(),
		cfNum: z.string(),
		csenCode: z.string(),
	}),
);
export type Venues = z.infer<typeof VenuesSchema>;

export const TeamsSchema = z.array(
	z.object({
		id: z.string(),
		gender: z.string(),
		sport: z.string(),
		division: z.string(),
		team: z.string(),
		friendlyName: z.string(),
		group: z.literal('junior').or(z.literal('intermediate')),
		teacher: z.string().optional(),
		out_of_class: z.string().optional(),
		start: z.string().optional(),
	}),
);
export type Teams = z.infer<typeof TeamsSchema>;

const TimezoneSchema = z.string();

export async function importData(
	teamRaw: Teams,
	opponentsRaw: Opponents,
	venuesRaw: Venues,
	gamesRaw: Games,
	timezoneRaw: string,
): Promise<ImportState> {
	try {
		const team = TeamsSchema.parse(teamRaw);
		const opponents = OpponentsSchema.parse(opponentsRaw);
		const venues = VenuesSchema.parse(venuesRaw);
		const games = GamesSchema.parse(gamesRaw);
		const timezone = TimezoneSchema.parse(timezoneRaw);

		const teamRecords = team.map(({ id, friendlyName, group }) => ({
			id,
			name: friendlyName,
			isJunior: group === 'junior',
		}));
		const venueRecords = venues.map(({ csenCode, venue, address, cfNum }) => ({
			id: csenCode,
			name: venue,
			address,
			court_field_number: cfNum,
		}));
		const findTeam = (teamId: string) => team.find((team) => team.id === teamId);
		const gameRecords = games.map((game) => ({
			date: dayjs.tz(`${game.date} 12:00`, timezone).toDate(),
			team: game.teamId,
			opponent: opponents.find((opponent) => opponent.csenCode === game.opponentCode)?.friendlyName ?? 'Not Found',
			venue: game.venueCode,
			teacher: game.teacher ?? findTeam(game.teamId)?.teacher ?? '',
			transportation: game.transportation ?? '',
			out_of_class: game.out_of_class ?? findTeam(game.teamId)?.out_of_class ?? '',
			start: game.start ?? findTeam(game.teamId)?.start ?? '',
			notes: game.notes ?? '',
		}));

		return xata.transactions
			.run([
				...teamRecords.map((team) => ({ insert: { table: 'teams', record: team } } as const)),
				...venueRecords.map((venue) => ({ insert: { table: 'venues', record: venue } } as const)),
				...gameRecords.map((games) => ({ insert: { table: 'games', record: games } } as const)),
			])
			.then(() => {
				return {
					type: 'success',
				} as const;
			})
			.catch((e: Error) => {
				return {
					type: 'error',
					message: e.message,
				} as const;
			});
	} catch (e) {
		return {
			type: 'error',
			message: (e as Error).message,
		};
	}
}
