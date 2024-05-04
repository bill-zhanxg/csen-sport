import { auth } from '@/libs/auth';
import { isAdmin } from '@/libs/checkPermission';
import { stringifySearchParam } from '@/libs/formatValue';
import { SearchParams } from '@/libs/types';
import { getXataClient } from '@/libs/xata';
import { PaginationMenu } from '../globalComponents/PaginationMenu';
import { Unauthorized } from '../globalComponents/Unauthorized';
import { UserTable } from './components/UserTable';

const xata = getXataClient();

export default async function Users({ searchParams }: { searchParams: SearchParams }) {
	const session = await auth();
	if (!session || !isAdmin(session)) return Unauthorized();
	const pageSize = 50;
	const { page, search } = stringifySearchParam(searchParams);

	const filter = {
		name: {
			$iContains: search,
		},
	};

	const total = (
		await xata.db.nextauth_users
			.filter(filter)
			.summarize({
				consistency: 'eventual',
				summaries: {
					total: { count: '*' },
				},
			})
			.catch(() => ({ summaries: [{ total: 0 }] }))
	).summaries[0].total;
	const users = await xata.db.nextauth_users
		.filter(filter)
		.select(['email', 'name', 'image', 'role'])
		.getPaginated({
			consistency: 'eventual',
			pagination: {
				offset: page ? (parseInt(page) - 1) * pageSize : 0,
				size: pageSize,
			},
		});

	return (
		<>
			<UserTable myId={session.user.id} users={users.records.toSerializable()} />
			<div className="pb-4">
				<PaginationMenu totalPages={Math.ceil(total / pageSize)} />
			</div>
		</>
	);
}
