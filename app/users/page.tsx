import { authC } from '@/app/cache';
import { isAdmin } from '@/libs/checkPermission';
import { stringifySearchParam } from '@/libs/formatValue';
import { SearchParams } from '@/libs/types';
import { getXataClient } from '@/libs/xata';
import { Metadata } from 'next';
import { PaginationMenu } from '../globalComponents/PaginationMenu';
import { Unauthorized } from '../globalComponents/Unauthorized';
import { UserTable } from './components/UserTable';

export const metadata: Metadata = {
	title: 'Users',
};

const xata = getXataClient();

export default async function Users({ searchParams }: { searchParams: SearchParams }) {
	const session = await authC();
	if (!session || !isAdmin(session)) return Unauthorized();
	const pageSize = 20;
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
		.sort('xata.createdAt', 'desc')
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
			<div className="py-4">
				<PaginationMenu totalPages={Math.ceil(total / pageSize)} />
			</div>
		</>
	);
}
