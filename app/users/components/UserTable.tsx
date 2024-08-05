'use client';

import { DebouncedInput } from '@/app/globalComponents/DebouncedInput';
import { ErrorMessage } from '@/app/globalComponents/ErrorMessage';
import { UserAvatar } from '@/app/globalComponents/UserAvatar';
import { NextauthUsersRecord } from '@/libs/xata';
import { JSONData, SelectedPick } from '@xata.io/client';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next13-progressbar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { changeRole } from '../actions';

export type ChangeRoleState = null | {
	success: boolean;
	message: string;
};

export function UserTable({
	myId,
	users,
}: {
	myId?: string;
	users: JSONData<SelectedPick<NextauthUsersRecord, ('email' | 'name' | 'image' | 'role')[]>>[];
}) {
	const router = useRouter();
	const pathname = usePathname();

	const [state, formAction] = useFormState<ChangeRoleState, FormData>(changeRole, null);

	// New
	const [selectedUsers, setSelectedUsers] = useState<
		JSONData<SelectedPick<NextauthUsersRecord, ('email' | 'name' | 'image' | 'role')[]>>[]
	>([]);

	const searchParams = useSearchParams();
	const [searchParamsFilter, setSearchParamsFilter] = useState(searchParams.get('search') ?? '');
	const page = searchParams.get('page') ?? '1';

	const createQueryPathName = useCallback(
		(newParams: { name: string; value: string }[]) => {
			const params = new URLSearchParams(searchParams.toString());
			newParams.forEach((newParam) => {
				if (!newParam.value.trim()) params.delete(newParam.name);
				else params.set(newParam.name, newParam.value);
			});

			return pathname + '?' + params.toString();
		},
		[searchParams, pathname],
	);

	const blockUserDialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (state?.success) {
			setSelectedUsers([]);
			blockUserDialogRef.current?.close();
		}
	}, [state]);

	useEffect(() => {
		const url = createQueryPathName([
			{
				name: 'search',
				value: searchParamsFilter,
			},
		]);
		router.push(url);
	}, [createQueryPathName, router, searchParamsFilter]);

	if (!users) return <ErrorMessage code="501" message="There is no users in the database" />;

	return (
		<>
			<main className="flex flex-col items-center gap-4 p-4 pb-0 overflow-auto w-full">
				<div className="flex flex-col gap-4 bg-base-100 rounded-xl border-2 border-base-200 shadow-lg shadow-base-200 p-4 overflow-auto w-full">
					<div className="sticky left-0 flex flex-col lg:flex-row gap-4 justify-center items-center">
						<h2 className="text-xl text-center text-primary">Users Management</h2>
						<label className="static lg:absolute right-6 input input-bordered w-full lg:max-w-xs flex items-center gap-2">
							<DebouncedInput
								type="text"
								placeholder="Search Users"
								value={searchParamsFilter}
								onChange={setSearchParamsFilter}
								className="grow"
							/>
						</label>
					</div>
					{users.length > 0 ? (
						<table className="table">
							<thead>
								<tr>
									<th>
										<label>
											<input
												type="checkbox"
												className="checkbox"
												checked={users.every(
													(user) => selectedUsers.map((user) => user.id).includes(user.id) || user.id === myId,
												)}
												onChange={(event) => {
													setSelectedUsers((selectedUsers) => {
														if (event.target.checked) {
															const selectedIds = selectedUsers.map((user) => user.id);
															const addUsers = users.filter(
																(user) => !selectedIds.includes(user.id) && user.id !== myId,
															);
															return [...selectedUsers, ...addUsers];
														} else {
															const userIds = users.map((user) => user.id);
															return [...selectedUsers.filter((user) => !userIds.includes(user.id))];
														}
													});
												}}
											/>
										</label>
									</th>
									<th>Name</th>
									<th>Email</th>
									<th>Role</th>
								</tr>
							</thead>
							<tbody>
								{users.map((user) => (
									<tr
										className="hover cursor-pointer"
										key={user.id}
										onClick={(e) => {
											e.preventDefault();
											router.push(`/users/${user.id}`);
										}}
									>
										<th className="cursor-default" onClick={(event) => event.stopPropagation()}>
											<label>
												<input
													type="checkbox"
													className="checkbox"
													disabled={user.id === myId}
													checked={selectedUsers.map((user) => user.id).includes(user.id)}
													onChange={() => {
														if (selectedUsers.map((user) => user.id).includes(user.id)) {
															setSelectedUsers((selectedUsers) =>
																selectedUsers.filter((selectedUser) => selectedUser.id !== user.id),
															);
														} else {
															setSelectedUsers((selectedUsers) => [...selectedUsers, user]);
														}
													}}
													onClick={(event) => event.stopPropagation()}
												/>
											</label>
										</th>
										<td>
											<div className="flex items-center gap-3">
												<div className="avatar">
													<div className="mask mask-squircle w-12 h-12">
														<UserAvatar user={user as any} />
													</div>
												</div>
												<div>
													<div className="font-bold">{(user.name as string) ?? 'Unnamed'}</div>
												</div>
											</div>
										</td>
										<td>{(user.email as string) ?? 'No Email'}</td>
										<td>
											{(user.role as string)
												? (user.role as string).charAt(0).toUpperCase() + (user.role as string).slice(1)
												: 'Student'}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div className="text-center">
							<p>
								No users found
								{page !== '1' && `, maybe they are hidden in page 1? You're currently on page ${page}`}
							</p>
						</div>
					)}
				</div>
			</main>
			<dialog ref={blockUserDialogRef} className="modal">
				<div className="modal-box max-w-4xl">
					<h3 className="font-bold text-lg">Change Users&apos; Role</h3>
					<div className="pb-4">
						<p className="text-center font-bold">Selected Users</p>
						<div className="grid grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] gap-2 overflow-auto max-h-96">
							{selectedUsers.map((user) => (
								<div key={user.id} className="flex items-center gap-3 bg-base-200 rounded-lg p-2">
									<div className="avatar">
										<div className="mask mask-squircle w-12 h-12">
											<UserAvatar user={user as any} />
										</div>
									</div>
									<div>
										<div className="font-bold">{(user.name as string) ?? 'Unnamed'}</div>
									</div>
								</div>
							))}
						</div>
						<p>
							You will be changing the role of the selected users. This will limit or grant access to certain resources.
						</p>
					</div>
					<form action={formAction}>
						<input type="hidden" name="users" value={selectedUsers.map(({ id }) => id)} />
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
						{state && !state.success && (
							<div role="alert" className="alert alert-error">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="stroke-current shrink-0 h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>{state.message}</span>
							</div>
						)}
						<div className="modal-action">
							<ChangeRoleButton />
						</div>
					</form>
				</div>
				<form id="close_dialog" method="dialog" />
			</dialog>
			{selectedUsers.length > 0 && (
				<div className="flex justify-center sticky bottom-5 px-4 pt-4 w-full z-10">
					<div className="flex flex-col sm:flex-row gap-2 items-center justify-between p-4 bg-base-200 shadow-md border-solid border-2 border-base-300 rounded-lg h-32 sm:h-16 w-full">
						<span className="flex items-center gap-2">
							<span className="flex justify-center items-center bg-primary rounded-md h-6 w-6 text-white">
								{selectedUsers.length}
							</span>
							Users Selected
						</span>
						<div className="flex justify-center items-center h-full gap-2">
							<button className="btn btn-neutral" onClick={() => setSelectedUsers([])}>
								Cancel
							</button>
							<button className="btn btn-info" onClick={() => blockUserDialogRef.current?.showModal()}>
								Change Role
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

function ChangeRoleButton() {
	const { pending } = useFormStatus();

	return (
		<>
			<button className="btn btn-info" type="submit" disabled={pending}>
				{pending ? <span className="loading loading-dots"></span> : 'Change Role'}
			</button>
			<button form="close_dialog" className="btn" disabled={pending}>
				Close
			</button>
		</>
	);
}
