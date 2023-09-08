'use client';

import type { Metadata } from 'next';
import { useEffect } from 'react';

import { getSession } from '../libs/appwrite';

import './globals.css';

export const metadata: Metadata = {
	title: 'CCS Sport',
	description: 'CCS Sport',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		getSession().then((session) => {
			console.log(session);
		});
	}, []);

	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
