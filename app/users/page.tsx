import { auth } from '@/libs/auth';
import { getXataClient } from '@/libs/xata';
import { UserTable } from './components/UserTable';

export default async function Users() {
	const session = await auth();
	if (session?.user.role !== 'admin') return <h1>Unauthorized</h1>;

	const users = await getXataClient().db.nextauth_users.select(['email', 'name', 'image', 'role']).getMany();

	return (
		<UserTable
			myId={session.user.id}
			users={users.toSerializable().map((user) => ({
				...user,
				checked: false,
			}))}
		/>
	);
}
