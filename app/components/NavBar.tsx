'use client';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import { useEffect, useRef, useState } from 'react';
import { CiBasketball, CiImport } from 'react-icons/ci';
import { FaBars, FaXmark } from 'react-icons/fa6';
import { FiExternalLink } from 'react-icons/fi';
import { HiOutlineClipboardDocumentList, HiOutlineCog, HiOutlineHome } from 'react-icons/hi2';
import { IoCreateOutline, IoSettingsOutline } from 'react-icons/io5';
import { LuUsersRound } from 'react-icons/lu';
import { MdOutlineShield } from 'react-icons/md';
import { useClickAway } from 'react-use';

import Icon from '@/images/csen-temp.png';
import { cn } from '@/lib/utils';
import { isAdmin } from '@/libs/checkPermission';

import { UserAvatar } from '../globalComponents/UserAvatar';
import { FeedbackButton } from './Feedback';

import type { Session } from 'next-auth';
const MENU_ITEMS: Array<{
	href: __next_route_internal_types__.RouteImpl<string>;
	name: string;
	authorize: ((session: Session) => boolean) | null;
	icon: React.ElementType;
}> = [
	{ href: '/', name: 'Home', authorize: null, icon: HiOutlineHome },
	{ href: '/weekly-sport/timetable', name: 'Weekly Sport Fixtures', authorize: null, icon: CiBasketball },
	{ href: '/users', name: 'Users', authorize: isAdmin, icon: LuUsersRound },
	{ href: '/teams', name: 'Teams', authorize: isAdmin, icon: MdOutlineShield },
	{ href: '/bulk', name: 'Bulk Action', authorize: isAdmin, icon: HiOutlineCog },
	{ href: '/weekly-sport/import', name: 'Import Timetable', authorize: isAdmin, icon: CiImport },
	{ href: '/weekly-sport/create', name: 'Create Timetable', authorize: isAdmin, icon: IoCreateOutline },
];

export function NavBar({ children, session }: { children: React.ReactNode; session: Session }) {
	const pathname = usePathname();

	const drawer = useRef<HTMLInputElement>(null);

	const accountMenu = useRef<HTMLDivElement>(null);
	const [showAccountMenu, setShowAccountMenu] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const authorizedMenuItems = MENU_ITEMS.filter((item) => !item.authorize || item.authorize(session));

	useEffect(() => {
		if (drawer.current) drawer.current.checked = false;
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setDrawerOpen(false);
	}, [pathname]);

	useClickAway(accountMenu, () => {
		setShowAccountMenu(false);
	});

	return (
		<div className="drawer h-full md:drawer-open">
			<input
				id="navbar-drawer"
				ref={drawer}
				type="checkbox"
				className="drawer-toggle"
				onChange={(e) => setDrawerOpen(e.target.checked)}
			/>

			<div className="drawer-content flex h-full w-full flex-col overflow-auto md:flex-row">
				<div className="navbar z-40 h-16 overflow-x-auto overflow-y-hidden border-b-2 bg-base-100 md:hidden">
					<div className="navbar-start">
						<label
							id="navbar-toggle"
							htmlFor="navbar-drawer"
							className={cn('btn btn-ghost swap swap-rotate', {
								'swap-active': drawerOpen,
							})}
						>
							<FaBars className="swap-off fill-current" />
							<FaXmark className="swap-on fill-current" />
						</label>
					</div>
					<div className="navbar-center">
						<Link className="btn btn-ghost text-xl" href="/">
							CSEN Victoria
						</Link>
					</div>
					<div className="navbar-end"></div>
				</div>

				<div className="flex flex-col h-full w-full min-h-0">
					<div className="flex-1 overflow-auto">{children}</div>

					<div className="dock sticky md:hidden border-t-2 border-base-300">
						<DockMenuItem href="/" name="Home" icon={HiOutlineHome} />
						<DockMenuItem href="/weekly-sport/timetable" name="Fixtures" icon={CiBasketball} />
						<DockMenuItem href="/settings" name="Settings" icon={IoSettingsOutline} />
					</div>
				</div>
			</div>

			<div className="drawer-side z-30">
				<label htmlFor="navbar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
				<ul className="flex h-full min-h-full w-64 min-w-64 flex-col items-center overflow-y-auto bg-base-100 shadow-lg shadow-base-300 border-r border-base-300">
					<li className="hidden w-full items-center justify-center md:flex">
						<Link className="flex h-full w-full items-center justify-center p-6" href="/">
							<Image src={Icon} alt="CSEN Logo" width={100} height={100} priority className="h-auto w-auto" />
						</Link>
					</li>
					<li id="navbar-list" className="mt-16 flex h-full w-full flex-col justify-between md:mt-0">
						<div className="w-full">
							{/* Normal/Public Section */}
							<ul className="menu w-full bg-base-100">
								{authorizedMenuItems
									.filter((item) => !item.authorize)
									.map((item) => (
										<MenuItem key={item.href} href={item.href} name={item.name} icon={item.icon} />
									))}
								<MenuItem
									href="https://www.csen.au/semester-sport/"
									name="CSEN Website"
									icon={FiExternalLink}
									external={true}
								/>
							</ul>

							{/* Admin Section */}
							{authorizedMenuItems.some((item) => item.authorize) && (
								<div className="mt-4">
									<div className="px-4 py-2 border-t border-base-300">
										<p className="text-xs font-semibold uppercase tracking-wider text-base-content/60">Admin</p>
									</div>
									<ul className="menu w-full bg-base-100">
										{authorizedMenuItems
											.filter((item) => item.authorize)
											.map((item) => (
												<MenuItem key={item.href} href={item.href} name={item.name} icon={item.icon} />
											))}
									</ul>
								</div>
							)}
						</div>
						<ul className="menu sticky bottom-0 w-full border-t-2 border-base-300 bg-base-100 z-10">
							<MenuItem href="/settings" name="User Settings" icon={IoSettingsOutline} />
							<MenuItem href="/changelog" name="Changelog" icon={HiOutlineClipboardDocumentList} />
							<li>
								<FeedbackButton />
							</li>
							<li>
								<ProfileMenu session={session} setShowAccountMenu={(value: boolean) => setShowAccountMenu(value)} />
							</li>
						</ul>
					</li>
				</ul>
			</div>

			{showAccountMenu && (
				<div className="absolute bottom-16 left-20 z-50 sm:bottom-2 sm:left-64" ref={accountMenu}>
					<ul className="menu w-40 bg-base-100 shadow-xl border border-base-300">
						<li>
							<form
								className="contents"
								action={() => signOut()}
								onSubmit={() => {
									// Start the progress bar
									NProgress.start();
								}}
							>
								<button type="submit" id="logout-btn" className="btn btn-error btn-sm">
									Logout
								</button>
							</form>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
}

function MenuItem({
	href,
	name,
	icon: Icon,
	external = false,
}: {
	href: __next_route_internal_types__.RouteImpl<string>;
	name: string;
	icon: React.ElementType;
	external?: boolean;
}) {
	const pathname = usePathname();

	return (
		<li>
			{pathname === href && !external && (
				<motion.div
					layoutId="main-mobile-nav-bar"
					className="absolute h-full w-full rounded-lg bg-base-300 transition-none hover:bg-base-300"
				/>
			)}
			{external ? (
				<a href={href} target="_blank" rel="noopener noreferrer" className="z-10 flex items-center gap-3">
					<Icon className="h-5 w-5" />
					{name}
				</a>
			) : (
				<Link href={href} className="z-10 flex items-center gap-3">
					<Icon className="h-5 w-5" />
					{name}
				</Link>
			)}
		</li>
	);
}

function DockMenuItem({
	href,
	name,
	icon: Icon,
}: {
	href: __next_route_internal_types__.RouteImpl<string>;
	name: string;
	icon: React.ElementType;
}) {
	const pathname = usePathname();

	return (
		<Link href={href} className={pathname === href ? 'dock-active' : undefined}>
			<Icon className="h-5 w-5" />
			<span className="dock-label">{name}</span>
		</Link>
	);
}

function ProfileMenu({
	session,
	setShowAccountMenu,
}: {
	session: Session;
	setShowAccountMenu: (value: boolean) => void;
}) {
	return (
		<div tabIndex={0} role="button" className="flex items-center gap-2" onClick={() => setShowAccountMenu(true)}>
			<UserAvatar user={session.user} className="h-10! w-10! rounded-full!" />
			<div className="overflow-hidden">
				<p className="truncate font-bold">{session.user.name}</p>
				<p className="truncate opacity-60">{session.user.email}</p>
			</div>
		</div>
	);
}
