'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { account } from '../../libs/appwrite';
import { SkeletonBlock } from './SkeletonBlock';

const menu = [
	{
		name: 'Weekly Sport',
		href: [
			{
				name: 'Timetable',
				href: '/weekly-sport/timetable',
			},
			{
				name: 'Teachers',
				href: '/weekly-sport/teachers',
			},
			{
				name: 'Import',
				href: '/weekly-sport/import',
			},
		],
	},
	{
		name: 'Users',
		href: '/users',
		admin: true,
	},
	{
		name: 'CSEN',
		href: '/csen',
	},
	{
		name: 'Weekly Sport PDF',
		href: '/weekly-sport-pdf',
	},
	{
		name: 'Ladders',
		href: '/ladder',
	},
	{
		name: 'Test',
		href: '/test',
	},
];

export function NavBar() {
	const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

	useEffect(() => {
		account
			.checkAdministrator()
			.then(setIsAdmin)
			.catch(() => setIsAdmin(false));
	}, []);

	if (isAdmin === null) return <SkeletonBlock rows={1} height={49} />;
	const menuFiltered = isAdmin ? menu : menu.filter((item) => !item.admin);

	return (
		<>
			<div className="dropdown w-full sm:w-0">
				<label tabIndex={0} className="btn btn-ghost sm:hidden w-full">
					<FaBars />
				</label>
				<ul
					tabIndex={0}
					className="menu menu-lg dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-full"
				>
					{menuFiltered.map((item, i) =>
						Array.isArray(item.href) ? (
							<li key={i}>
								<a>{item.name}</a>
								<ul className="p-2">
									{item.href.map((item, i) => (
										<li key={i}>
											<Link href={item.href}>{item.name}</Link>
										</li>
									))}
								</ul>
							</li>
						) : (
							<li key={i}>
								<Link href={item.href}>{item.name}</Link>
							</li>
						),
					)}
				</ul>
			</div>
			<div className="navbar-center hidden sm:flex">
				<ul className="menu menu-horizontal px-1 z-[100]">
					{menuFiltered.map((item, i) =>
						Array.isArray(item.href) ? (
							<li key={i}>
								<details>
									<summary>{item.name}</summary>
									<ul className="p-2">
										{item.href.map((item, i) => (
											<li className='w-32' key={i}>
												<Link href={item.href}>{item.name}</Link>
											</li>
										))}
									</ul>
								</details>
							</li>
						) : (
							<li key={i}>
								<Link href={item.href}>{item.name}</Link>
							</li>
						),
					)}
				</ul>
			</div>
		</>
	);
}
