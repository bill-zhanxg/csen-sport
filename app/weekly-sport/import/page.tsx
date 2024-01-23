import { auth } from '@/libs/auth';
import { isAdmin } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';
import { ImportPage } from './components/ImportPage';

export default async function Import() {
	const session = await auth();
	if (!isAdmin(session)) return <h1>Unauthorized</h1>;

	const teachers = await getXataClient()
		.db.nextauth_users.filter({
			role: { $any: ['teacher', 'admin'] },
		})
		.select(['name'])
		.getAll();

	return <ImportPage teachers={teachers.map(({ id, name }) => ({ id, name }))} />;
}
