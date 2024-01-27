import { formatIsJunior } from '@/libs/formatValue';
import { getXataClient } from '@/libs/xata';
import { utils } from 'xlsx';

export async function getGames() {
	const allGames = await getXataClient()
		.db.games.select([
			'date',
			'team.isJunior',
			'team.name',
			'opponent',
			'venue.name',
			'venue.address',
			'venue.court_field_number',
			'teacher.name',
			'transportation',
			'out_of_class',
			'start',
			'notes',
		])
		.sort('date', 'asc')
		.getAll();

	let lastDate = '';
	const games = allGames.map((game) => {
		const arr = [];
		const dateStr = game.date?.toDateString();
		if (dateStr && lastDate !== dateStr) {
			arr.push({});
			lastDate = dateStr;
		}
		arr.push({
			Date: game.date,
			Group: game.team ? formatIsJunior(game.team.isJunior) : '',
			Team: game.team?.name,
			Opponent: game.opponent,
			Venue: game.venue?.name,
			'Venue Address': game.venue?.address,
			'Venue Court Field Number': game.venue?.court_field_number,
			Teacher: game.teacher?.name,
			Transportation: game.transportation,
			'Out of Class': game.out_of_class,
			Start: game.start,
			Notes: game.notes,
		});
		return arr;
	});
	const rows = games.flat();

	const worksheet = utils.json_to_sheet(rows);
	const max_width_team = rows.reduce((w, r) => Math.max(w, r.Team?.length ?? 0), 10);
	const max_width_opponent = rows.reduce((w, r) => Math.max(w, r.Opponent?.length ?? 0), 10);
	const max_width_venue = rows.reduce((w, r) => Math.max(w, r.Venue?.length ?? 0), 10);
	const max_width_venue_address = rows.reduce((w, r) => Math.max(w, r['Venue Address']?.length ?? 0), 10);
	const max_width_venue_court_field_number = rows.reduce(
		(w, r) => Math.max(w, r['Venue Court Field Number']?.length ?? 0),
		10,
	);
	const max_width_teacher = rows.reduce((w, r) => Math.max(w, r.Teacher?.length ?? 0), 10);
	const max_width_transportation = rows.reduce((w, r) => Math.max(w, r.Transportation?.length ?? 0), 10);
	const max_width_notes = rows.reduce((w, r) => Math.max(w, r.Notes?.length ?? 0), 10);
	worksheet['!cols'] = [
		{ wch: 10 },
		{ wch: 15 },
		{ wch: max_width_team },
		{ wch: max_width_opponent },
		{ wch: max_width_venue },
		{ wch: max_width_venue_address },
		{ wch: max_width_venue_court_field_number },
		{ wch: max_width_teacher },
		{ wch: max_width_transportation },
		{ wch: 10 },
		{ wch: 10 },
		{ wch: 10 },
		{ wch: max_width_notes },
	];

	const workbook = utils.book_new();
	utils.book_append_sheet(workbook, worksheet, 'Fixtures');
	return workbook;
}
