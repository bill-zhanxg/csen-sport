import { revalidatePath } from 'next/cache';

import { authC } from '@/app/cache';
import { ErrorMessage } from '@/app/globalComponents/ErrorMessage';
import { Unauthorized } from '@/app/globalComponents/Unauthorized';
import { UserAvatar } from '@/app/globalComponents/UserAvatar';
import { isAdmin, isTeacher } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';

import { RoleSchema } from '../schema';
import { RoleForm } from './components/RoleForm';

const xata = getXataClient();

export default async function User(props: {
	params: Promise<{
		id: string;
	}>;
}) {
	const params = await props.params;
	const session = await authC();
	const user = await xata.db.nextauth_users.read(params.id, ['email', 'name', 'image', 'role']);
	if (!user) return <ErrorMessage code="404" message="The user you're looking for can not be found" />;
	const userId = user.id;

	if (!isAdmin(session) && !isTeacher(user) && session?.user.id !== user.id) return Unauthorized();

	const updateUserRole = async (formData: FormData) => {
		'use server';
		const role = RoleSchema.safeParse(formData.get('role'));
		if (!role.success) return;

		await xata.db.nextauth_users.update(userId, {
			role: role.data,
		});

		revalidatePath(`/users/${userId}`);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-4 sm:p-8">
			<div className="max-w-4xl mx-auto">
				{/* Header Section */}
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-base-content mb-2">User Profile</h1>
					<p className="text-base-content/70">View and manage user information</p>
				</div>

				{/* Main Card */}
				<div className="card bg-base-100 shadow-2xl border border-base-300">
					{/* User Info Section */}
					<div className="card-body p-8">
						<div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
							{/* Avatar Section */}
							<div className="flex-shrink-0">
								<div className="avatar">
									<div className="w-32 h-32 rounded-2xl ring-4 ring-primary ring-offset-4 ring-offset-base-100 overflow-hidden shadow-lg">
										<UserAvatar user={user} />
									</div>
								</div>
							</div>

							{/* User Details */}
							<div className="flex-1 text-center lg:text-left space-y-4">
								<div>
									<h2 className="text-4xl font-bold text-base-content mb-2">{user.name}</h2>
									<div className="flex items-center justify-center lg:justify-start gap-2 text-lg text-base-content/70">
										<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
											<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
										</svg>
										<span>{user.email}</span>
									</div>
								</div>

								{/* Role Badge */}
								<div className="flex justify-center lg:justify-start">
									<div
										className={`badge badge-lg gap-2 px-4 py-3 text-sm font-semibold capitalize shadow-md ${
											user.role === 'teacher'
												? 'badge-warning text-warning-content'
												: user.role === 'admin'
												? 'badge-error text-error-content'
												: user.role === 'blocked'
												? 'badge-error text-error-content'
												: 'badge-primary text-primary-content'
										}`}
									>
										<div className="w-2 h-2 rounded-full bg-current opacity-70"></div>
										{user.role ?? 'Student'}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Role Management Section */}
					{isAdmin(session) && (
						<div className="border-t border-base-300">
							<div className="p-6 bg-base-50">
								<div className="mb-4">
									<h3 className="text-xl font-semibold text-base-content flex items-center gap-2">
										<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
											<path
												fillRule="evenodd"
												d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
												clipRule="evenodd"
											/>
										</svg>
										Role Management
									</h3>
									<p className="text-sm text-base-content/60">Update user permissions and access level</p>
								</div>
								<RoleForm currentRole={user.role} updateUserRole={updateUserRole} />
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
