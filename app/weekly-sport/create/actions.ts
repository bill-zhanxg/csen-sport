'use server';

import { AlertType } from '@/app/components/Alert';
import { auth } from '@/libs/auth';
import { formatDate, formatTime } from '@/libs/formatValue';
import { z } from 'zod';

const TeamsSchema = z
	.object({
		id: z.string(),
		group: z.literal('junior' || 'intermediate').optional(),
		name: z.string().optional(),
		teacher: z.string().optional(),
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
		opponent: z.string().optional(),
		venue: z.string().optional(),
		teacher: z.string().optional(),
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
				opponent: game.opponent,
				venue: game.venue,
				teacher: game.teacher ?? findTeam(game.team)?.teacher,
				transportation: game.transportation,
				out_of_class,
				start,
				notes: game.notes,
			};
		});

        // TODO Add transaction

		return { type: 'success', message: 'Success' };
	} catch (error) {
		return { type: 'error', message: (error as Error).message };
	}
}
