'use client';

import { useEffect, useRef, useState } from 'react';

import { Error } from '../components/Error';
import { getSession } from '../libs/appwrite';

export default function Home() {
	useEffect(() => {
		setError('hello world');
		getSession().then((session) => {
			console.log(session);
		});
	}, []);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);

	return (
		<>
			{/* <button onClick={logout}>Logout</button> */}
			<main className="flex flex-col items-center w-full">
				<div>Date 1/1/1111</div>
				<div className="overflow-x-auto w-full">
					<table className="table">
						{/* head */}
						<thead>
							<tr>
								<th>Team</th>
								<th>Opponent</th>
								<th>Venue</th>
								<th>Teacher</th>
								<th>Transportation</th>
								<th>Out of Class</th>
								<th>Start time</th>
							</tr>
						</thead>
						<tbody>
							{/* row 1 */}
							<tr>
								<td>Boys bball</td>
								<td>School Name</td>
								<td>Somewhere</td>
								<td>Person</td>
								<td>Bus</td>
								<td>3pm</td>
								<td>4pm</td>
							</tr>
							{/* row 2 */}
							<tr>
								<td>Girls bball</td>
								<td>Hehehe</td>
								<td>Somewhere</td>
								<td>Someone</td>
								<td>Bus</td>
								<td>3pm</td>
								<td>4pm</td>
							</tr>
						</tbody>
					</table>
				</div>
			</main>
			{error && <Error message={error} setMessage={setError} />}
		</>
	);
}
