import { z } from 'zod';

export function emptyToUndefined<T extends z.ZodTypeAny>(zodType: T) {
	return z.preprocess((val) => (val === '' ? undefined : val), zodType);
}

export const UpdateGameSchema = z.object({
	date: z.date().optional(),
	team: emptyToUndefined(z.string().optional()),
	opponent: z.string().optional(),
	venue: emptyToUndefined(z.string().optional()),
	teacher: emptyToUndefined(z.string().optional()),
	transportation: z.string().optional(),
	out_of_class: z.date().optional(),
	start: z.date().optional(),
	notes: z.string().optional(),
});
