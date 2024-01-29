import Link from 'next/link';
import { RestartGuide } from './components/RestartGuide';

export default function Changelog() {
	return (
		<main className="flex flex-col gap-4 items-center w-full p-6">
			<h1 className="font-bold text-center">Changelogs</h1>
			<RestartGuide />
			<ChangelogBox version="0.1.0" latest>
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-4">
						<div className="badge badge-secondary badge-outline">New</div>
						<h2 className="text-xl font-bold">Features</h2>
					</div>
					<ul className="list-disc list-inside">
						<li>First release!</li>
						<li>Database is ready and setup</li>
						<li>Authentication system is tested and working</li>
						<li>Navbar and all components are finished</li>
						<li>Weekly Sport page is full functional</li>
						<li>All weekly sport game display are done</li>
						<li>Homepage is finished with displaying of upcoming game for selected team</li>
						<li>Changelog page is finished</li>
						<li>Settings page is finished and functional</li>
						<li>CSEN page for quick access their official website</li>
						<li>
							Website guidance is finished and working (you can restart the guide by clicking the &quot;Restart
							Guide&quot; button on the top)
						</li>
					</ul>
					<div className="divider"></div>
					<h2 className="text-xl font-bold">For Teacher and Admin</h2>
					<ul className="list-disc list-inside">
						<li>Ability to import weekly sport fixture to database via PDF (Import page admin only)</li>
						<li>Ability to add, edit and delete weekly sport games manually (Weekly Sport page teacher view)</li>
						<li>Ability to export weekly sport fixture to Excel document (Bulk Action page admin only)</li>
						<li>Bulk add, modify, or remove games for admin</li>
						<li>Ability to change user&apos;s role in bulk</li>
						<li>Ability to manage teams, venues (Admin Controls)</li>
					</ul>
					<div className="divider"></div>
					{/* TODO */}
					<h2 className="text-xl font-bold">Todos</h2>
					<ul className="list-disc list-inside">
						<li>Ability to manually create timetable if automatic import fails (Create Timetable page admin only)</li>
					</ul>
					<div className="divider"></div>
					<h2 className="text-xl font-bold">Credits</h2>
					<p>
						Made by Bill Z{' '}
						<Link className="link link-primary" href="https://bill-zhanxg.com" target="_blank">
							https://bill-zhanxg.com
						</Link>
					</p>
				</div>
			</ChangelogBox>
		</main>
	);
}

function ChangelogBox({
	version,
	latest = false,
	children,
}: {
	version: string;
	latest?: boolean;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col w-full max-w-4xl rounded-xl border-2 border-base-300 shadow-md shadow-base-300 p-6">
			<div className="flex flex-col xs:flex-row items-end gap-4">
				<h1 className="font-bold">Version {version}</h1>
				{latest && <div className="badge badge-primary badge-outline">Latest</div>}
			</div>
			<div className="divider"></div>
			{children}
		</div>
	);
}
