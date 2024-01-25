import { WeeklySportView } from '@/app/globalComponents/WeeklySportView';
import { auth } from '@/libs/auth';
import { getDateEnd, getDateStart } from '@/libs/formatValue';
import { gamesToDates } from '@/libs/gamesToDates';
import { getXataClient } from '@/libs/xata';

export default async function DatePage({ params }: { params: { date: string } }) {
	const session = await auth();
	const date = new Date(parseInt(params.date));

	const games = await getXataClient()
		.db.games.select(['*', 'team.*', 'venue.*', 'teacher.*'])
		.sort('team.name', 'asc')
		.filter('date', { $ge: getDateStart(date), $le: getDateEnd(date) })
		.getAll({
			consistency: 'eventual',
		});

	const dates = gamesToDates(games, false);

	return (
		<div className="flex flex-col items-center w-full p-4 gap-4">
			<main className="flex flex-col items-center gap-4 pt-0 p-4 overflow-x-auto w-full">
				{dates.length > 0 ? (
					<WeeklySportView date={dates[0]} isTeacher={false} />
				) : (
					<h1>There are no games on {date.toLocaleDateString()}</h1>
				)}
			</main>
		</div>
	);
}
