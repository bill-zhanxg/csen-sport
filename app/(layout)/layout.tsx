import type { Metadata } from 'next';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';

import { AccountMenu } from '../components/AccountMenu';
import BarOfProgress from '../components/BarOfProgress';
import { NavBar } from '../components/NavBar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<div className="navbar bg-base-200">
				<div className="navbar-start">
					<Link href="/" className="btn btn-ghost normal-case text-xl">
						<FaHome />
					</Link>
				</div>
				<NavBar />
				<div className="navbar-end">
					<AccountMenu />
				</div>
			</div>
			{children}
			<BarOfProgress />
		</>
	);
}
