'use client';

import { isAdmin } from '@/libs/checkPermission';
import { Session } from 'next-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MouseEventHandler, useEffect, useState } from 'react';
import { FaBars, FaExternalLinkAlt } from 'react-icons/fa';
import { TicketEventType } from '../tickets/types';

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

export function NavBar({
	session,
	initUnread,
	ticketUnread,
}: {
	session: Session;
	initUnread: boolean;
	ticketUnread: () => Promise<boolean>;
}) {
	const [unread, setUnread] = useState(initUnread);
	const [recheck, setRecheck] = useState(false);

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

	const menuFiltered = isAdmin(session)
		? menu
		: menu
				.filter((item) => !item.admin)
				.map((item) => (Array.isArray(item.href) ? { ...item, href: item.href.filter((item) => !item.admin) } : item));

	return (
		<>
			<div className="dropdown w-full sm:w-0">
				<label tabIndex={0} className="btn btn-ghost sm:hidden w-full">
					<FaBars />
				</label>
				<ul
					id="mobile-menu"
					tabIndex={0}
					className="menu menu-md dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box border border-primary w-full"
				>
					{menuFiltered.map((item) =>
						Array.isArray(item.href) ? (
							<li key={item.id}>
								<a id={item.id + '-mobile'}>{item.name}</a>
								<ul className="p-2">
									{item.href.map((item) => (
										<li key={item.id}>
											<MenuItem mobile item={item} onClick={handleMobileLiClick} />
										</li>
									))}
								</ul>
							</li>
						) : (
							<li key={item.id}>
								<MenuItem mobile item={item} onClick={handleMobileLiClick} />
							</li>
						),
					)}
				</ul>
			</div>
			<div className="navbar-center hidden sm:flex">
				<ul className="menu menu-horizontal px-1 z-[100]">
					{menuFiltered.map((item) =>
						Array.isArray(item.href) ? (
							<li key={item.id}>
								<details>
									<summary id={item.id}>{item.name}</summary>
									<ul className="p-2 border border-primary">
										{item.href.map((item) => (
											<li className="w-36" key={item.id}>
												<MenuItem
													item={item}
													onClick={(event) => {
														const details = event.currentTarget.parentElement?.parentElement
															?.parentElement as HTMLDetailsElement;
														details.open = false;
													}}
												/>
											</li>
										))}
									</ul>
								</details>
							</li>
						) : (
							<li key={item.id}>
								<MenuItem item={item} />
							</li>
						),
					)}
				</ul>
			</div>
		</>
	);

	function MenuItem({
		mobile = false,
		item,
		onClick,
	}: {
		mobile?: boolean;
		item: Menu[number];
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
			>
				<div className="indicator">
					{badge && <span className="indicator-item badge badge-primary h-1 p-1 [--tw-translate-x:120%]"></span>}
					{item.name}
				</div>
				{item.external && <FaExternalLinkAlt />}
			</Link>
		);
	}

	function handleMobileLiClick() {
		const element = document.activeElement;
		if (element && 'blur' in element) {
			(element as HTMLElement).blur();
		}
	}
}
