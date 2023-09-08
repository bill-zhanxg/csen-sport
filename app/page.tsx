'use client';

import { useRef, useState } from 'react';

import { Error } from '../components/Error';

export default function Home() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);

	return (
		<>
			<main className="flex justify-center items-center h-full">hello world</main>
			{error && <Error message={error} />}
		</>
	);
}
