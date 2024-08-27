import SadCat from '@/app/images/sad-cat.png';
import { auth, signOut } from '@/libs/auth';
import { isBlocked, isDeveloper } from '@/libs/checkPermission';
import { getXataClient } from '@/libs/xata';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { FaBars, FaHome } from 'react-icons/fa';
import 'server-only';
import BarOfProgress from './components/BarOfProgress';
import { FeedbackDialog } from './components/Feedback';
import { HandleUserTimezone } from './components/HandleUserTimezone';
import { NavBar } from './components/NavBar';
import { SentrySetUser } from './components/SentrySetUser';
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
							{/* Show Navbar Skeleton */}
							<Suspense
								fallback={
									<div className="navbar bg-base-200 border-b-2 border-base-300 shadow-lg shadow-base-300 h-[70px]">
										<div className="navbar-start">
											<Link id="home-btn" href="/" className="relative btn btn-ghost normal-case text-xl z-10">
												<FaHome className="z-10" />
											</Link>
										</div>
										<div className="dropdown w-full sm:hidden">
											<label tabIndex={0} className="btn btn-ghost sm:hidden w-full">
												<FaBars />
											</label>
											<ul
												id="mobile-menu"
												tabIndex={0}
												className="menu menu-md dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box border border-primary w-full overflow-auto"
											>
												<li className="w-full h-32 skeleton"></li>
											</ul>
										</div>
										<div className="navbar-center hidden sm:flex">
											<ul className="menu menu-horizontal px-1 z-[100]">
												<li className="w-96 h-10 skeleton"></li>
											</ul>
										</div>
										<div className="navbar-end">
											<div className="dropdown dropdown-end">
												<div className="flex items-center h-full">
													<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
														<div className="w-12 h-12 hover:shadow-lg shadow-cyan-500/50 rounded-full skeleton"></div>
													</label>
												</div>
												<ul
													id="user-menu"
													tabIndex={0}
													className="menu menu-md dropdown-content mt-3 z-[100] p-2 shadow-xl bg-base-100 rounded-box w-52 border border-primary"
												>
													<li>
														<Link id="user-settings-btn" href="/settings">
															User Settings
														</Link>
													</li>
													<li>
														<Link id="changelog-btn" href="/changelog">
															Changelogs
														</Link>
													</li>
													<li>
														<button className="skeleton">Submit a Bug / Feedback</button>
													</li>
													<li>
														<form className="menu-title !p-0" action={logout}>
															<button
																type="submit"
																id="logout-btn"
																className="bg-red-600 hover:bg-red-800 text-white rounded-lg px-4 py-2 text-sm w-full transition duration-200 active:bg-red-950"
															>
																Logout
															</button>
														</form>
													</li>
												</ul>
											</div>
										</div>
									</div>
								}
							>
								<NavBar session={session} initUnread={ticketUnread()} ticketUnread={ticketUnread} logout={logout} />
							</Suspense>
							{children}
							<FeedbackDialog session={session} />
							<BarOfProgress />
							{session.user.auto_timezone && <HandleUserTimezone />}
							<SentrySetUser user={{ ...session.user, ip_address: ip }} />
							{/* TODO: Add this back after react joyride is fixed */}
							{/* {!session.user.guided && <ReactJoyride />} */}
						</>
					)
				) : (
					children
				)}
			</body>
		</html>
	);
}
