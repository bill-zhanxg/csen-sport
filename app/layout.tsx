import SadCat from '@/app/images/sad-cat.png';
import { auth, signOut } from '@/libs/auth';
import { isBlocked, isDeveloper } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import BarOfProgress from './components/BarOfProgress';
import { FeedbackDialog } from './components/Feedback';
import { HandleUserTimezone } from './components/HandleUserTimezone';
import { NavBar } from './components/NavBar';
import { ReactJoyride } from './components/ReactJoyride';
import { SentrySetUser } from './components/SentrySetUser';
import './globals.css';

const xata = getXataClient();

export const metadata: Metadata = {
	title: 'CSEN Sport',
	description: 'CSEN Sport',
};

export default async function MainLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();
	const ip = headers().get('x-forwarded-for');

	async function ticketUnread() {
		'use server';
		if (!session) return false;
		const belongsTo = (
			await xata.db.tickets
				.filter({
					closed: false,
					'createdBy.id': isDeveloper(session) ? undefined : session?.user.id,
				})
				.select(['id'])
				.getAll()
		).map((ticket) => ticket.id);
		const unread = await xata.db.ticket_messages
			.filter({
				$all: {
					seen: false,
					ticket_id: {
						$any: belongsTo,
					},
					'sender.id': {
						$isNot: session?.user.id || '',
					},
				},
			})
			.getFirst();
		return !!unread;
	}
	async function logout() {
		'use server';
		await signOut();
	}

	const unread = await ticketUnread();

	return (
		<html lang="en">
			<body>
				{session ? (
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
							<NavBar session={session} initUnread={unread} ticketUnread={ticketUnread} logout={logout} />
							{children}
							<FeedbackDialog session={session} />
							<BarOfProgress />
							{session.user.auto_timezone && <HandleUserTimezone />}
							<SentrySetUser user={{ ...session.user, ip_address: ip }} />
							{!session.user.guided && <ReactJoyride />}
						</>
					)
				) : (
					children
				)}
			</body>
		</html>
	);
}
