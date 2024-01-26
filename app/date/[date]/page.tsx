import { Tabs } from '@/app/globalComponents/Tabs';
import { WeeklySportView } from '@/app/globalComponents/WeeklySportView';
import { auth } from '@/libs/auth';
import { isTeacher } from '@/libs/checkPermission';
import { getDateEnd, getDateStart, stringifySearchParam } from '@/libs/formatValue';
import { gamesToDates } from '@/libs/gamesToDates';
import { serializeGames } from '@/libs/serializeData';
import { SearchParams } from '@/libs/types';
import { getXataClient } from '@/libs/xata';
import Link from 'next/link';
import { Copy } from './components/Copy';

export default async function DatePage({
	params,
	searchParams,
}: {
	params: { date: string };
	searchParams: SearchParams;
}) {
	const session = await auth();
	const date = new Date(parseInt(params.date));
	let view = stringifySearchParam(searchParams).view as 'junior' | 'intermediate' | undefined;
	if (view !== 'junior' && view !== 'intermediate') view = undefined;

	const games = await getXataClient()
		.db.games.select(['*', 'team.*', 'venue.*', 'teacher.*'])
		.sort('team.name', 'asc')
		.filter({
			date: { $ge: getDateStart(date), $le: getDateEnd(date) },
			...(view ? { 'team.isJunior': view === 'junior' ? true : false } : {}),
		})
		.getAll({
			consistency: 'eventual',
		});

	const dates = gamesToDates(games, false);

	return (
		<div className="flex flex-col items-center w-full p-4 gap-4">
			{isTeacher(session) && (
				<div className="p-4 w-full">
					<div className="flex flex-col items-center gap-2 rounded-xl border-2 border-error shadow-lg shadow-error p-4 w-full">
						<h1 className="font-bold">Teacher Actions</h1>
						<p>For posting a link of the games to the specific date and group</p>
						<Copy games={serializeGames(dates[0].games, false)} />
						<Tabs breakPoint='lg'>
							<Link
								href={`/date/${params.date}`}
								role="tab"
								className={`tab ${view !== 'junior' && view !== 'intermediate' ? 'tab-active text-primary' : ''}`}
							>
								All
							</Link>
							<Link
								href={`/date/${params.date}?view=junior`}
								role="tab"
								className={`tab ${view === 'junior' ? 'tab-active text-primary' : ''}`}
							>
								Junior Only
							</Link>
							<Link
								href={`/date/${params.date}?view=intermediate`}
								role="tab"
								className={`tab ${view === 'intermediate' ? 'tab-active text-primary' : ''}`}
							>
								Intermediate Only
							</Link>
						</Tabs>
					</div>
				</div>
			)}
			<main className="flex flex-col items-center gap-4 pt-0 p-4 w-full">
				{isTeacher(session) && <h1 className="font-bold">Student View ↓</h1>}
				{dates.length > 0 ? (
					<WeeklySportView date={dates[0]} isTeacher={false} />
				) : (
					<h1>There are no games on {date.toLocaleDateString()}</h1>
				)}
			</main>
		</div>
	);
}
