'use server';

import { authC } from '@/app/cache';
import { isAdmin } from '@/libs/checkPermission';
import { chunk, formatTime } from '@/libs/formatValue';
import { getXataClient } from '@/libs/xata';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { revalidatePath } from 'next/cache';
import { z } from 'zod/v4';
import { ImportState } from './components/ImportPage';
import { Defaults, DefaultsSchema, Games, GamesSchema, Teams, TeamsSchema } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);

const xata = getXataClient();

const TimezoneSchema = z.string();

export async function importData(
	teamRaw: Teams,
	gamesRaw: Games,
	defaultsRaw: Defaults,
	timezoneRaw: string,
): Promise<ImportState> {
	const session = await authC();
	if (!isAdmin(session)) return { type: 'error', message: 'Unauthorized' };

	try {
		const team = TeamsSchema.parse(teamRaw);
		const games = GamesSchema.parse(gamesRaw);
		const defaults = DefaultsSchema.parse(defaultsRaw);
		const timezone = TimezoneSchema.parse(timezoneRaw);

		const teamRecords = team.map(({ id, name, age: group }) => ({
			id,
			name,
			isJunior: group === 'junior',
		}));
		const findTeam = (teamId?: string | null) => team.find((team) => team.id === teamId);
		const gameRecords = games.map((game) => {
			const date = dayjs.tz(`${game.date} 12:00`, timezone).toDate();

			const out_of_class = formatTime(
				date,
				game.out_of_class ?? findTeam(game.teamId)?.out_of_class ?? defaults.default_out_of_class,
				timezone,
			);
			const start = formatTime(date, game.start ?? findTeam(game.teamId)?.start ?? defaults.default_start, timezone);

			return {
				date,
				team: game.teamId,
				isHome: game.position ? game.position === 'home' : undefined,
				opponent: game.opponent,
				venue: game.venue,
				teacher: game.teacher ?? findTeam(game.teamId)?.teacher ?? defaults.default_teacher,
				extra_teachers: game.extra_teachers ?? findTeam(game.teamId)?.extra_teachers ?? defaults.default_extra_teachers,
				transportation: game.transportation,
				out_of_class,
				start,
				notes: game.notes,
			};
		});

		const allTransactionChunks = chunk([
			...teamRecords.map((team) => ({ insert: { table: 'teams', record: team } } as const)),
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
