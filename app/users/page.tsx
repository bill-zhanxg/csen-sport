'use client';

import { AppwriteException } from 'appwrite';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { account } from '../../libs/appwrite';
import { UserAPIResponse } from '../../libs/server/appwrite/Interface/User';
import { Error, Success } from '../components/Alert';
import { SkeletonBlock } from '../components/SkeletonBlock';

export default function Users() {
	const router = useRouter();

	const [users, setUsers] = useState<(UserAPIResponse & { checked: boolean })[]>();
	const [alert, setAlert] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);

	const blockUserDialogRef = useRef<HTMLDialogElement>(null);
	const [blockUserDialogLoading, setBlockUserDialogLoading] = useState(false);
	const [blockUserDialogError, setBlockUserDialogError] = useState('');

	useEffect(() => {
		account
			.getJWT()
			.then((jwt) => {
				fetch('/users/api', {
					method: 'GET',
					headers: {
						'X-Appwrite-JWT': jwt,
					},
				})
					.then((response) => {
						if (!response.ok) {
							setUsers([]);
							if (response.status === 401)
								return setAlert({
									type: 'error',
									message: 'You are not authorized to view this page',
								});
							else if (response.status === 500)
								return setAlert({
									type: 'error',
									message: 'A server error occurred',
								});
							else
								return setAlert({
									type: 'error',
									message: `An unknown error occurred, code: ${response.status}`,
								});
						}
						response
							.json()
							.then((users: UserAPIResponse[]) => {
								setUsers(users.map((user) => ({ ...user, checked: false })));
							})
							.catch((reason) => {
								// This shouldn't happen
								console.error(reason);
								setAlert({
									type: 'error',
									message: `This shouldn't happen: ${reason}`,
								});
							});
					})
					.catch((reason) => {
						// This shouldn't happen
						console.error(reason);
						setAlert({
							type: 'error',
							message: `This shouldn't happen: ${reason}`,
						});
					});
			})
			.catch((err: AppwriteException) => {
				setAlert({
					type: 'error',
					message: `Failed to get client JWT for authentication: ${err.message}`,
				});
			});
	}, []);

	const handleOnChange = (position: number) => {
		if (users === undefined) return;

		const updatedCheckedState = users.map((user, index) =>
			index === position ? { ...user, checked: !user.checked } : user,
		);

		setUsers(updatedCheckedState);
	};

	const handleSelectAll = (checked: boolean) => {
		if (users === undefined) return;

		const updatedCheckedState = users.map((user) => ({ ...user, checked }));

		setUsers(updatedCheckedState);
	};

	return (
		<>
			<main className="flex flex-col items-center gap-4 p-4 overflow-x-auto w-full">
				{users ? (
					users.length < 1 ? (
						<div>Nothing Here</div>
					) : (
						<table className="table">
							<thead>
								<tr>
									<th>
										<label>
											<input
												type="checkbox"
												className="checkbox"
												checked={users.every((user) => user.checked)}
												onChange={(event) => handleSelectAll(event.target.checked)}
											/>
										</label>
									</th>
									<th>Name</th>
									<th>Email</th>
									<th>Blocked</th>
								</tr>
							</thead>
							<tbody>
								{users.map((user, index) => (
									<tr className="hover cursor-pointer" key={user.$id} onClick={() => router.push(`/users/${user.$id}`)}>
										<th>
											<label>
												<input
													type="checkbox"
													className="checkbox"
													checked={user.checked}
													onChange={() => handleOnChange(index)}
													onClick={(event) => event.stopPropagation()}
												/>
											</label>
										</th>
										<td>{user.name}</td>
										<td>{user.email}</td>
										<td className="flex items-center">
											<input
												type="checkbox"
												checked={!user.status}
												readOnly
												className="checkbox checkbox-error disabled"
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)
				) : (
					<SkeletonBlock />
				)}
			</main>
			<dialog ref={blockUserDialogRef} className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Block Users</h3>
					<p className="py-4">
						When you block a user, they will no longer be able to view or edit any of the data including weekly sport
						list.
					</p>
					{blockUserDialogError && <p className="text-error">{blockUserDialogError}</p>}
					<div className="modal-action">
						<button
							className="btn btn-error"
							disabled={blockUserDialogLoading}
							onClick={() => {
								setBlockUserDialogLoading(true);
								const deletion = users?.filter((user) => user.checked).map(({ $id }) => $id);
								if (!deletion) return setBlockUserDialogError("This shouldn't happen");
								account
									.getJWT()
									.then((jwt) => {
										fetch('/users/api', {
											method: 'PATCH',
											headers: {
												'X-Appwrite-JWT': jwt,
											},
											body: JSON.stringify({ block: true, $id: deletion }),
										})
											.then((response) => {
												if (!response.ok) {
													setBlockUserDialogLoading(false);
													if (response.status === 401)
														setBlockUserDialogError('You are not authorized to perform this action');
													if (response.status === 404) setBlockUserDialogError("This shouldn't happen, code: 404");
													if (response.status === 500) setBlockUserDialogError('A server error occurred');
													else setBlockUserDialogError(`An unknown error occurred, code: ${response.status}`);
													return;
												}
												setBlockUserDialogError('');
												setUsers((users) =>
													users?.map((user) => (user.checked ? { ...user, checked: false, status: false } : user)),
												);
												// TODO: sorting, filling in replacement text
												setAlert({
													type: 'success',
													message: 'Successfully blocked 0 users, failed to block 0 users',
												});
												blockUserDialogRef.current?.close();
											})
											.catch((reason) => {
												// This shouldn't happen
												console.error(reason);
												setBlockUserDialogError(`This shouldn't happen: ${reason}`);
											});
									})
									.catch((err: AppwriteException) => {
										setAlert({
											type: 'error',
											message: `Failed to get client JWT for authentication: ${err.message}`,
										});
									});
								// database.teachers
								// 	.delete(deletion.map((teacher) => teacher.$id))
								// 	.then((result) => {
								// 		setBlockTeacherDialogError('');
								// 		setUsers((teachers) => teachers?.filter((teacher) => !teacher.checked));
								// 		setAlert({
								// 			type: 'success',
								// 			message: `Removed ${result.succeed} teachers, failed to remove ${result.failed} teachers`,
								// 		});
								// 		blockTeacherDialogRef.current?.close();
								// 	})
								// 	.catch((err: AppwriteException) => {
								// 		setBlockTeacherDialogError(err.message);
								// 	})
								// 	.finally(() => {
								// 		setBlockTeacherDialogLoading(false);
								// 	});
							}}
						>
							{blockUserDialogLoading ? <span className="loading loading-dots"></span> : 'Block'}
						</button>
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn" disabled={blockUserDialogLoading}>
								Close
							</button>
						</form>
					</div>
				</div>
			</dialog>
			{users && users.some((user) => user.checked) && (
				<div className="flex justify-center absolute bottom-5 px-3 w-full z-10">
					<div className="flex items-center justify-between p-4 bg-base-200 shadow-md border-solid border-2 border-base-300 rounded-lg h-16 w-3/4">
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
							<button className="btn btn-error" onClick={() => blockUserDialogRef.current?.showModal()}>
								Block
							</button>
						</div>
					</div>
				</div>
			)}
			{alert &&
				(alert.type === 'success' ? (
					<Success message={alert.message} setAlert={setAlert} />
				) : (
					<Error message={alert.message} setAlert={setAlert} />
				))}
		</>
	);
}
