'use server';

import { auth } from '@/libs/auth';
import { isTeacher } from '@/libs/checkPermission';
import { FormState } from '@/libs/types';
import { getXataClient } from '@/libs/xata';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';
import { z } from 'zod';

const schema = z.object({
	name: z.string().min(1).max(200).nullish(),
	email: z.string().min(1).max(200).email().nullish(),
	avatar: z.nullable(
		z
			.instanceof(File)
			.refine((file) => file.type.startsWith('image/') || file.type === 'application/octet-stream', {
				message: 'The thumbnail must be an image',
			})
			.transform((file) => (file.type === 'application/octet-stream' ? null : file)),
	),
	team: z.string().min(1).max(200).nullable(),
	reset_only_after_visit_weekly_sport: z.literal('true').or(z.literal('false')).or(z.boolean()).nullish(),
});

export async function updateProfile(prevState: FormState, formData: FormData): Promise<FormState> {
	const session = await auth();
	if (!session) return { success: false, message: 'Unauthorized' };

	const parse = schema.safeParse({
		name: formData.get('name'),
		email: formData.get('email'),
		avatar: formData.get('avatar'),
		team: formData.get('team'),
		reset_only_after_visit_weekly_sport: formData.get('reset_only_after_visit_weekly_sport'),
	});

	if (!parse.success) return { success: false, message: parse.error.errors[0].message };
	const { avatar, ...data } = parse.data;

	if (!isTeacher(session)) {
		// Don't want students to update their name or email
		if (session.user.name?.trim()) delete data.name;
		if (session.user.email?.trim()) delete data.email;
	}

	let image: string | undefined = undefined;
	if (avatar) {
		// Result need to be below 204800 bytes
		const result = await sharp(await avatar.arrayBuffer())
			.resize(1000, 1000)
			.withMetadata()
			.toBuffer();
		image = `data:${avatar.type};base64,${result.toString('base64')}`;
	}

	if (typeof data.reset_only_after_visit_weekly_sport === 'string')
		data.reset_only_after_visit_weekly_sport = data.reset_only_after_visit_weekly_sport === 'true';

	const res = await getXataClient().db.nextauth_users.update(session.user.id, {
		...data,
		image,
	});

	revalidatePath('/settings');
	if (!res) return { success: false, message: 'Failed to update profile' };
	return {
		success: true,
		message: 'Profile updated successfully',
	};
}
