import { emptyToUndefined } from '@/app/globalComponents/Schemas';
import { z } from 'zod';

export const GamesSchema = z.array(
	z.object({
		id: z.string(),
		date: z.string(),
		teamId: emptyToUndefined(z.string().optional()),
		opponentCode: emptyToUndefined(z.string().optional()),
		venueCode: emptyToUndefined(z.string().optional()),
		teacher: emptyToUndefined(z.string().optional()),
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
		gender: z.string().optional(),
		sport: z.string().optional(),
		division: z.string().optional(),
		team: z.string().optional(),
		friendlyName: z.string(),
		group: z.literal('junior').or(z.literal('intermediate')),
		teacher: z.string().optional(),
		out_of_class: z.string().optional(),
		start: z.string().optional(),
	}),
);
export type Teams = z.infer<typeof TeamsSchema>;
