import { authC } from '@/app/cache';
import { isAdmin } from '@/libs/checkPermission';
import { serializeGamesWithId } from '@/libs/serializeData';
import { getRawTeachers, getRawTeams, getRawVenues } from '@/libs/tableData';
import { getXataClient } from '@/libs/xata';
import { Metadata } from 'next';
import Link from 'next/link';
import { Unauthorized } from '../globalComponents/Unauthorized';
import { Danger } from './components/Danger';
import { GamesTable } from './components/GamesTable';

export const metadata: Metadata = {
	title: 'Bulk Actions',
};

const xata = getXataClient();

export default async function BulkAction() {
	const session = await authC();
	if (!isAdmin(session)) return Unauthorized();

	const games = await xata.db.games.select(['*', 'team.id', 'venue.id', 'teacher.id']).getAll();
	const teams = await getRawTeams();
	const venues = await getRawVenues();
	const teachers = await getRawTeachers();

	return (
		<div className="p-6">
			<div className="w-full bg-base-100 rounded-xl border-2 border-base-200 shadow-lg shadow-base-200 p-4">
				<h1 className="text-2xl font-bold text-center">Bulk Actions</h1>
				<div className="flex flex-col sm:flex-row gap-6 p-4 w-full">
					<div className="flex flex-col items-center gap-2 rounded-xl border-2 border-error shadow-lg shadow-error p-4 w-full">
						<h1 className="font-bold">Danger Zone</h1>
						<p className="text-center">Those action should only be used when necessary</p>
						<Danger />
					</div>
					<div className="flex flex-col items-center gap-2 rounded-xl border-2 border-primary shadow-lg shadow-border-primary p-4 w-full">
						<h1 className="font-bold">Resources</h1>
						<p className="text-center">This is where you can export database table as Excel document</p>
						<div className="join join-vertical xl:join-horizontal w-full xl:w-auto [&>a]:btn-primary">
							<Link href="/download/all" target="_blank" className="btn join-item">
								Download Everything
							</Link>
							<Link href="/download/games" target="_blank" className="btn join-item">
								DL All Games
							</Link>
							<Link href="/download/teams" target="_blank" className="btn join-item">
								DL All Teams
							</Link>
							<Link href="/download/venues" target="_blank" className="btn join-item">
								DL All Venues
							</Link>
						</div>
					</div>
				</div>
				<GamesTable gamesRaw={serializeGamesWithId(games, true)} teams={teams} venues={venues} teachers={teachers} />
			</div>
		</div>
	);
}
