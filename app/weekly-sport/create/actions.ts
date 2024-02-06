'use server';

import { AlertType } from '@/app/components/Alert';
import { emptyToNull } from '@/app/globalComponents/Schemas';
import { auth } from '@/libs/auth';
import { chunk, formatDate, formatTime } from '@/libs/formatValue';
import { getXataClient } from '@/libs/xata';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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

const VenuesSchema = z
	.object({
		id: z.string(),
		venue: z.string().optional(),
		address: z.string().optional(),
		cfNum: z.string().optional(),
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
export type Venue = z.infer<typeof VenuesSchema>[number];
export type Game = z.infer<typeof GamesSchema>[number];

export async function createWeeklySport(
	teamsRaw: Team[],
	venuesRaw: Venue[],
	gamesRaw: Game[],
	timezone: string,
): Promise<AlertType> {
	const session = await auth();
	if (!session) return { type: 'error', message: 'Unauthorized' };

	try {
		const teams = TeamsSchema.parse(teamsRaw);
		const venues = VenuesSchema.parse(venuesRaw);
		const games = GamesSchema.parse(gamesRaw);

		const teamRecords = teams.map(({ id, name, group }) => ({
			id,
			name,
			isJunior: group === 'junior',
		}));
		const venueRecords = venues.map(({ id, venue, address, cfNum }) => ({
			id,
			name: venue,
			address,
			court_field_number: cfNum,
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
			...venueRecords.map((venue) => ({ insert: { table: 'venues', record: venue } } as const)),
			...gameRecords.map((games) => ({ insert: { table: 'games', record: games } } as const)),
		]);

		for (const transactionChunk of allTransactionChunks) await xata.transactions.run(transactionChunk);

		revalidatePath('/weekly-sport/timetable');
		return { type: 'success', message: 'Success' };
	} catch (error) {
		return { type: 'error', message: (error as Error).message };
	}
}
