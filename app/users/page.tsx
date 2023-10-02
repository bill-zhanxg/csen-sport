'use client';

import { AppwriteException } from 'appwrite';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { account, database } from '../../libs/appwrite';
import { QueryPickDocument, TeacherDocument } from '../../libs/appwrite/Interface/Weekly-sport';
import { Error, Success } from '../components/Alert';
import { SkeletonBlock } from '../components/SkeletonBlock';

export default function Users() {
	const router = useRouter();

	const [teachers, setTeachers] =
		useState<(QueryPickDocument<TeacherDocument, '$id' | 'name' | 'email'> & { checked: boolean })[]>();
	const [alert, setAlert] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);

	const deleteTeacherDialogRef = useRef<HTMLDialogElement>(null);
	const [deleteTeacherDialogLoading, setDeleteTeacherDialogLoading] = useState(false);
	const [deleteTeacherDialogError, setDeleteTeacherDialogError] = useState('');

	const createTeacherDialogRef = useRef<HTMLDialogElement>(null);
	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const [dialogLoading, setDialogLoading] = useState(false);
	const [dialogError, setDialogError] = useState('');

	useEffect(() => {
		account.getJWT().then((jwt) => {
			fetch('/users/api', {
                method: 'GET',
				headers: {
					'X-Appwrite-JWT': jwt,
				},
			})
				.then(console.log)
				.catch(console.error);
		});
	}, []);

	const handleOnChange = (position: number) => {
		if (teachers === undefined) return;

		const updatedCheckedState = teachers.map((teacher, index) =>
			index === position ? { ...teacher, checked: !teacher.checked } : teacher,
		);

		setTeachers(updatedCheckedState);
		// updateTotal(updatedCheckedState);
	};

	const handleSelectAll = (checked: boolean) => {
		if (teachers === undefined) return;

		const updatedCheckedState = teachers.map((teacher) => ({ ...teacher, checked }));

		setTeachers(updatedCheckedState);
	};

	return (
		<>
			<main className="flex flex-col items-center gap-4 p-4 overflow-x-auto w-full">
				{teachers ? (
					teachers.length < 1 ? (
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
												checked={teachers.every((teacher) => teacher.checked)}
												onChange={(event) => handleSelectAll(event.target.checked)}
											/>
										</label>
									</th>
									<th>Name</th>
									<th>Email</th>
								</tr>
							</thead>
							<tbody>
								{teachers.map((teacher, index) => (
									<tr
										className="hover cursor-pointer"
										key={teacher.$id}
										onClick={() => router.push(`/teachers/${teacher.$id}`)}
									>
										<th>
											<label>
												<input
													type="checkbox"
													className="checkbox"
													checked={teacher.checked}
													onChange={() => handleOnChange(index)}
												/>
											</label>
										</th>
										<td>{teacher.name}</td>
										<td>{teacher.email}</td>
									</tr>
								))}
							</tbody>
						</table>
					)
				) : (
					<SkeletonBlock />
				)}
			</main>
			<dialog ref={deleteTeacherDialogRef} className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Delete Teachers</h3>
					<p className="py-4">
						Please note that it will unlink all the games that is associated with the teacher. This action can not be
						undone.
					</p>
					{deleteTeacherDialogError && <p className="text-error">{deleteTeacherDialogError}</p>}
					<div className="modal-action">
						<button
							className="btn btn-error"
							disabled={deleteTeacherDialogLoading}
							onClick={() => {
								setDeleteTeacherDialogLoading(true);
								const deletion = teachers?.filter((teacher) => teacher.checked);
								if (!deletion) return setDeleteTeacherDialogError("This shouldn't happen");
								database.teachers
									.delete(deletion.map((teacher) => teacher.$id))
									.then((result) => {
										setDeleteTeacherDialogError('');
										setTeachers((teachers) => teachers?.filter((teacher) => !teacher.checked));
										setAlert({
											type: 'success',
											message: `Removed ${result.succeed} teachers, failed to remove ${result.failed} teachers`,
										});
										deleteTeacherDialogRef.current?.close();
									})
									.catch((err: AppwriteException) => {
										setDeleteTeacherDialogError(err.message);
									})
									.finally(() => {
										setDeleteTeacherDialogLoading(false);
									});
							}}
						>
							{deleteTeacherDialogLoading ? <span className="loading loading-dots"></span> : 'Delete'}
						</button>
						<form method="dialog">
							{/* if there is a button in form, it will close the modal */}
							<button className="btn" disabled={deleteTeacherDialogLoading}>
								Close
							</button>
						</form>
					</div>
				</div>
			</dialog>
			{teachers && teachers.some((teacher) => teacher.checked) && (
				<div className="flex justify-center absolute bottom-5 px-3 w-full z-10">
					<div className="flex items-center justify-between p-4 bg-base-200 shadow-md border-solid border-2 border-base-300 rounded-lg h-16 w-3/4">
						<span className="flex items-center gap-2">
							<span className="flex justify-center items-center bg-primary rounded-md h-6 w-6 text-white">
								{teachers.filter((teacher) => teacher.checked).length}
							</span>
							Teachers Selected
						</span>
						<div className="flex justify-center items-center h-full gap-2">
							<button className="btn btn-neutral" onClick={() => handleSelectAll(false)}>
								Cancel
							</button>
							<button className="btn btn-error" onClick={() => deleteTeacherDialogRef.current?.showModal()}>
								Delete
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
