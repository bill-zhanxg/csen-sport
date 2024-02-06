'use server';

import { auth } from '@/libs/auth';
import { isAdmin } from '@/libs/checkPermission';
import { chunk, formatTime } from '@/libs/formatValue';
import { getXataClient } from '@/libs/xata';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ImportState } from './components/ImportPage';
import { Games, GamesSchema, Opponents, OpponentsSchema, Teams, TeamsSchema, Venues, VenuesSchema } from './types';

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
		const findTeam = (teamId?: string | null) => team.find((team) => team.id === teamId);
		const gameRecords = games.map((game) => {
			const date = dayjs.tz(`${game.date} 12:00`, timezone).toDate();

			const out_of_class = formatTime(date, game.out_of_class ?? findTeam(game.teamId)?.out_of_class, timezone);
			const start = formatTime(date, game.start ?? findTeam(game.teamId)?.start, timezone);

			return {
				date,
				team: game.teamId,
				isHome: game.position ? game.position === 'home' : undefined,
				opponent:
					opponents.find((opponent) => game.opponentCode?.includes(opponent.csenCode))?.friendlyName ?? 'Not Found',
				venue: game.venueCode?.replaceAll(' ', '-'),
				teacher: game.teacher ?? findTeam(game.teamId)?.teacher,
				extra_teachers: game.extra_teachers ?? findTeam(game.teamId)?.extra_teachers,
				transportation: game.transportation,
				out_of_class,
				start,
				notes: game.notes,
			};
		});

		const allTransactionChunks = chunk([
			...teamRecords.map((team) => ({ insert: { table: 'teams', record: team } } as const)),
			...venueRecords.map((venue) => ({ insert: { table: 'venues', record: venue } } as const)),
			...gameRecords.map((games) => ({ insert: { table: 'games', record: games } } as const)),
		]);

		for (const transactionChunks of allTransactionChunks) {
			await xata.transactions.run(transactionChunks);
		}

		revalidatePath('/weekly-sport/timetable');
		return {
			type: 'success',
		} as const;
	} catch (e) {
		console.error('Bulk upload for import timetable failed', e);
		return {
			type: 'error',
			message: (e as Error).message,
		};
	}
}
