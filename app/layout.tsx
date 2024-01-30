import SadCat from '@/app/images/sad-cat.png';
import { auth } from '@/libs/auth';
import { isBlocked } from '@/libs/checkPermission';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import BarOfProgress from './components/BarOfProgress';
import { LogoutButton } from './components/LogoutButton';
import { NavBar } from './components/NavBar';
import { ReactJoyride } from './components/ReactJoyride';
import { SentrySetUser } from './components/SentrySetUser';
import { UserAvatar } from './globalComponents/UserAvatar';
import './globals.css';

export const metadata: Metadata = {
	title: 'CSEN Sport',
	description: 'CSEN Sport',
};

export default async function MainLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();
	const ip = headers().get('x-forwarded-for');

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
							<div className="navbar bg-base-200 border-b-2 border-base-300 shadow-lg shadow-base-300">
								<div className="navbar-start">
									<Link id="home-btn" href="/" className="btn btn-ghost normal-case text-xl">
										<FaHome />
									</Link>
								</div>
								<NavBar session={session} />
								<div className="navbar-end">
									<div className="dropdown dropdown-end">
										<div className="flex items-center h-full">
											<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
												<UserAvatar user={session.user} className="rounded-full" />
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
												<LogoutButton />
											</li>
										</ul>
									</div>
								</div>
							</div>
							{children}
							<BarOfProgress />
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
