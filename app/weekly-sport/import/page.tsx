import { authC } from '@/app/cache';
import { Unauthorized } from '@/app/globalComponents/Unauthorized';
import { isAdmin } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
	title: 'Import',
};

const ImportPage = dynamic(() => import('./components/ImportPage'), { ssr: false });

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
