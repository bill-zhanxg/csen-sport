'use server';

import { auth } from '@/libs/auth';
import { isTeacher } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';
import sharp from 'sharp';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { FormState } from '@/libs/types';

const schema = z.object({
	name: z.string().min(1).max(200).optional(),
	email: z.string().min(1).max(200).email().optional(),
	avatar: z.nullable(
		z
			.instanceof(File)
			.refine((file) => file.type.startsWith('image/') || file.type === 'application/octet-stream', {
				message: 'The thumbnail must be an image',
			})
			.transform((file) => (file.type === 'application/octet-stream' ? null : file)),
	),
	team: z.string().min(1).max(200).nullable(),
});

export async function updateProfile(prevState: FormState, formData: FormData): Promise<FormState> {
	const session = await auth();
	if (!session) return { success: false, message: 'Unauthorized' };

	const parse = schema.safeParse({
		name: formData.get('name'),
		email: formData.get('email'),
		avatar: formData.get('avatar'),
		team: formData.get('team'),
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
