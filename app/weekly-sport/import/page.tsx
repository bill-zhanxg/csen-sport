import { Unauthorized } from '@/app/globalComponents/Unauthorized';
import { auth } from '@/libs/auth';
import { isAdmin } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';
import dynamic from 'next/dynamic';

const ImportPage = dynamic(() => import('./components/ImportPage'), { ssr: false });

export default async function Import() {
	const session = await auth();
	if (!isAdmin(session)) return Unauthorized();

	const teachers = await getXataClient()
		.db.nextauth_users.filter({
			role: { $any: ['teacher', 'admin'] },
		})
		.select(['name'])
		.getAll();

	return <ImportPage teachers={teachers.map(({ id, name }) => ({ id, name }))} />;
}
