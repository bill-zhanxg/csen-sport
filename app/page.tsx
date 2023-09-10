'use client';

import { useEffect, useState } from 'react';

import { AppwriteException } from 'appwrite';
import { Error } from '../components/Error';
import { database } from '../libs/appwrite';

export default function Home() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		database
			.getMyGames()
			.then((games) => {
				console.log(games);
			})
			.catch((err: AppwriteException) => {
				setError(`Failed to load game list: ${err.message}`);
			});
	}, []);

	return (
		<>
			<main className="flex flex-col p-4 w-full">
				<h1>Your upcoming events:</h1>
			</main>
			{error && <Error message={error} setMessage={setError} />}
		</>
	);
}
