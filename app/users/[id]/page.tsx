import { Box } from '@/app/globalComponents/Box';
import { ErrorMessage } from '@/app/globalComponents/ErrorMessage';
import { Unauthorized } from '@/app/globalComponents/Unauthorized';
import { UserAvatar } from '@/app/globalComponents/UserAvatar';
import { revalidate } from '@/app/tickets/[id]/page';
import { auth } from '@/libs/auth';
import { isAdmin, isTeacher } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';
import { revalidatePath } from 'next/cache';
import { RoleSchema } from '../schema';

const xata = getXataClient();

export default async function User({
	params,
}: {
	params: {
		id: string;
	};
}) {
	const session = await auth();
	const user = await xata.db.nextauth_users.read(params.id, ['email', 'name', 'image', 'role']);
	if (!user) return <ErrorMessage code="404" message="The user you're looking for can not be found" />;
	const userId = user.id;

	if (!isAdmin(session) && !isTeacher(user) && session?.user.id !== user.id) return Unauthorized();

	return (
		<div className="flex justify-center items-center h-[80vh] w-full">
			<Box className="card card-side bg-base-100 shadow-xl w-auto p-0 sm:px-8 sm:py-2 max-w-2xl flex-col">
				<div className="card-body">
					<div className="flex flex-col sm:flex-row gap-6 items-center break-all">
						<div className="avatar">
							<div className="w-24 rounded-full avatar h-24 ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden mt-2 backdrop-opacity-10 bg-white/30">
								<UserAvatar user={user} />
							</div>
						</div>
						<div className="flex flex-col gap-1 justify-center">
							<h2 className="text-4xl">{user.name}</h2>
							<h3 className="text-xl">{user.email}</h3>
							<div
								className={`badge gap-2 capitalize rounded-md ${
									user.role === 'teacher'
										? 'badge-warning'
										: user.role === 'admin' || user.role === 'blocked'
										? 'badge-error'
										: 'badge-primary'
								}`}
							>
								{user.role ?? 'Student'}
							</div>
						</div>
					</div>
				</div>
				{isAdmin(session) && (
					<form
						action={async (data) => {
							'use server';
							const role = RoleSchema.safeParse(data.get('role'));
							if (!role.success) return;

							await xata.db.nextauth_users.update(userId, {
								role: role.data,
							});

							revalidatePath(`/users/${userId}`);
						}}
						className="card-body pt-0"
					>
						<div className="flex flex-col sm:flex-row justify-around">
							<label className="flex flex-row-reverse sm:flex-row label cursor-pointer gap-2">
								<input type="radio" name="role" value="student" className="radio radio-success" required />
								<span className="label-text">Student (Default)</span>
							</label>
							<label className="flex flex-row-reverse sm:flex-row label cursor-pointer gap-2">
								<input type="radio" name="role" value="teacher" className="radio radio-warning" />
								<span className="label-text">Teacher</span>
							</label>
							<label className="flex flex-row-reverse sm:flex-row label cursor-pointer gap-2">
								<input type="radio" name="role" value="admin" className="radio radio-error" />
								<span className="label-text">Administrator</span>
							</label>
							<label className="flex flex-row-reverse sm:flex-row label cursor-pointer gap-2">
								<input type="radio" name="role" value="blocked" className="radio radio-error" />
								<span className="label-text">Blocked</span>
							</label>
						</div>
						<button className="btn btn-info" type="submit">
							Change Role
						</button>
					</form>
				)}
			</Box>
		</div>
	);
}
