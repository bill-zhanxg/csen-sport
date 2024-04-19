import SadCat from '@/app/images/sad-cat.png';
import Link from 'next/link';
import { RestartGuide } from './components/RestartGuide';

export default function Changelog() {
	return (
		<main className="flex flex-col gap-8 items-center w-full p-6">
			<h1 className="font-bold text-center">Changelogs</h1>
			<RestartGuide />
			<ChangelogBox version="0.1.9" release="22/02/2024">
				<>
					<Title>Bug fixes</Title>
					<List>
						<li>
							TEMP FIX: Fix an issue where only 20 users are displayed in the user page. This is a temporary fix until I
							optimize it
						</li>
						<li>
							CSEN updated their PDF again, hot fix the extract data script to handle the new (weird) format (some teams
							are missing team 2). Planning to rewrite this function for visual PDF editor
						</li>
						<li>
							Because of how CSEN website for some reason updated their SSL certificate, the iframe will throw not
							secure error due to browser cache (I think), so now it is an external link
						</li>
					</List>
				</>
			</ChangelogBox>
			<ChangelogBox version="0.1.8" release="22/02/2024">
				<>
					<Title>Bug fixes</Title>
					<List>
						<li>
							Fixed an issue where in weekly sport page extra teacher is empty on student view because it was not
							exposed from backend
						</li>
						<li>Add year level indicator for junior and intermediate</li>
					</List>
				</>
			</ChangelogBox>
			<ChangelogBox version="0.1.7" release="22/02/2024">
				<>
					<Heading badge={'New'} title={'Features'} />
					<List>
						<li>
							Finished: Add default section for import, allows to set default teacher, extra teacher, out of class time,
							and start time
						</li>
						<li>Finished: Resolve the lag with useTransition react hook when change values for the following:</li>
						<List className="!list-[circle] ml-4">
							<li>User page search now use defer update</li>
							<li>In import page, default sections values changes display are deferred</li>
							<li>
								In import page, any change to team&apos;s fields, visual update to the rest of the games are deferred to
								prevent lag
							</li>
							<li>In import page, addition of team will be deferred when updating the UI</li>
							<li>
								In import page, all changes for Opponents table and Venues table&apos;s values are deferred when
								updating the UI
							</li>
							<li>In import page, the removal of any games will be deferred when updating the UI</li>
						</List>
					</List>
					<Divider />
					<Title>Bug fixes</Title>
					<List>
						<li>
							Improved visual for displaying weekly sport on mobile by decreasing the padding for more information to be
							displayed
						</li>
						<li>Renamed Team names to Teams in import page because it fits better</li>
					</List>
				</>
			</ChangelogBox>
			<ChangelogBox version="0.1.6" release="21/02/2024">
				<>
					<Heading badge={'New'} title={'Features'} />
					<List>
						<li>
							Not finished (server side): Add default section for import, allows to set default teacher, extra teacher,
							out of class time, and start time
						</li>
						<li>
							Experimental (not finished): Resolve the lag when change value in import page with useTransition react
							hook
						</li>
					</List>
					<Divider />
					<Title>Bug fixes</Title>
					<List>
						<li>
							Codebase: Switched from manually stating the latest release, now use css to automatic select the first one
							(Changelog page)
						</li>
						<li>
							Improvement: When user sign up, instead of using 64x64 profile picture, now it use 648x648 for better
							visual. Otherwise it is not even readable (existing user need to change their profile manually)
						</li>
						<li>Add handle for no internet connect when importing timetable</li>
					</List>
				</>
			</ChangelogBox>
			<ChangelogBox version="0.1.5" release="20/02/2024">
				<>
					<Heading badge={'New'} title={'Features'} />
					<List>
						<li>Database: add a new user named CRT</li>
						<li>Add a new setting: Timezone</li>
					</List>
					<Divider />
					<Title>Bug fixes</Title>
					<List>
						<li>Make the other setting page more understandable (Still pretty hard to understand)</li>
						<li>
							Improved the visual of the Update Profile button in user setting page where it does not look good on
							mobile because it sticks to the very bottom of the page
						</li>
						<li>
							Added a new timezone system where the system will store users timezone to database to avoid wrong time
							being shown for out of class and start time
						</li>
						<li>Fix a visual bug where update button is not sticky in bulk action</li>
						<li>
							Fixed a bug where when you create new teams when importing timetable the opponent for all the team based
							game will be Not Found, now it is an empty string instead
						</li>
						<li>
							When you importing and the script can not find a venue, the default name will be the CSEN Code instead of
							Not Found for easier identification
						</li>
						<li>
							Fixed a visual bug when the user&apos;s role in the database is null but they&apos;re student, the
							user/[id] page will display a blank square, now it&apos;s fixed
						</li>
					</List>
				</>
			</ChangelogBox>
			<ChangelogBox version="0.1.4" release="06/02/2024">
				<>
					<Heading badge={'New'} title={'Features'} />
					<List>
						<li>A new field called position which indicates if the game is home or away</li>
					</List>
					<Divider />
					<Title>Bug fixes</Title>
					<List>
						<li>Fixed a bug where the system will not remove the value of a cell when been set to --- or select</li>
						<li>
							Fixed a bug where the visual for extra teacher is disabled when admin or teacher trying to access it
						</li>
						<li>Fixed a bug where when downloading games as excel file, I forgot to add two new fields to the sheet</li>
					</List>
				</>
			</ChangelogBox>
			<ChangelogBox version="0.1.3" release="04/02/2024">
				<>
					<Heading badge={'New'} title={'Features'} />
					<List>
						<li>
							You can now add extra teachers to a game, this is useful when you have more than one teacher responsible
							for that game
						</li>
						<li>
							Automatically collapse navigation menu when user click on any link, this will reduce the amount of clicks
							required to open and close the menu
						</li>
					</List>
					<Divider />
					<Title>Bug fixes</Title>
					<List>
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
					</List>
				</>
			</ChangelogBox>
			<ChangelogBox version="0.1.2" release="01/02/2024">
				<>
					<Heading badge={'New'} title={'Features'} />
					<List>
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
					</List>
					<Divider />
					<Title>Bug fixes</Title>
					<List>
						<li>
							Fixed a bug where when any select menu has an empty value in /game/[id], it will select the first one
							available instead of leaving it empty
						</li>
					</List>
				</>
			</ChangelogBox>
			<ChangelogBox version="0.1.1" release="31/01/2024">
				<>
					<Heading badge={'Changed'} title={'Features'} />
					<List>
						<li>
							The submit bug and feedback button has been moved to user dropdown, due to some actions being blocked by
							the floating menu
						</li>
						<li>Added a new step for guidance, which is the user feedback menu</li>
					</List>
					<Divider />
					<Title>Bug fixes</Title>
					<List>
						<li>
							Fixed a bug where the browser will print out error log when click event is not prevented before navigating
							(technical)
						</li>
						<li>Updated all dependencies to latest version (technical)</li>
					</List>
				</>
			</ChangelogBox>
			<ChangelogBox version="0.1.0" release="30/01/2024">
				<>
					<Heading badge={'New'} title={'Features'} />
					<List>
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
					</List>
					<Divider />
					<Title>For Teacher and Admin</Title>
					<List>
						<li>Ability to import weekly sport fixture to database via PDF (Import page admin only)</li>
						<li>Ability to add, edit and delete weekly sport games manually (Weekly Sport page teacher view)</li>
						<li>Ability to export weekly sport fixture to Excel document (Bulk Action page admin only)</li>
						<li>Bulk add, modify, or remove games for admin</li>
						<li>Ability to change user&apos;s role in bulk</li>
						<li>Ability to manage teams, venues (Admin Controls)</li>
						<li>Ability to manually create timetable if automatic import fails (Create Timetable page admin only)</li>
					</List>
				</>
			</ChangelogBox>
			<ChangelogBox version="0.0.0" release="24/08/2023">
				<>
					<Title>Code space initialized</Title>
					<List>
						<li>Need to start working on this!</li>
					</List>
				</>
			</ChangelogBox>
		</main>
	);
}

function ChangelogBox({
	version,
	release,
	children,
}: {
	version: string;
	release?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col w-full max-w-4xl rounded-xl border-2 border-base-300 shadow-md shadow-base-300 p-6 [&_.latest-changelog]:first-of-type:inline-flex">
			<div className="flex flex-col sm:flex-row justify-between">
				<div className="flex flex-col xs:flex-row items-end gap-4">
					<h1 className="font-bold">Version {version}</h1>
					<div className="latest-changelog badge badge-primary badge-outline hidden">Latest</div>
				</div>
				<p>
					Released on <span className="font-bold">{release}</span>
				</p>
			</div>
			<div className="divider"></div>
			<div className="flex flex-col gap-4">{children}</div>
			<div className="divider"></div>
			<Title>Credits</Title>
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
			<p>
				<Link className="link link-primary" href="https://github.com/bill-zhanxg/csen-sport" target="_blank">
					Source code
				</Link>
			</p>
		</div>
	);
}

function Divider() {
	return <div className="divider -m-0.5"></div>;
}

function List({ children, className = '' }: { children: React.ReactNode; className?: string }) {
	return <ul className={`list-disc list-inside ${className}`}>{children}</ul>;
}

function Heading({ badge, title }: { badge: string; title: string }) {
	return (
		<div className="flex items-center gap-4">
			<div className="badge badge-secondary badge-outline">{badge}</div>
			<Title>{title}</Title>
		</div>
	);
}

function Title({ children }: { children: React.ReactNode }) {
	return <h2 className="text-xl font-bold">{children}</h2>;
}
