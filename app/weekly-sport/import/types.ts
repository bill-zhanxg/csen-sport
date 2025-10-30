import { z } from 'zod/v4';

import { emptyToNull } from '@/app/globalComponents/Schemas';

export const GamesSchema = z.array(
	z.object({
		id: z.string(),
		// In YYYY-MM-DD format
		date: z.string(),
		teamId: emptyToNull(z.string().nullish()),
		position: z.literal('home').or(z.literal('away')).optional(),
		opponent: emptyToNull(z.string().nullish()),
		venue: emptyToNull(z.string().nullish()),
		teacher: emptyToNull(z.string().nullish()),
		extra_teachers: emptyToNull(z.string().array().nullish()),
		transportation: z.string().optional(),
		// In HH:mm format
		out_of_class: z.string().optional(),
		start: z.string().optional(),
		notes: z.string().optional(),
	}),
);
export type Games = z.infer<typeof GamesSchema>;

export const TeamsSchema = z.array(
	z.object({
		id: z.string(),
		name: z.string(),
		age: z.literal('junior').or(z.literal('intermediate')),
		teacher: emptyToNull(z.string().nullish()),
		extra_teachers: emptyToNull(z.string().array().nullish()),
		out_of_class: z.string().optional(),
		start: z.string().optional(),
	}),
);
export type Teams = z.infer<typeof TeamsSchema>;

export const DefaultsSchema = z.object({
	default_teacher: emptyToNull(z.string().nullish()),
	default_extra_teachers: emptyToNull(z.string().array().nullish()),
	default_out_of_class: z.string().optional(),
	default_start: z.string().optional(),
})
export type Defaults = z.infer<typeof DefaultsSchema>;
