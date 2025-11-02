'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod/v4';

import { authC } from '@/app/cache';
import { emptyToNull } from '@/app/globalComponents/Schemas';
import { chunk, formatDate, formatTime } from '@/libs/formatValue';
import { getXataClient } from '@/libs/xata';

import type { ToastMessage } from '@/app/components/Alert';
const xata = getXataClient();

const TeamsSchema = z
	.object({
		id: z.string(),
		group: z.literal('junior').or(z.literal('intermediate')).optional(),
		name: z.string().optional(),
		teacher: emptyToNull(z.string().nullish()),
		extra_teachers: emptyToNull(z.string().array().nullish()),
		out_of_class: z.string().optional(),
		start: z.string().optional(),
	})
	.array();

const GamesSchema = z
	.object({
		id: z.string(),
		date: z.string().optional(),
		team: z.string().optional(),
		position: emptyToNull(z.literal('home').or(z.literal('away')).nullish()),
		opponent: z.string().optional(),
		venue: emptyToNull(z.string().nullish()),
		teacher: emptyToNull(z.string().nullish()),
		extra_teachers: emptyToNull(z.string().array().nullish()),
		transportation: z.string().optional(),
		out_of_class: z.string().optional(),
		start: z.string().optional(),
		notes: z.string().optional(),
	})
	.array();

export type Team = z.infer<typeof TeamsSchema>[number];
export type Game = z.infer<typeof GamesSchema>[number];

export async function createWeeklySport(teamsRaw: Team[], gamesRaw: Game[], timezone: string): Promise<ToastMessage> {
	const session = await authC();
	if (!session) return { type: 'error', message: 'Unauthorized' };

	try {
		const teams = TeamsSchema.parse(teamsRaw);
		const games = GamesSchema.parse(gamesRaw);

		const teamRecords = teams.map(({ id, name, group }) => ({
			id,
			name,
			isJunior: group === 'junior',
		}));
		const findTeam = (teamId?: string) => teams.find((team) => team.id === teamId);
		const gameRecords = games.map((game) => {
			const date = formatDate(game.date, timezone);

			const out_of_class = formatTime(date, game.out_of_class ?? findTeam(game.team)?.out_of_class, timezone);
			const start = formatTime(date, game.start ?? findTeam(game.team)?.start, timezone);

			return {
				date,
				team: game.team,
				isHome: game.position !== undefined ? game.position === 'home' : undefined,
				opponent: game.opponent,
				venue: game.venue,
				teacher: game.teacher ?? findTeam(game.team)?.teacher,
				extra_teachers: game.extra_teachers ?? findTeam(game.team)?.extra_teachers,
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

		for (const transactionChunk of allTransactionChunks) await xata.transactions.run(transactionChunk);

		revalidatePath('/weekly-sport/timetable');
		return { type: 'success', message: 'Success' };
	} catch (error) {
		return { type: 'error', message: (error as Error).message };
	}
}
