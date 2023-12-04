'use client';

import { account } from '../../../libs/appwrite';

export default function Login() {
	return (
		<div className="flex flex-col justify-center items-center gap-5 h-full">
			<h1 className="text-4xl font-bold">CCS Sport Login</h1>
			<button className="btn btn-primary" onClick={account.login}>
				Login
			</button>
		</div>
	);
}
