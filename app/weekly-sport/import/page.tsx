import { authC } from '@/app/cache';
import { Unauthorized } from '@/app/globalComponents/Unauthorized';
import { isAdmin } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';
import { Metadata } from 'next';
import { ImportPage } from './components/ImportPage';

export const metadata: Metadata = {
	title: 'Import',
};

export default async function Import() {
	const session = await authC();
	if (!isAdmin(session)) return Unauthorized();

	const teachers = await getXataClient()
		.db.nextauth_users.filter({
			role: { $any: ['teacher', 'admin'] },
		})
		.select(['name'])
		.getAll();

	return <ImportPage teachers={teachers.map(({ id, name }) => ({ id, name }))} />;
}
