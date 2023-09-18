'use client';

import { AppwriteException } from 'appwrite';
import { useEffect, useState } from 'react';

import { account, database } from '../../libs/appwrite';
import { QueryPickDocument, TeacherDocument } from '../../libs/appwrite/Interface/Weekly-sport';
import { Error } from '../components/Error';
import { SkeletonBlock } from '../components/SkeletonBlock';

export default function Teachers() {
	const [teachers, setTeachers] = useState<QueryPickDocument<TeacherDocument, '$id' | 'name' | 'email'>[]>();
	const [error, setError] = useState('');

	useEffect(() => {
		database.teachers
			.getAll()
			.then(setTeachers)
			.catch((err: AppwriteException) => {
				setError(`Failed to load teacher list: ${err.message}`);
			});
	}, []);

	return (
		<>
			<main className="flex flex-col items-center gap-4 p-4 overflow-x-auto w-full">
				<div className="flex justify-end gap-3 w-full">
					<button
						className="btn btn-primary"
						onClick={(event) => (event.currentTarget.nextElementSibling as HTMLDialogElement).showModal()}
					>
						Create New Teacher
					</button>
					<dialog className="modal">
						<div className="modal-box">
							<h3 className="font-bold text-lg">Create a new teacher</h3>
							<div className="form-control w-full">
								<label className="label">
									<span className="label-text">Name</span>
								</label>
								<input type="text" placeholder="Type here" className="input input-bordered w-full" />
								<label className="label">
									<span className="label-text">Email</span>
								</label>
								<div className="join">
									<input type="text" placeholder="Type here" className="input input-bordered w-full join-item" />
									<div className="flex justify-items-center p-2 bg-base-200 join-item">
										<p className="self-center">@{process.env.NEXT_PUBLIC_SCHOOL_EMAIL_DOMAIN}</p>
									</div>
								</div>
							</div>
							<div className="modal-action">
								<button
									className="btn btn-primary"
									onClick={() => {
										account
											.getJWT()
											.then((jwt) => {
												fetch('../users/api', {
													method: 'GET',
													headers: {
														'X-Appwrite-JWT': jwt,
													},
												});
											})
											.catch((err: AppwriteException) => {
												setError(`Failed to create JWT: ${err.message}`);
											});
									}}
								>
									Create
								</button>
								<form method="dialog">
									{/* if there is a button in form, it will close the modal */}
									<button className="btn">Close</button>
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
									{/* TODO: Checkbox */}
									<th>
										<label>
											<input type="checkbox" className="checkbox" />
										</label>
									</th>
									<th>Name</th>
									<th>Email</th>
								</tr>
							</thead>
							<tbody>
								{teachers.map((teacher) => (
									<tr className="hover cursor-pointer" key={teacher.$id}>
										<th>
											<label>
												<input type="checkbox" className="checkbox" />
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
			{error && <Error message={error} setMessage={setError} />}
		</>
	);
}
