import SadCat from '@/app/images/sad-cat.png';
import Link from 'next/link';
import { RestartGuide } from './components/RestartGuide';

export default function Changelog() {
	return (
		<main className="flex flex-col gap-8 items-center w-full p-6">
			<h1 className="font-bold text-center">Changelogs</h1>
			<RestartGuide />
			<ChangelogBox version="0.1.4" latest release="06/02/2024">
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-4">
						<div className="badge badge-secondary badge-outline">New</div>
						<h2 className="text-xl font-bold">Features</h2>
					</div>
					<ul className="list-disc list-inside">
						<li>A new field called position which indicates if the game is home or away</li>
					</ul>
					<div className="divider"></div>
					<h2 className="text-xl font-bold">Bug fixes</h2>
					<ul className="list-disc list-inside">
						<li>Fixed a bug where the system will not remove the value of a cell when been set to --- or select</li>
						<li>
							Fixed a bug where the visual for extra teacher is disabled when admin or teacher trying to access it
						</li>
						<li>Fixed a bug where when downloading games as excel file, I forgot to add two new fields to the sheet</li>
					</ul>
				</div>
			</ChangelogBox>
			<ChangelogBox version="0.1.3" release="04/02/2024">
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-4">
						<div className="badge badge-secondary badge-outline">New</div>
						<h2 className="text-xl font-bold">Features</h2>
					</div>
					<ul className="list-disc list-inside">
						<li>
							You can now add extra teachers to a game, this is useful when you have more than one teacher responsible
							for that game
						</li>
						<li>
							Automatically collapse navigation menu when user click on any link, this will reduce the amount of clicks
							required to open and close the menu
						</li>
					</ul>
					<div className="divider"></div>
					<h2 className="text-xl font-bold">Bug fixes</h2>
					<ul className="list-disc list-inside">
						<li>
							Fixed a crucial bug where when importing or creating timetable, the system will prioritize the display of
							default value, therefore not showing feedback to the user if the value has been overridden
						</li>
						<li>
							Fixed a crucial bug where the system will not allow the user to import or create games because linking
							value is a empty string instead of undefined
						</li>
						<li>
							Fixed a visual bug where on the game information page student view the disabled inputs are not readable in
							light mode
						</li>
					</ul>
				</div>
			</ChangelogBox>
			<ChangelogBox version="0.1.2" release="01/02/2024">
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-4">
						<div className="badge badge-secondary badge-outline">New</div>
						<h2 className="text-xl font-bold">Features</h2>
					</div>
					<ul className="list-disc list-inside">
						<li>
							This new update will highlight any update that has made to weekly sport game since your last visit in
							light blue, allowing the user to see what has changed easily (new option in user setting for controlling
							when to mark as read)
						</li>
						<li>
							Allows the action of adding a team when importing timetable and automatically append games based on the
							added team (if the newly added team is junior it will add to date with only junior games). This is useful
							when you have extra teams that is not in the timetable such as electives (Admin feature)
						</li>
						<li>
							When importing timetable or creating timetable manually, the system will allow empty team, venue, or
							teacher been selected. It will show as &quot;---&quot; in the weekly sport page (Admin feature)
						</li>
						<li>Add the ability to search user (Admin only)</li>
					</ul>
					<div className="divider"></div>
					<h2 className="text-xl font-bold">Bug fixes</h2>
					<ul className="list-disc list-inside">
						<li>
							Fixed a bug where when any select menu has an empty value in /game/[id], it will select the first one
							available instead of leaving it empty
						</li>
					</ul>
				</div>
			</ChangelogBox>
			<ChangelogBox version="0.1.1" release="31/01/2024">
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-4">
						<div className="badge badge-secondary badge-outline">Changed</div>
						<h2 className="text-xl font-bold">Features</h2>
					</div>
					<ul className="list-disc list-inside">
						<li>
							The submit bug and feedback button has been moved to user dropdown, due to some actions being blocked by
							the floating menu
						</li>
						<li>Added a new step for guidance, which is the user feedback menu</li>
					</ul>
					<div className="divider"></div>
					<h2 className="text-xl font-bold">Bug fixes</h2>
					<ul className="list-disc list-inside">
						<li>
							Fixed a bug where the browser will print out error log when click event is not prevented before navigating
							(technical)
						</li>
						<li>Updated all dependencies to latest version (technical)</li>
					</ul>
				</div>
			</ChangelogBox>
			<ChangelogBox version="0.1.0" release="30/01/2024">
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-4">
						<div className="badge badge-secondary badge-outline">New</div>
						<h2 className="text-xl font-bold">Features</h2>
					</div>
					<ul className="list-disc list-inside">
						<li>First release!</li>
						<li>Changelog page is finished</li>
						<li>Database is ready and setup</li>
						<li>Authentication system is tested and working</li>
						<li>Navbar and all components are finished</li>
						<li>Weekly Sport page is full functional</li>
						<li>All weekly sport game displays are done</li>
						<li>Homepage is finished with displaying of upcoming games for selected team</li>
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
						<li>Ability to manually create timetable if automatic import fails (Create Timetable page admin only)</li>
					</ul>
				</div>
			</ChangelogBox>
			<ChangelogBox version="0.0.0" release="24/08/2023">
				<div className="flex flex-col gap-4">
					<h2 className="text-xl font-bold">Code space initialized</h2>
					<ul className="list-disc list-inside">
						<li>Need to start working on this!</li>
					</ul>
				</div>
			</ChangelogBox>
		</main>
	);
}

function ChangelogBox({
	version,
	latest = false,
	release,
	children,
}: {
	version: string;
	latest?: boolean;
	release?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col w-full max-w-4xl rounded-xl border-2 border-base-300 shadow-md shadow-base-300 p-6">
			<div className="flex flex-col sm:flex-row justify-between">
				<div className="flex flex-col xs:flex-row items-end gap-4">
					<h1 className="font-bold">Version {version}</h1>
					{latest && <div className="badge badge-primary badge-outline">Latest</div>}
				</div>
				<p>
					Released on <span className="font-bold">{release}</span>
				</p>
			</div>
			<div className="divider"></div>
			{children}
			<div className="divider"></div>
			<h2 className="text-xl font-bold">Credits</h2>
			<p>
				Made by <span className="font-bold">Bill Z.</span>{' '}
				<Link className="link link-primary" href="https://bill-zhanxg.com" target="_blank">
					https://bill-zhanxg.com
				</Link>
			</p>
			<p>
				Tested by <span className="font-bold">Mason S.</span>{' '}
				<Link className="link link-primary" href={SadCat.src} target="_blank">
					Hello :)
				</Link>
			</p>
		</div>
	);
}
