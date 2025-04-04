import SadCat from '@/app/images/sad-cat.png';
import { promises as fs } from 'fs';
import { Metadata } from 'next';
import Link from 'next/link';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { RestartGuide } from './components/RestartGuide';

import './changelog.css';

export const metadata: Metadata = {
	title: 'Changelog',
};

export default async function Changelog() {
	const Changelog = await fs.readFile(process.cwd() + '/CHANGELOG.md', 'utf8');

	return (
		<main className="flex flex-col gap-8 items-center w-full p-6 changelog">
			<h1 className="font-bold text-center">Changelogs</h1>
			<RestartGuide />
			<ChangelogBox first>
				<Markdown remarkPlugins={[remarkGfm]}>{Changelog}</Markdown>
			</ChangelogBox>
			<ChangelogBox version="0.5.4" release="26/07/2024">
				<List>
					<li>fix: upload profile avatar failed due to image side not resize properly</li>
					<li>
						fix(import): issue with importing games that is same school verse each other. only the opponent team is
						imported has been fixed. Now it import both for each team
					</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.5.3-patch.2" release="25/07/2024">
				<List>
					<li>
						fix: change page size for users page to reduce loading time due to large image base64 string is loaded
					</li>
					<li>
						fix: a bug where I put preventDefault() on Link element and prevent anyone from navigating with the NavBar
						is fixed
					</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.5.3" release="25/07/2024">
				<List>
					<li>
						fix: sorting in homepage without a team is fixed to show all most recent games instead of showing all games
						for specific team
					</li>
					<li>fix: add preventDefault() to all necessary (and maybe not) button clicks</li>
					<li>chore(login): rename Microsoft Azure AD to Microsoft Entra ID</li>
					<li>
						fix(login): Currently fixing some problem with login system (auth.js) might expect some downtime for
						debugging
					</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.5.2-patch.2" release="22/07/2024">
				<List>
					<li>chore(dependency): update all dependencies</li>
					<li>fix(import): fix duplicate of teams due to ending space character</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.5.2" release="20/07/2024">
				<List>
					<li>chore(tickets): add profile icon for developers on chat header</li>
					<li>chore(tickets): add the ability to delete ticket for developers</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.5.1" release="18/07/2024">
				<List>
					<li>fix: add developer has been notified text to error messages</li>
					<li>fix: add .env file back for AUTH_URL</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.5.0" release="18/07/2024">
				<List>
					<li>feat: ability for teacher to toggle the Confirmed column without going to edit mode</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.4.1" release="17/07/2024">
				<List>
					<li>chore(dependency): update all dependencies</li>
					<li>fix(spelling): Google Map -&gt; Google Maps</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.4.0" release="17/07/2024">
				<List>
					<li>refactor(WeeklySportImport): Add support for Excel fixture import</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.3.3" release="24/06/2024">
				<Title>Bug fixes</Title>
				<List>
					<li>chore(dependency): update all dependencies</li>
					<li>fix(WeeklySportView): fixed an issue where extra teacher show plus sign even when there is none</li>
					<li>fix(WeeklySportView): add new sorting for each date that sort team name in A to Z</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.3.2" release="26/05/2024">
				<Title>Bug fixes</Title>
				<List>
					<li>chore(dependency): update all dependencies</li>
					<li>chore(nextauth): remove basePath and AUTH_URL env because it is not needed anymore</li>
					<li>
						fix(middleware): when the url path is / and user is not logged in, redirect to /login without the redirect
						parameter
					</li>
					<li>
						fix(WeeklySportView): disable game prefetch because it causes fetch error and does not help with performance
					</li>
					<li>
						fix(home): game will not display if current time is past 12 noon, now it will show games that has past noon
						but still on the same day
					</li>
					<li>
						fix(home): weekly sport view with relative time will use the start time of the first game in the list, if
						not found then fall back to the default time for the date instead
					</li>
					<li>
						fix(settings): fixed a hydration error that is caused because of inconsistent timezone fetching between
						server and client
					</li>
					<li>fix(dependencies): regenerate package-lock.json</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.3.1" release="05/05/2024">
				<List>
					<li>fix(ticket): Adding indicators for unread messages</li>
					<li>fix(ticket_list): Adding unread highlight</li>
					<li>fix(ticket): Fixed a server side bug where I remove the wrong listener which caused Aborted</li>
					<li>
						fix(ticket): Fixed an issue where unread badge will appear when the user is the one who sent the message
					</li>
					<li>
						fix(ticket): Fixed an issue where the messages will shown as delivered when the user first load the messages
					</li>
					<li>
						fix(layout): Emergency fix for the layout where user is not defined when not signed in, causing the entire
						website to be down
					</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.3.0" release="04/05/2024">
				<Heading badge="Revamp" title="Features" />
				<List>
					<li>revamp(users): Revamp the users page to allow pagination and better search functionality</li>
					<li>feat(user): Allow admin to change the role of the user when viewing the user page</li>
					<li>
						fix(pagination_menu): Minimum page number of 1 to prevent next page button enable when there is no page
					</li>
					<li>fix(users): Fix some visual issue in user page</li>
					<li>fix(user): Add user sorting (creation date descending)</li>
					<li>typo(user): Give more detail on for No user found</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.2.2" release="30/04/2024">
				<Title>Bug fixes</Title>
				<List>
					<li>fix(ticket): add mobile support for ticket</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.2.1" release="30/04/2024">
				<Heading badge="New" title="Features" />
				<List>
					<li>database(game): Add new column called confirmed (teacher only)</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.2.0" release="29/04/2024">
				<Heading badge="New" title="Features" />
				<List>
					<li>feat(tickets): Add a new ticket system for user to report bugs and feedback (Minor version bump)</li>
					<List className="list-[circle]! ml-4">
						<li>
							feat(role): Add developer role to allow the developer to access the ticket system and view the feedbacks
							and bugs
						</li>
						<li>feat(package): Added framer motion for better animation</li>
						<li>feat(real_time): Add real time messaging support</li>
						<li>feat(messaging): Messaging design finished and functioning</li>
						<li>feat(optimistic_messages_update): Show messaging sending status</li>
						<li>feat(tickets_list): open and closed tabs functioning</li>
						<li>feat(messaging): paginated infinite scroll for messages and auto scrolls</li>
						<li>feat(kysely): add join table functions for database with kysely</li>
						<li>feat(nav): close ticket functioning</li>
						<li>revert(kysely): remove kysely, this does not work</li>
						<li>feat(ticket_layout): show the latest message for ticket and time of sending</li>
						<li>fix(typing): improve typescript typing for eventEmitters</li>
						<li>feat(ticket_layout): add sorting for tickets</li>
						<li>feat(ticket_layout): add real time for message update and ticket update</li>
						<li>
							feat(ticket_layout): ticket list change sorting strategy to sort by latest message, then by created date
						</li>
						<li>feat(status): real time ticket status change (close & open) and fix bugs</li>
						<li>fix(date): tested with Brodie and fix wrong date display bug</li>
						<li>feat(read): Mark message as read in real time and loading</li>
					</List>
				</List>
				<Divider />
				<Title>Bug fixes</Title>
				<List>
					<li>docs(changelog): Fixed incorrect dates in changelog</li>
					<li>refactor(version): Refactor the versioning system to follow semantic versioning https://semver.org/</li>
					<li>chore: dependency update</li>
					<li>fix(error): Add new error boundaries, so that error won&apos;t crash the entire client</li>
					<li>refactor(global-error): Display more information about the error and make it looks good</li>
					<li>fix(setting): profile picture too large to upload to database</li>
					<li>
						fix(timezone_setting): adding handler for older browser that does not support the function
						Intl.supportedValuesOf
					</li>
					<li>fix(sentry_logging): Limit the amount of replays and error reports to prevent overload sentry plan</li>
					<li>typo(JoyRide): Fix grammar issue for guide</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.1.9" release="19/04/2024">
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
						Because of how CSEN website for some reason updated their SSL certificate, the iframe will throw not secure
						error due to browser cache (I think), so now it is an external link
					</li>
					<li>style(home): update select team text, so that it Link to setting page for easier understanding</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.1.8" release="25/02/2024">
				<Title>Bug fixes</Title>
				<List>
					<li>
						Fixed an issue where in weekly sport page extra teacher is empty on student view because it was not exposed
						from backend
					</li>
					<li>Add year level indicator for junior and intermediate</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.1.7" release="22/02/2024">
				<Heading badge={'New'} title={'Features'} />
				<List>
					<li>
						Finished: Add default section for import, allows to set default teacher, extra teacher, out of class time,
						and start time
					</li>
					<li>Finished: Resolve the lag with useTransition react hook when change values for the following:</li>
					<List className="list-[circle]! ml-4">
						<li>User page search now use defer update</li>
						<li>In import page, default sections values changes display are deferred</li>
						<li>
							In import page, any change to team&apos;s fields, visual update to the rest of the games are deferred to
							prevent lag
						</li>
						<li>In import page, addition of team will be deferred when updating the UI</li>
						<li>
							In import page, all changes for Opponents table and Venues table&apos;s values are deferred when updating
							the UI
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
			</ChangelogBox>
			<ChangelogBox version="0.1.6" release="21/02/2024">
				<Heading badge={'New'} title={'Features'} />
				<List>
					<li>
						Not finished (server side): Add default section for import, allows to set default teacher, extra teacher,
						out of class time, and start time
					</li>
					<li>
						Experimental (not finished): Resolve the lag when change value in import page with useTransition react hook
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
			</ChangelogBox>
			<ChangelogBox version="0.1.5" release="20/02/2024">
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
						Improved the visual of the Update Profile button in user setting page where it does not look good on mobile
						because it sticks to the very bottom of the page
					</li>
					<li>
						Added a new timezone system where the system will store users timezone to database to avoid wrong time being
						shown for out of class and start time
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
						Fixed a visual bug when the user&apos;s role in the database is null but they&apos;re student, the user/[id]
						page will display a blank square, now it&apos;s fixed
					</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.1.4" release="06/02/2024">
				<Heading badge={'New'} title={'Features'} />
				<List>
					<li>A new field called position which indicates if the game is home or away</li>
				</List>
				<Divider />
				<Title>Bug fixes</Title>
				<List>
					<li>Fixed a bug where the system will not remove the value of a cell when been set to --- or select</li>
					<li>Fixed a bug where the visual for extra teacher is disabled when admin or teacher trying to access it</li>
					<li>Fixed a bug where when downloading games as excel file, I forgot to add two new fields to the sheet</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.1.3" release="04/02/2024">
				<Heading badge={'New'} title={'Features'} />
				<List>
					<li>
						You can now add extra teachers to a game, this is useful when you have more than one teacher responsible for
						that game
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
						Fixed a crucial bug where the system will not allow the user to import or create games because linking value
						is a empty string instead of undefined
					</li>
					<li>
						Fixed a visual bug where on the game information page student view the disabled inputs are not readable in
						light mode
					</li>
				</List>
			</ChangelogBox>
			<ChangelogBox version="0.1.2" release="01/02/2024">
				<Heading badge={'New'} title={'Features'} />
				<List>
					<li>
						This new update will highlight any update that has made to weekly sport game since your last visit in light
						blue, allowing the user to see what has changed easily (new option in user setting for controlling when to
						mark as read)
					</li>
					<li>
						Allows the action of adding a team when importing timetable and automatically append games based on the
						added team (if the newly added team is junior it will add to date with only junior games). This is useful
						when you have extra teams that is not in the timetable such as electives (Admin feature)
					</li>
					<li>
						When importing timetable or creating timetable manually, the system will allow empty team, venue, or teacher
						been selected. It will show as &quot;---&quot; in the weekly sport page (Admin feature)
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
			</ChangelogBox>
			<ChangelogBox version="0.1.1" release="31/01/2024">
				<Heading badge={'Changed'} title={'Features'} />
				<List>
					<li>
						The submit bug and feedback button has been moved to user dropdown, due to some actions being blocked by the
						floating menu
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
			</ChangelogBox>
			<ChangelogBox version="0.1.0" release="30/01/2024">
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
			</ChangelogBox>
			<ChangelogBox version="0.0.0" release="24/08/2023">
				<Title>Code space initialized</Title>
				<List>
					<li>Need to start working on this!</li>
				</List>
			</ChangelogBox>
		</main>
	);
}

function ChangelogBox({
	first,
	version,
	release,
	children,
}: {
	first?: boolean;
	version?: string;
	release?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col w-full max-w-4xl rounded-xl border-2 border-base-300 shadow-md shadow-base-300 p-6 first-of-type:[&_.latest-changelog]:inline-flex">
			{!first && (
				<>
					<div className="flex flex-col sm:flex-row justify-between">
						<div className="flex flex-col xs:flex-row items-end gap-4">
							<h1>Version {version}</h1>
							<div className="latest-changelog badge badge-primary badge-outline hidden">Latest</div>
						</div>
						<p>
							Released on <span className="font-bold">{release}</span>
						</p>
					</div>
					<div className="divider"></div>
				</>
			)}
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
