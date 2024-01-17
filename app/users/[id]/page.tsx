import { UserAvatar } from '@/app/globalComponents/UserAvatar';
import { auth } from '@/libs/auth';
import { getXataClient } from '@/libs/xata';

export default async function User({
	params,
}: {
	params: {
		id: string;
	};
}) {
	const session = await auth();
	const user = await getXataClient().db.nextauth_users.read(params.id, ['email', 'name', 'image', 'role']);
	if (!user) return <h1>The user does not exist</h1>;

	if (session?.user.role !== 'admin' && user.role !== 'teacher' && user.role !== 'admin')
		return <h1>Unauthenticated</h1>;

	return (
		<div className="flex justify-center items-center h-[80vh] w-full">
			<div className="card card-side bg-base-100 shadow-xl">
				<div className="card-body">
					<div className="flex gap-4 items-center">
						<div className="avatar">
							<div className="w-24 rounded-full">
								<UserAvatar user={user} />
							</div>
						</div>
						<div className="flex flex-col gap-1 justify-center">
							<h2 className="text-4xl text-primary">{user.name}</h2>
							<h3 className="text-xl text-secondary">{user.email}</h3>
							<div className="badge badge-info gap-2">{user.role}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
