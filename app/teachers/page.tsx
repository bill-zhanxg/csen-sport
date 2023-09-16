'use client';

import { AppwriteException } from 'appwrite';
import { useEffect, useState } from 'react';

import { database } from '../../libs/appwrite';
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
						onClick={() => {
							fetch('../users/api', {
								method: 'GET',
							});
						}}
					>
						Create New Teacher
					</button>
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
