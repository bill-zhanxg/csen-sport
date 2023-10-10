'use client';

import { AppwriteException } from 'appwrite';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaRegCircleQuestion } from 'react-icons/fa6';

import { database } from '../../libs/appwrite';
import { QueryPickDocument, TeacherDocument } from '../../libs/appwrite/Interface/Weekly-sport';
import { Error, Success } from '../components/Alert';
import { SkeletonBlock } from '../components/SkeletonBlock';

export default function Teachers() {
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
	const submitBtnRef = useRef<HTMLButtonElement>(null);
	const [dialogLoading, setDialogLoading] = useState(false);
	const [dialogError, setDialogError] = useState('');

	useEffect(() => {
		database.teachers
			.getAll()
			.then((teachers) => setTeachers(teachers.map((teacher) => ({ ...teacher, checked: false }))))
			.catch((err: AppwriteException) => {
				setAlert({
					type: 'error',
					message: `Failed to load teacher list: ${err.message}`,
				});
			});
	}, []);

	const handleOnChange = (position: number) => {
		if (teachers === undefined) return;

		const updatedCheckedState = teachers.map((teacher, index) =>
			index === position ? { ...teacher, checked: !teacher.checked } : teacher,
		);

		setTeachers(updatedCheckedState);
	};

	const handleSelectAll = (checked: boolean) => {
		if (teachers === undefined) return;

		const updatedCheckedState = teachers.map((teacher) => ({ ...teacher, checked }));

		setTeachers(updatedCheckedState);
	};

	return (
		<>
			<main className="flex flex-col items-center gap-4 p-4 overflow-x-auto w-full">
				<div className="flex justify-end gap-3 w-full">
					<div
						className="tooltip tooltip-left"
						data-tip="You're not making a new user, just a new document to connect the teacher with the email."
					>
						<button className="btn btn-primary" onClick={() => createTeacherDialogRef.current?.showModal()}>
							New <FaRegCircleQuestion />
						</button>
					</div>
					<dialog ref={createTeacherDialogRef} className="modal">
						<div className="modal-box">
							<h3 className="font-bold text-lg">Create a new teacher</h3>
							<div className="form-control w-full">
								<label className="label">
									<span className="label-text">Name</span>
								</label>
								<input
									type="text"
									placeholder="Type here"
									className="input input-bordered w-full"
									disabled={dialogLoading}
									ref={nameRef}
									onKeyDown={(event) => {
										if (event.key === 'Enter') {
											event.preventDefault();
											emailRef.current?.focus();
										}
									}}
								/>
								<label className="label">
									<span className="label-text">Email</span>
								</label>
								<div className="join">
									<input
										type="text"
										placeholder="Type here"
										className="input input-bordered w-full join-item"
										disabled={dialogLoading}
										ref={emailRef}
										onKeyDown={(event) => {
											if (event.key === 'Enter') {
												event.preventDefault();
												submitBtnRef.current?.click();
											}
										}}
									/>
									<div className="flex justify-items-center p-2 bg-base-200 join-item min-w-fit">
										<p className="self-center">@{process.env.NEXT_PUBLIC_SCHOOL_EMAIL_DOMAIN}</p>
									</div>
								</div>
							</div>
							{dialogError && <p className="text-error">{dialogError}</p>}
							<div className="modal-action">
								<button
									className="btn btn-primary"
									disabled={dialogLoading}
									ref={submitBtnRef}
									onClick={() => {
										setDialogLoading(true);
										database.teachers
											.create(nameRef.current?.value, emailRef.current?.value)
											.then((teacher) => {
												nameRef.current!.value = '';
												emailRef.current!.value = '';
												setDialogError('');
												setTeachers((teachers) =>
													teachers
														? [...teachers, { ...teacher, checked: false }].sort((a, b) => a.name.localeCompare(b.name))
														: [{ ...teacher, checked: false }],
												);
												setAlert({
													type: 'success',
													message: 'Teacher created successfully',
												});
												createTeacherDialogRef.current?.close();
											})
											.catch((err: AppwriteException) => {
												setDialogError(err.message);
											})
											.finally(() => {
												setDialogLoading(false);
											});
									}}
								>
									{dialogLoading ? <span className="loading loading-dots"></span> : 'Create'}
								</button>
								<form method="dialog">
									{/* if there is a button in form, it will close the modal */}
									<button className="btn" disabled={dialogLoading}>
										Close
									</button>
								</form>
							</div>
						</div>
					</dialog>
				</div>
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
													onClick={(event) => event.stopPropagation()}
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
