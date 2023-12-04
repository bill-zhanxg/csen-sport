'use client';

import { AppwriteException } from 'appwrite';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

import { database } from '../../../../libs/appwrite';
import { TeacherDocument } from '../../../../libs/appwrite/Interface/Weekly-sport';
import { Error, Success } from '../../../components/Alert';
import { SkeletonBlock } from '../../../components/SkeletonBlock';

export default function Teacher({ params }: { params: { id: string } }) {
	const router = useRouter();

	const [data, setData] = useState<TeacherDocument | null>();
	const [alert, setAlert] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [canUpdate, setCanUpdate] = useState(false);
	const [updateLoading, setUpdateLoading] = useState(false);

	const emailRef = useRef<HTMLInputElement>(null);
	const updateButtonRef = useRef<HTMLButtonElement>(null);

	const deleteTeacherDialogRef = useRef<HTMLDialogElement>(null);
	const [deleteTeacherDialogLoading, setDeleteTeacherDialogLoading] = useState(false);
	const [deleteTeacherDialogError, setDeleteTeacherDialogError] = useState('');

	useEffect(() => {
		database.teachers
			.get(params.id)
			.then(setData)
			.catch((err: AppwriteException) => {
				setAlert({
					type: 'error',
					message: `Failed to load game list: ${err.message}`,
				});
			});
	}, [params.id]);

	useEffect(() => {
		if (data) {
			setName(data.name);
			setEmail(data.email);
		}
	}, [data]);

	useEffect(() => {
		if (data) {
			if (name !== data.name || email !== data.email) setCanUpdate(true);
			else setCanUpdate(false);
		}
	}, [data, name, email]);

	return (
		<>
			<main className="flex flex-col items-center gap-4 p-4 overflow-x-auto w-full">
				{data ? (
					<>
						<h1 className="text-3xl font-bold justify-center">Update Teacher Detail</h1>
						<div className="card w-10/12 max-w-6xl bg-base-100 shadow-xl">
							<div className="card-body gap-10">
								<div className="flex items-center gap-2">
									<IoIosArrowBack className="cursor-pointer" onClick={() => router.push('/teachers')} />
									<h3 className="card-title">{data.$id}</h3>
								</div>
								<div className="flex items-center gap-4">
									<p className="text-xl">Name:</p>
									<input
										type="text"
										value={name}
										onChange={(event) => {
											setName(event.target.value);
										}}
										disabled={updateLoading}
										className="input input-bordered w-4/5"
										onKeyDown={(event) => {
											if (event.key === 'Enter') {
												event.preventDefault();
												emailRef.current?.focus();
											}
										}}
									/>
								</div>
								<div className="flex items-center gap-4">
									<p className="text-xl">Email:</p>
									<input
										type="text"
										value={email}
										onChange={(event) => {
											setEmail(event.target.value);
										}}
										disabled={updateLoading}
										className="input input-bordered w-4/5"
										ref={emailRef}
										onKeyDown={(event) => {
											if (event.key === 'Enter') {
												event.preventDefault();
												updateButtonRef.current?.click();
											}
										}}
									/>
								</div>
								<div className="card-actions justify-end">
									<button
										className="btn btn-error"
										onClick={() => deleteTeacherDialogRef.current?.showModal()}
										disabled={updateLoading}
									>
										Delete
									</button>
									<button
										className="btn btn-primary"
										ref={updateButtonRef}
										onClick={() => {
											setUpdateLoading(true);
											database.teachers
												.update(data.$id, { name, email })
												.then((teacher) => {
													setData(teacher);
													setAlert({
														type: 'success',
														message: 'Successfully updated teacher detail',
													});
												})
												.catch((err: AppwriteException) => {
													setAlert({
														type: 'error',
														message: `Failed to update teacher detail: ${err.message}`,
													});
												})
												.finally(() => {
													setUpdateLoading(false);
												});
										}}
										disabled={!canUpdate || updateLoading}
									>
										Update
									</button>
								</div>
							</div>
						</div>
					</>
				) : data === null ? (
					<div className="flex flex-col gap-4">
						<h1 className="text-5xl font-bold">404</h1>
						<p className="text-xl">The current teacher can not be found, it might have been removed</p>
						<button className="btn btn-lg" onClick={() => router.push('/teachers')}>
							Go Back
						</button>
					</div>
				) : (
					<SkeletonBlock rows={2} />
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
								if (!data) return;
								setDeleteTeacherDialogLoading(true);
								database.teachers
									.delete(data.$id)
									.then(() => {
										setDeleteTeacherDialogError('');
										router.push('/teachers');
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
			{alert &&
				(alert.type === 'success' ? (
					<Success message={alert.message} setAlert={setAlert} />
				) : (
					<Error message={alert.message} setAlert={setAlert} />
				))}
		</>
	);
}
