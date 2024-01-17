import type { Metadata } from 'next';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';

import BarOfProgress from './components/BarOfProgress';
import { NavBar } from './components/NavBar';

import { auth } from '@/libs/auth';
import { LogoutButton } from './components/LogoutButton';
import { UserAvatar } from './globalComponents/UserAvatar';
import './globals.css';

export const metadata: Metadata = {
	title: 'CCS Sport',
	description: 'CCS Sport',
};

export default async function MainLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();

	return (
		<html lang="en">
			<body>
				{session ? (
					session.user.role === 'blocked' ? (
						<h1 className="text-2xl">Sorry but you&apos;re been blocked from accessing this site</h1>
					) : (
						<>
							<div className="navbar bg-base-200">
								<div className="navbar-start">
									<Link href="/" className="btn btn-ghost normal-case text-xl">
										<FaHome />
									</Link>
								</div>
								<NavBar session={session} />
								<div className="navbar-end">
									<div className="dropdown dropdown-end">
										<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
											<UserAvatar user={session.user} className="rounded-full" />
										</label>
										<ul
											tabIndex={0}
											className="menu menu-md dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-52"
										>
											<li>
												<LogoutButton />
											</li>
										</ul>
									</div>
								</div>
							</div>
							{children}
							<BarOfProgress />
						</>
					)
				) : (
					children
				)}
			</body>
		</html>
	);
}
