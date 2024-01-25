import { dayjs } from '@/libs/dayjs';
import { getXataClient } from '@/libs/xata';
import { log } from 'console';

export default async function DatePage({ params }: { params: { date: string } }) {
	let date = new Date(parseInt(params.date));
    date = dayjs(date).subtract(12, 'hour').toDate();

	// const games = await getXataClient()
	// 	.db.games.select(['*', 'team.*', 'venue.*', 'teacher.*'])
	// 	.getPaginated({
	// 		consistency: 'eventual',
	// 		sort: [{ 'team.name': 'asc' }],
	// 		filter: {
	// 			date: isPast ? { $lt: new Date().toISOString() } : { $ge: new Date().toISOString() },
	// 		},
	// 		pagination: {
	// 			size: itemsPerPage,
	// 			offset: page ? (parseInt(page) - 1) * itemsPerPage : 0,
	// 		},
	// 	});

	log(date);
	log(date.toUTCString());

	return <h1>Unfinished</h1>;
}
