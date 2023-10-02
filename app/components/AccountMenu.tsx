'use client';

import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

import { account } from '../../libs/appwrite';

export function AccountMenu() {
	const [avatar, setAvatar] = useState<string>();

	useEffect(() => {
		setAvatar(account.getAvatar().href);
	}, []);

	return (
		<div className="dropdown dropdown-end">
			<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
				{avatar ? (
					// We need the image loaded from client side to persist Cookies, so we can not use next/image
					// eslint-disable-next-line @next/next/no-img-element
					<img src={avatar} alt="User Avatar" height={100} width={100} className="rounded-full" />
				) : (
					<FaUserCircle className="text-4xl" />
				)}
			</label>
			<ul tabIndex={0} className="menu menu-md dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-52">
				<li>
					<a onClick={account.logout}>Logout</a>
				</li>
			</ul>
		</div>
	);
}
