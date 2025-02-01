'use client';

import { isAdmin } from '@/libs/checkPermission';
import { motion } from 'framer-motion';
import type { Session } from 'next-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo, MouseEventHandler, use, useEffect, useMemo, useState } from 'react';
import { FaBars, FaExternalLinkAlt, FaHome } from 'react-icons/fa';
import { UserAvatar } from '../globalComponents/UserAvatar';
import { TicketEventType } from '../tickets/types';
import { FeedbackButton } from './Feedback';
import NProgress from 'nprogress';

type Menu = {
	id: string;
	name: string;
	href: string | { id: string; name: string; href: string; admin?: boolean }[];
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
		id: 'tickets-btn',
		name: 'Tickets',
		href: '/tickets',
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
				id: 'venues-btn',
				name: 'Venues',
				href: '/venues',
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
	unread,
	onClick,
}: {
	mobile?: boolean;
	item: Menu[number];
	unread: boolean;
	onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
	const badge = item.id === 'tickets-btn' && unread;

	const suffix = mobile ? '-mobile' : '';
	return (
		<Link
			id={item.id + suffix}
			href={item.href as string}
			onClick={onClick}
			target={item.external ? '_blank' : '_self'}
			className={`flex items-center gap-2`}
		>
			<div className="indicator">
				{badge && <span className="indicator-item badge badge-primary h-1 p-1 [--tw-translate-x:120%]"></span>}
				{item.name}
			</div>
			{item.external && <FaExternalLinkAlt />}
		</Link>
	);
});

export function NavBar({
	session,
	initUnread,
	ticketUnread,
	logout,
}: {
	session: Session;
	initUnread: Promise<boolean>;
	ticketUnread: () => Promise<boolean>;
	logout: () => Promise<void>;
}) {
	const pathname = usePathname();

	const [unread, setUnread] = useState(use(initUnread));
	const [recheck, setRecheck] = useState(false);

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [accountMenuOpen, setAccountMenuOpen] = useState(false);

	useEffect(() => {
		const eventSource = new EventSource('/tickets/ticket-stream');
		eventSource.onmessage = async (event) => {
			const data = JSON.parse(event.data) as TicketEventType;
			if (data.type === 'new-message' && data.message.sender?.id !== session.user.id) setUnread(true);
			else if (data.type === 'update-message' || data.type === 'toggle-status') setRecheck(true);
		};

		return () => {
			eventSource.close();
		};
	}, [session]);

	useEffect(() => {
		if (recheck)
			ticketUnread()
				.then(setUnread)
				.finally(() =>
					setTimeout(() => {
						setRecheck(false);
					}, 3000),
				);
	}, [recheck, ticketUnread]);

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
											<MenuItem mobile item={item} unread={unread} onClick={closeDropdown} />
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
								<MenuItem mobile item={item} unread={unread} onClick={closeDropdown} />
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
													unread={unread}
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
								<MenuItem item={item} unread={unread} />
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
		(element as HTMLElement).blur();
	}
}
