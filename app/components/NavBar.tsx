'use client';
import { isAdmin } from '@/libs/checkPermission';
import { motion } from 'framer-motion';
import type { Session } from 'next-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import { memo, MouseEventHandler, useEffect, useMemo, useState } from 'react';
import { FaBars, FaExternalLinkAlt, FaHome } from 'react-icons/fa';
import { UserAvatar } from '../globalComponents/UserAvatar';
import { FeedbackButton } from './Feedback';

type Menu = {
	id: string;
	name: string;
	href:
		| __next_route_internal_types__.RouteImpl<string>
		| { id: string; name: string; href: __next_route_internal_types__.RouteImpl<string>; admin?: boolean }[];
	admin?: boolean;
	external?: boolean;
}[];
const menu: Menu = [
	{
		id: 'weekly-sport-btn',
		name: 'Weekly Sport',
		href: '/weekly-sport/timetable',
	},
	{
		id: 'csen-btn',
		name: 'CSEN',
		href: 'https://www.csen.au/semester-sport/',
		external: true,
	},
	{
		id: 'admin-control-btn',
		name: 'Admin Controls',
		admin: true,
		href: [
			{
				id: 'users-btn',
				name: 'Users',
				href: '/users',
			},
			{
				id: 'teams-btn',
				name: 'Teams',
				href: '/teams',
			},
			{
				id: 'bulk-action-btn',
				name: 'Bulk Action',
				href: '/bulk',
			},
			{
				id: 'import-timetables-btn',
				name: 'Import Timetable',
				href: '/weekly-sport/import',
			},
			{
				id: 'create-timetables-btn',
				name: 'Create Timetable',
				href: '/weekly-sport/create',
			},
		],
	},
];

const MenuItem = memo(function MenuItem({
	mobile = false,
	item,
	onClick,
}: {
	mobile?: boolean;
	item: Menu[number];
	onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
	const suffix = mobile ? '-mobile' : '';
	return (
		<Link
			id={item.id + suffix}
			href={item.href as __next_route_internal_types__.RouteImpl<string>}
			onClick={onClick}
			target={item.external ? '_blank' : '_self'}
			className={`flex items-center gap-2`}
			prefetch={false}
		>
			<div className="indicator">{item.name}</div>
			{item.external && <FaExternalLinkAlt />}
		</Link>
	);
});

export function NavBar({ session, logoutAction: logout }: { session: Session; logoutAction: () => Promise<void> }) {
	const pathname = usePathname();

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [accountMenuOpen, setAccountMenuOpen] = useState(false);

	useEffect(() => {
		// Close desktop menu detail tags
		function closeMenu(e: MouseEvent) {
			document.querySelectorAll('.click-close').forEach((dropdown) => {
				const target = e.target as Node;
				if (!dropdown.contains(target)) {
					(dropdown as HTMLDetailsElement).open = false;
				}
			});
		}

		window.addEventListener('click', closeMenu);
		return () => {
			window.removeEventListener('click', closeMenu);
		};
	}, []);

	const menuFiltered = useMemo(
		() =>
			isAdmin(session)
				? menu
				: menu
						.filter((item) => !item.admin)
						.map((item) =>
							Array.isArray(item.href) ? { ...item, href: item.href.filter((item) => !item.admin) } : item,
						),
		[session],
	);

	return (
		<div className="navbar bg-base-200 border-b-2 border-base-300 shadow-lg shadow-base-300 h-[70px]">
			<div className="navbar-start">
				<Link id="home-btn" href="/" className="relative btn btn-ghost normal-case text-xl z-10">
					{pathname === '/' && (
						<motion.div
							layoutId="main-desktop-nav-bar"
							className="w-full h-full absolute left-0 bg-base-300 rounded-lg transition-none hover:bg-base-300 hidden sm:block"
						/>
					)}
					<FaHome className="z-10" />
				</Link>
			</div>
			<div className="dropdown w-full sm:hidden">
				<label
					tabIndex={0}
					className="btn btn-ghost sm:hidden w-full"
					onMouseDown={() => {
						if (mobileMenuOpen) setTimeout(() => closeDropdown(), 0);
					}}
					// We need this stupid timeout because safari is stupid
					onFocus={() => setTimeout(() => setMobileMenuOpen(true), 0)}
					onBlur={() => setTimeout(() => setMobileMenuOpen(false), 0)}
				>
					<FaBars />
				</label>
				<ul
					id="mobile-menu"
					tabIndex={0}
					className="menu menu-md dropdown-content mt-3 z-100 p-2 shadow-sm bg-base-100 rounded-box border border-primary w-full overflow-auto"
				>
					{menuFiltered.map((item) =>
						Array.isArray(item.href) ? (
							<li key={item.id}>
								<a id={item.id + '-mobile'}>{item.name}</a>
								<ul className="p-2">
									{item.href.map((item) => (
										<li key={item.id}>
											{pathname === item.href && (
												<motion.div
													layoutId="main-mobile-nav-bar"
													className="w-full h-full absolute bg-base-200 rounded-lg transition-none hover:bg-base-200"
												/>
											)}
											<MenuItem mobile item={item} onClick={closeDropdown} />
										</li>
									))}
								</ul>
							</li>
						) : (
							<li key={item.id}>
								{pathname === item.href && (
									<motion.div
										layoutId="main-mobile-nav-bar"
										className="w-full h-full absolute bg-base-200 rounded-lg transition-none hover:bg-base-200"
									/>
								)}
								<MenuItem mobile item={item} onClick={closeDropdown} />
							</li>
						),
					)}
				</ul>
			</div>
			<div className="navbar-center hidden sm:flex">
				<ul className="menu menu-horizontal px-1 z-100">
					{menuFiltered.map((item) =>
						Array.isArray(item.href) ? (
							<li key={item.id}>
								<details className="click-close">
									<summary id={item.id}>{item.name}</summary>
									<ul className="p-2 border border-primary">
										{item.href.map((item) => (
											<li className="w-36 " key={item.id}>
												{pathname === item.href && (
													<motion.div
														layoutId="main-desktop-nav-bar"
														className="w-full h-full absolute left-0 bg-base-200 rounded-lg transition-none hover:bg-base-200"
													/>
												)}
												<MenuItem
													item={item}
													onClick={(event) => {
														const details = event.currentTarget.parentElement?.parentElement
															?.parentElement as HTMLDetailsElement;
														if (details) details.open = false;
													}}
												/>
											</li>
										))}
									</ul>
								</details>
							</li>
						) : (
							<li key={item.id}>
								{pathname === item.href && (
									<motion.div
										layoutId="main-desktop-nav-bar"
										className="w-full h-full absolute bg-base-300 rounded-lg transition-none hover:bg-base-300"
									/>
								)}
								<MenuItem item={item} />
							</li>
						),
					)}
				</ul>
			</div>
			<div className="navbar-end">
				<div className="dropdown dropdown-end">
					<div
						className="flex items-center h-full"
						onMouseDown={() => {
							if (accountMenuOpen) setTimeout(() => closeDropdown(), 0);
						}}
						// We need this stupid timeout because safari is stupid
						onFocus={() => setTimeout(() => setAccountMenuOpen(true), 0)}
						onBlur={() => setTimeout(() => setAccountMenuOpen(false), 0)}
					>
						<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
							<UserAvatar user={session.user} className="rounded-full" />
						</label>
					</div>
					<ul
						id="user-menu"
						tabIndex={0}
						className="menu menu-md dropdown-content mt-3 z-100 p-2 shadow-xl bg-base-100 rounded-box w-52 border border-primary"
					>
						<li>
							<Link id="user-settings-btn" href="/settings" onClick={closeDropdown}>
								User Settings
							</Link>
						</li>
						<li>
							<Link id="changelog-btn" href="/changelog" onClick={closeDropdown}>
								Changelogs
							</Link>
						</li>
						<li>
							<FeedbackButton />
						</li>
						<li>
							<form
								className="menu-title p-0!"
								action={logout}
								onSubmit={() => {
									// Start the progress bar
									NProgress.start();
								}}
							>
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
	);
}

function closeDropdown() {
	const element = document.activeElement;
	if (element && 'blur-sm' in element) {
		(element as unknown as HTMLElement).blur();
	}
}
