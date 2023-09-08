'use client';

import { useRef, useState } from 'react';

import { Error } from '../../components/Error';
import { login } from '../../libs/appwrite';
import { logDebug, logInfo } from '../../libs/logger';

export default function Login() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);

	return (
		<>
			<main className="flex justify-center items-center h-full">
				<div className="flex flex-col justify-center bg-base-200 p-10 rounded-lg sm:w-1/2 w-full min-w-[10rem]">
					<h1 className="text-center font-bold mb-4">CCS Sport Login</h1>
					<form
						className="form-control w-full"
						onSubmit={(event) => {
							logDebug('Login form submitted');
							event.preventDefault();
							setLoading(true);
							setError('');
							login(email.current?.value, password.current?.value)
								.then(() => {
									logInfo('Login successful');
									setError('');
									location.href = '/';
								})
								.catch((error: Error) => setError(error.message))
								.finally(() => setLoading(false));
						}}
					>
						<label className="label">Email</label>
						<input
							type="text"
							disabled={loading}
							ref={email}
							placeholder="Type here"
							className="input input-bordered w-full"
						/>
						<label className="label">Password</label>
						<input
							type="password"
							disabled={loading}
							ref={password}
							placeholder="Type here"
							className="input input-bordered w-full"
						/>
						<button type="submit" disabled={loading} className="btn btn-primary mt-4">
							Login
						</button>
					</form>
				</div>
			</main>
			{error && <Error message={error} />}
		</>
	);
}
