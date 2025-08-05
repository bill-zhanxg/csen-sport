'use server';
import { authC } from '@/app/cache';
import { isTeacher } from '@/libs/checkPermission';
import { dayjs } from '@/libs/dayjs';
import { FormState } from '@/libs/types';
import { getXataClient } from '@/libs/xata';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
	id: z.string(),
	timezone: z.string().optional(),
	date: z
		.string()
		.or(z.date())
		.optional()
		.refine((val) => (typeof val === 'string' ? val?.match(/^\d{4}-\d{2}-\d{2}$/) : true), {
			message: 'Date must be in the format YYYY-MM-DD',
		}),
	team: z.string().nullish(),
	isHome: z
		.string()
		.or(z.boolean())
		.nullish()
		.transform((val) => (typeof val === 'string' ? (val ? val === 'home' : null) : val)),
	opponent: z.string().optional(),
	venue: z.string().nullish(),
	teacher: z.string().nullish(),
	extra_teachers: z
		.string()
		.optional()
		.transform((val) => (val && val.trim() ? val.split(',') : [])),
	transportation: z.string().optional(),
	out_of_class: z.string().or(z.date()).optional(),
	start: z.string().or(z.date()).optional(),
	notes: z.string().optional(),
	confirmed: z
		.string()
		.nullable()
		.transform((val) => (val ? val === 'on' : false)),
});

export async function updateGame(prevState: FormState, formData: FormData): Promise<FormState> {
	const session = await authC();
	if (!session || !isTeacher(session)) return { success: false, message: 'Unauthorized' };

	try {
		let data = schema.parse({
			id: formData.get('id'),
			timezone: formData.get('timezone'),
			date: formData.get('date'),
			team: formData.get('team'),
			isHome: formData.get('position'),
			opponent: formData.get('opponent'),
			venue: formData.get('venue'),
			teacher: formData.get('teacher'),
			extra_teachers: formData.get('extra_teachers'),
			transportation: formData.get('transportation'),
			out_of_class: formData.get('out_of_class'),
			start: formData.get('start'),
			notes: formData.get('notes'),
			confirmed: formData.get('confirmed'),
		});

		if (typeof data.out_of_class === 'string') {
			if (data.out_of_class.trim())
				data.out_of_class = dayjs.tz(`${data.date} ${data.out_of_class}`, data.timezone).toDate();
			else delete data.out_of_class;
		}
		if (typeof data.start === 'string') {
			if (data.start.trim()) data.start = dayjs.tz(`${data.date} ${data.start}`, data.timezone).toDate();
			else delete data.start;
		}
		if (typeof data.date === 'string') {
			if (data.date.trim()) data.date = dayjs.tz(`${data.date} 12:00`, data.timezone).toDate();
			else delete data.date;
		}
		if (data.timezone) delete data.timezone;

		const res = await getXataClient().db.games.update(data.id, data);

		revalidatePath(`/game/${data.id}`);
		if (!res) return { success: false, message: 'Failed to update game' };
		return {
			success: true,
			message: 'Game updated successfully',
		};
	} catch (err) {
		return {
			success: false,
			message: (err as Error).message,
		};
	}
}
