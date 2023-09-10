'use client';

import { FaUserCircle } from 'react-icons/fa';

import { account } from '../libs/appwrite';

export function AccountMenu() {
	return (
		<div className="dropdown dropdown-end">
			<label tabIndex={0} className="btn btn-ghost btn-circle avatar">
				<FaUserCircle className="text-4xl" />
			</label>
			<ul tabIndex={0} className="menu menu-md dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
				<li>
					<a className="justify-between">
						Profile
						<span className="badge">New</span>
					</a>
				</li>
				<li>
					<a>Settings</a>
				</li>
				<li>
					<a onClick={account.logout}>Logout</a>
				</li>
			</ul>
		</div>
	);
}
