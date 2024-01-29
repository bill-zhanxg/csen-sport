import { z } from "zod";

export const GamesSchema = z.array(
	z.object({
		id: z.string(),
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
