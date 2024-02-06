import { z } from 'zod';

export function emptyToNull<T extends z.ZodTypeAny>(zodType: T) {
	return z.preprocess((val) => (val === '' ? null : val), zodType);
}

export const UpdateGameSchema = z.object({
	date: z.date().optional(),
	team: emptyToNull(z.string().nullish()),
	isHome: z.boolean().nullish(),
	opponent: z.string().optional(),
	venue: emptyToNull(z.string().nullish()),
	teacher: emptyToNull(z.string().nullish()),
	extra_teachers: z.string().array().optional(),
	transportation: z.string().optional(),
	out_of_class: z.date().optional(),
	start: z.date().optional(),
	notes: z.string().optional(),
});
