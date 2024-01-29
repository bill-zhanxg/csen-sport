import { z } from "zod";

export const UpdateGameSchema = z.object({
	date: z.date().optional(),
	team: z.string().optional(),
	opponent: z.string().optional(),
	venue: z.string().optional(),
	teacher: z.string().optional(),
	transportation: z.string().optional(),
	out_of_class: z.date().optional(),
	start: z.date().optional(),
	notes: z.string().optional(),
});
