'use server';

import { authC } from '@/app/cache';
import { isAdmin } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ChangeRoleState } from './components/UserTable';
import { RoleSchema } from './schema';

const schema = z
	.object({
		users: z.string(),
		role: RoleSchema,
	})
	.transform((data) => {
		const users = data.users.split(',').map((user) => user.trim());
		return { ...data, users };
	});

export async function changeRole(prevState: ChangeRoleState, formData: FormData): Promise<ChangeRoleState> {
	const session = await authC();
	if (!isAdmin(session)) return { success: false, message: 'Unauthorized' };

	const parse = schema.safeParse({
		users: formData.get('users'),
		role: formData.get('role'),
	});

	if (!parse.success) return { success: false, message: parse.error.message };

	const { users, role } = parse.data;

	return await getXataClient()
		.transactions.run(
			users.map((user) => ({
				update: {
					table: 'nextauth_users',
					id: user,
					fields: {
						role,
					},
				},
			})),
		)
		.then(() => {
			revalidatePath('/users');
			return { success: true, message: 'Success' };
		})
		.catch((error) => {
			return { success: false, message: error.message };
		});
}
