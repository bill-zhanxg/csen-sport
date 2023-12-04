'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { account } from '../../../libs/appwrite';

export default function Login() {
	const searchParams = useSearchParams();
	let href = searchParams.get('href');
	if (href) href = decodeURI(href);

	useEffect(() => {
		account
			.getSession(false)
			.then(() => location.replace('/'))
			.catch(() => {});
	}, []);

	return (
		<div className="flex flex-col justify-center items-center gap-3 h-full">
			<h1 className="text-4xl font-bold p-5">CCS Sport Login</h1>
			<button className="btn btn-primary w-4/5 max-w-[20rem]" onClick={() => account.login(href)}>
				Login
			</button>
		</div>
	);
}
