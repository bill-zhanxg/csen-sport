import SadCat from '@/images/sad-cat.png';
import { isBlocked } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import 'server-only';
import { Toaster } from 'sonner';
import { authC } from './cache';
import BarOfProgress from './components/BarOfProgress';
import { FeedbackDialog } from './components/Feedback';
import { HandleUserTimezone } from './components/HandleUserTimezone';
import { NavBar } from './components/NavBar';
import { SentrySetUser } from './components/SentrySetUser';
import { GenericLoading } from './globalComponents/GenericLoading';

import './globals.css';

export const metadata: Metadata = {
	title: {
		absolute: 'Home | CSEN Sport',
		template: '%s | CSEN Sport',
		default: 'CSEN Sport',
	},
	description:
		'CSEN is a system designed to streamline the CSEN schedule management for schools involved in Christian Schools Event Network (CSEN). Its purpose is to ensure everyone involved has easy access to important match details by organising and distributing CSEN schedules to students, coaches, and staff.',
};

const xata = getXataClient();

export default async function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<Suspense fallback={<GenericLoading />}>
					<Content>{children}</Content>
				</Suspense>

				<BarOfProgress />
				<Toaster richColors closeButton />
			</body>
		</html>
	);
}

async function Content({ children }: { children: React.ReactNode }) {
	const session = await authC();
	const ip = (await headers()).get('x-forwarded-for')?.split(':')[0];

	return session ? (
		isBlocked(session) ? (
			<>
				<h1 className="text-2xl">
					Sorry but you&apos;ve been blocked from accessing this site.{' '}
					<Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="link link-primary" target="_blank">
						Click here
					</Link>
				</h1>
				<Image src={SadCat} alt="Sad" width={1000} height={1000} className="w-52 h-52" />
			</>
		) : (
			<>
				<NavBar session={session}>{children}</NavBar>
				<FeedbackDialog session={session} />
				{session.user.auto_timezone && <HandleUserTimezone />}
				<SentrySetUser user={{ ...session.user, ip_address: ip }} />
				{/* TODO: Add this back after react joyride is fixed */}
				{/* {!session.user.guided && <ReactJoyride />} */}
			</>
		)
	) : (
		children
	);
}
