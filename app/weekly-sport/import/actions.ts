'use server';

import { auth } from '@/libs/auth';
import { isAdmin } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ImportState } from './components/ImportPage';
import {
	Games,
	GamesSchema,
	Opponents,
	OpponentsSchema,
	Teams,
	TeamsSchema,
	Venues,
	VenuesSchema,
} from './types';

dayjs.extend(utc);
dayjs.extend(timezone);

const xata = getXataClient();

const TimezoneSchema = z.string();

export async function importData(
	teamRaw: Teams,
	opponentsRaw: Opponents,
	venuesRaw: Venues,
	gamesRaw: Games,
	timezoneRaw: string,
): Promise<ImportState> {
	const session = await auth();
	if (!isAdmin(session)) return { type: 'error', message: 'Unauthorized' };

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
			id: csenCode.replaceAll(' ', '-'),
			name: venue,
			address,
			court_field_number: cfNum,
		}));
		const findTeam = (teamId: string) => team.find((team) => team.id === teamId);
		const gameRecords = games.map((game) => {
			const date = dayjs.tz(`${game.date} 12:00`, timezone).toDate();

			let out_of_class: Date | undefined = undefined;
			const out_of_class_string = (game.out_of_class ?? findTeam(game.teamId)?.out_of_class)?.split(':') ?? undefined;
			if (out_of_class_string)
				out_of_class = dayjs.tz(`${game.date} ${out_of_class_string[0]}:${out_of_class_string[1]}`, timezone).toDate();

			let start: Date | undefined = undefined;
			const start_string = (game.start ?? findTeam(game.teamId)?.start)?.split(':') ?? undefined;
			if (start_string) start = dayjs.tz(`${game.date} ${start_string[0]}:${start_string[1]}`, timezone).toDate();

			return {
				date,
				team: game.teamId,
				opponent: opponents.find((opponent) => opponent.csenCode === game.opponentCode)?.friendlyName ?? 'Not Found',
				venue: game.venueCode.replaceAll(' ', '-'),
				teacher: game.teacher ?? findTeam(game.teamId)?.teacher,
				transportation: game.transportation,
				out_of_class,
				start,
				notes: game.notes,
			};
		});

		return xata.transactions
			.run([
				...teamRecords.map((team) => ({ insert: { table: 'teams', record: team } } as const)),
				...venueRecords.map((venue) => ({ insert: { table: 'venues', record: venue } } as const)),
				...gameRecords.map((games) => ({ insert: { table: 'games', record: games } } as const)),
			])
			.then(() => {
				revalidatePath('/weekly-sport/timetable');
				return {
					type: 'success',
				} as const;
			})
			.catch((e: Error) => {
				console.log(e);
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
