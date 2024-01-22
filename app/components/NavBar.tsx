import { Session } from 'next-auth/types';
import Link from 'next/link';
import { FaBars } from 'react-icons/fa';

type Menu = { name: string; href: string | { name: string; href: string; admin?: boolean }[]; admin?: boolean }[];
const menu: Menu = [
	{
		name: 'Weekly Sport',
		href: '/weekly-sport/timetable',
	},
	{
		name: 'CSEN',
		href: '/csen',
	},
	// TODO: Remove pages
	// {
	// 	name: 'Weekly Sport PDF',
	// 	href: '/weekly-sport-pdf',
	// },
	// {
	// 	name: 'Ladders',
	// 	href: '/ladder',
	// },
	{
		name: 'Admin Controls',
		admin: true,
		href: [
			{
				name: 'Users',
				href: '/users',
			},
			{
				name: 'Import Timetable',
				href: '/weekly-sport/import',
			},
		],
	},
];

export function NavBar({ session }: { session: Session }) {
	const menuFiltered =
		session.user.role === 'admin'
			? menu
			: menu
					.filter((item) => !item.admin)
					.map((item) =>
						Array.isArray(item.href) ? { ...item, href: item.href.filter((item) => !item.admin) } : item,
					);

	return (
		<>
			<div className="dropdown w-full sm:w-0">
				<label tabIndex={0} className="btn btn-ghost sm:hidden w-full">
					<FaBars />
				</label>
				<ul
					tabIndex={0}
					className="menu menu-lg dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box border border-primary"
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
									<ul className="p-2 border border-primary">
										{item.href.map((item, i) => (
											<li className="w-36" key={i}>
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
