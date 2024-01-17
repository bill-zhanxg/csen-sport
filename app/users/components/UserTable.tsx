'use client';

import { UserAvatar } from '@/app/globalComponents/UserAvatar';
import { NextauthUsersRecord } from '@/libs/xata';
import { JSONData, SelectedPick } from '@xata.io/client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { changeRole } from '../actions';

export type ChangeRoleState = null | {
	success: boolean;
	message: string;
};

export function UserTable({
	myId,
	users: serverUsers,
}: {
	myId: string;
	users: (JSONData<SelectedPick<NextauthUsersRecord, ('email' | 'name' | 'image' | 'role')[]>> & {
		checked: boolean;
	})[];
}) {
	const router = useRouter();

	const [state, formAction] = useFormState<ChangeRoleState, FormData>(changeRole, null);

	const [users, setUsers] = useState(serverUsers);

	const blockUserDialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (state?.success) {
			setUsers(serverUsers);
			blockUserDialogRef.current?.close();
		}
	}, [state, serverUsers]);

	const handleOnChange = (position: number) => {
		setUsers(
			users.map((user, index) =>
				index === position ? { ...user, checked: user.id === myId ? false : !user.checked } : user,
			),
		);
	};
	const handleSelectAll = (checked: boolean) => {
		setUsers(users.map((user) => ({ ...user, checked: user.id === myId ? false : checked })));
	};

	if (!users) return <h1>There is no users</h1>;

	return (
		<>
			<main className="flex flex-col items-center gap-4 p-4 overflow-x-auto w-full">
				{users.length < 1 ? (
					<div>Nothing Here</div>
				) : (
					<div className="overflow-x-auto w-full">
						<table className="table">
							<thead>
								<tr>
									<th>
										<label>
											<input
												type="checkbox"
												className="checkbox"
												checked={users.filter((user) => user.id !== myId).every((user) => user.checked)}
												onChange={(event) => handleSelectAll(event.target.checked)}
											/>
										</label>
									</th>
									<th>Name</th>
									<th>Email</th>
									<th>Role</th>
								</tr>
							</thead>
							<tbody>
								{users.map((user, index) => (
									<tr className="hover cursor-pointer" key={user.id} onClick={() => router.push(`/users/${user.id}`)}>
										<th>
											<label>
												<input
													type="checkbox"
													className="checkbox"
													disabled={user.id === myId}
													checked={user.checked}
													onChange={() => handleOnChange(index)}
													onClick={(event) => event.stopPropagation()}
												/>
											</label>
										</th>
										<td>
											<div className="flex items-center gap-3">
												<div className="avatar">
													<div className="mask mask-squircle w-12 h-12">
														<UserAvatar
															user={
																user as {
																	id: string;
																	name?: string | null | undefined;
																	email?: string | null | undefined;
																	image?: string | null | undefined;
																}
															}
														/>
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
					</div>
				)}
			</main>
			<dialog ref={blockUserDialogRef} className="modal">
				<div className="modal-box max-w-4xl">
					<h3 className="font-bold text-lg">Change Users&apos; Role</h3>
					<p className="py-4">
						You will be changing the role of the selected users. This will limit or grant access to certain resources.
					</p>
					<form action={formAction}>
						<input type="hidden" name="users" value={users.filter((user) => user.checked).map(({ id }) => id)} />
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
			{users.some((user) => user.checked) && (
				<div className="flex justify-center sticky bottom-5 px-3 w-full z-10">
					<div className="flex flex-col sm:flex-row gap-2 items-center justify-between p-4 bg-base-200 shadow-md border-solid border-2 border-base-300 rounded-lg h-32 sm:h-16 w-full mx-10">
						<span className="flex items-center gap-2">
							<span className="flex justify-center items-center bg-primary rounded-md h-6 w-6 text-white">
								{users.filter((user) => user.checked).length}
							</span>
							Users Selected
						</span>
						<div className="flex justify-center items-center h-full gap-2">
							<button className="btn btn-neutral" onClick={() => handleSelectAll(false)}>
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
			<button
				className="btn btn-info"
				type="submit"
				disabled={pending}
				// onClick={() => {
				// 	setBlockUserDialogLoading(true);
				// 	const deletion = users?.filter((user) => user.checked).map(({ $id }) => $id);
				// 	if (!deletion) return setBlockUserDialogError("This shouldn't happen");
				// 	account
				// 		.getJWT()
				// 		.then((jwt) => {
				// 			fetch('/users/api', {
				// 				method: 'PATCH',
				// 				headers: {
				// 					'X-Appwrite-JWT': jwt,
				// 				},
				// 				body: JSON.stringify({ block: true, $id: deletion }),
				// 			})
				// 				.then((response) => {
				// 					if (!response.ok) {
				// 						setBlockUserDialogLoading(false);
				// 						if (response.status === 401) setBlockUserDialogError('You are not authorized to perform this action');
				// 						if (response.status === 404) setBlockUserDialogError("This shouldn't happen, code: 404");
				// 						if (response.status === 500) setBlockUserDialogError('A server error occurred');
				// 						else setBlockUserDialogError(`An unknown error occurred, code: ${response.status}`);
				// 						return;
				// 					}
				// 					setBlockUserDialogError('');
				// 					setUsers((users) =>
				// 						users?.map((user) => (user.checked ? { ...user, checked: false, status: false } : user)),
				// 					);
				// 					// TODO: sorting, filling in replacement text
				// 					setAlert({
				// 						type: 'success',
				// 						message: 'Successfully blocked 0 users, failed to block 0 users',
				// 					});
				// 					blockUserDialogRef.current?.close();
				// 				})
				// 				.catch((reason) => {
				// 					// This shouldn't happen
				// 					console.error(reason);
				// 					setBlockUserDialogError(`This shouldn't happen: ${reason}`);
				// 				});
				// 		})
				// 		.catch((err: Error) => {
				// 			setAlert({
				// 				type: 'error',
				// 				message: `Failed to get client JWT for authentication: ${err.message}`,
				// 			});
				// 		});
				// }}
			>
				{pending ? <span className="loading loading-dots"></span> : 'Change Role'}
			</button>
			<button form="close_dialog" className="btn" disabled={pending}>
				Close
			</button>
		</>
	);
}
