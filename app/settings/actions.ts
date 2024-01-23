'use server';

import { auth } from '@/libs/auth';
import { z } from 'zod';
import { SettingState } from './components/SettingsForm';
import { getXataClient } from '@/libs/xata';
import { isTeacher } from '@/libs/checkPermission';
import sharp from 'sharp';

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

export async function updateProfile(prevState: SettingState, formData: FormData): Promise<SettingState> {
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

	console.log(parse.data);

    if (!isTeacher(session)) {
        // Don't want students to update their name or email
        if (session.user.name?.trim()) delete data.name;
        if (session.user.email?.trim()) delete data.email;
    }

    let image: string | undefined = undefined;
    if (avatar) {
        const result = await sharp(await avatar.arrayBuffer()).toBuffer()
        image = `data:${avatar.type};base64,${result.toString('base64')}`
    }

    getXataClient().db.nextauth_users.update(session.user.id, {
        ...data,
        image
    })

	return {
		success: true,
		message: 'Profile updated successfully',
	};
}
