import type { Metadata } from 'next';
import Link from 'next/link';
import { FaBars, FaHome } from 'react-icons/fa';

import { AccountMenu } from './components/AccountMenu';
import './globals.css';
import BarOfProgress from './components/BarOfProgress';

export const metadata: Metadata = {
	title: 'CCS Sport',
	description: 'CCS Sport',
};

const menu = [
	{
		name: 'Weekly Sport',
		href: '/weekly-sport',
	},
	{
		name: 'Teachers',
		href: '/teachers',
	},
	{
		name: 'Users',
		href: '/users',
	},
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<div className="navbar bg-base-200">
					<div className="navbar-start">
						<Link href="/" className="btn btn-ghost normal-case text-xl">
							<FaHome />
						</Link>
					</div>
					<div className="dropdown w-full sm:w-0">
						<label tabIndex={0} className="btn btn-ghost sm:hidden w-full">
							<FaBars />
						</label>
						<ul
							tabIndex={0}
							className="menu menu-lg dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-full"
						>
							{menu.map((item, i) => (
								<li key={i}>
									<Link href={item.href}>{item.name}</Link>
								</li>
							))}
						</ul>
					</div>
					<div className="navbar-center hidden sm:flex">
						<ul className="menu menu-horizontal px-1">
							{menu.map((item, key) => (
								<li key={key}>
									<Link href={item.href}>{item.name}</Link>
								</li>
							))}
						</ul>
					</div>
					<div className="navbar-end">
						<AccountMenu />
					</div>
				</div>
				{children}
				<BarOfProgress />
			</body>
		</html>
	);
}
