import { formatIsJunior } from '@/libs/formatValue';
import { getRawTeachers } from '@/libs/tableData';
import { getXataClient } from '@/libs/xata';
import { utils } from 'xlsx';

const xata = getXataClient();

export async function getAllWorkbook() {
	const gamesWorksheet = await getGamesWorksheet();
	const teamsWorksheet = await getTeamsWorksheet();
	const venuesWorksheet = await getVenuesWorksheet();

	const workbook = utils.book_new();
	utils.book_append_sheet(workbook, gamesWorksheet, 'Fixtures');
	utils.book_append_sheet(workbook, teamsWorksheet, 'Teams');
	utils.book_append_sheet(workbook, venuesWorksheet, 'Venues');
	return workbook;
}

export async function getGamesWorkbook() {
	const worksheet = await getGamesWorksheet();
	const workbook = utils.book_new();
	utils.book_append_sheet(workbook, worksheet, 'Fixtures');
	return workbook;
}

export async function getTeamsWorkbook() {
	const worksheet = await getTeamsWorksheet();
	const workbook = utils.book_new();
	utils.book_append_sheet(workbook, worksheet, 'Teams');
	return workbook;
}

export async function getVenuesWorkbook() {
	const worksheet = await getVenuesWorksheet();
	const workbook = utils.book_new();
	utils.book_append_sheet(workbook, worksheet, 'Venues');
	return workbook;
}

async function getGamesWorksheet() {
	const teachers = await getRawTeachers();
	const allGames = await xata.db.games
		.select([
			'date',
			'team.isJunior',
			'team.name',
			'isHome',
			'opponent',
			'venue.name',
			'venue.address',
			'venue.court_field_number',
			'teacher.name',
			'extra_teachers',
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
		const extraTeachers = game.extra_teachers?.map((id) => teachers.find((t) => t.id === id)?.name) ?? [];
		const teachersNames = [game.teacher?.name, ...extraTeachers]
			.filter((t) => t !== undefined && t !== null)
			.join(', ');
		arr.push({
			Date: game.date,
			Group: game.team ? formatIsJunior(game.team.isJunior) : '',
			Team: game.team?.name,
			Position: game.isHome === undefined || game.isHome === null ? '---' : game.isHome ? 'Home' : 'Away',
			Opponent: game.opponent,
			Venue: game.venue?.name,
			'Venue Address': game.venue?.address,
			'Venue Court Field Number': game.venue?.court_field_number,
			Teacher: teachersNames,
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
	const max_width_position = rows.reduce((w, r) => Math.max(w, r.Position?.length ?? 0), 10);
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
		{ wch: max_width_position },
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

	return worksheet;
}

async function getTeamsWorksheet() {
	const teams = await xata.db.teams.select(['name', 'isJunior']).sort('isJunior', 'asc').sort('name', 'asc').getAll();

	const rows = teams.map((team) => ({
		Group: formatIsJunior(team.isJunior),
		'Team Name': team.name,
	}));

	const worksheet = utils.json_to_sheet(rows);
	const max_width_group = rows.reduce((w, r) => Math.max(w, r.Group?.length ?? 0), 10);
	const max_width_team_name = rows.reduce((w, r) => Math.max(w, r['Team Name']?.length ?? 0), 10);
	worksheet['!cols'] = [{ wch: max_width_group }, { wch: max_width_team_name }];

	return worksheet;
}

async function getVenuesWorksheet() {
	const venues = await xata.db.venues.select(['name', 'address', 'court_field_number']).sort('name', 'asc').getAll();

	const rows = venues.map((venue) => ({
		Venue: venue.name,
		Address: venue.address,
		'Court / Field Number': venue.court_field_number,
	}));

	const worksheet = utils.json_to_sheet(rows);
	const max_width_venue = rows.reduce((w, r) => Math.max(w, r.Venue?.length ?? 0), 10);
	const max_width_address = rows.reduce((w, r) => Math.max(w, r.Address?.length ?? 0), 10);
	const max_width_court_field_number = rows.reduce((w, r) => Math.max(w, r['Court / Field Number']?.length ?? 0), 10);
	worksheet['!cols'] = [{ wch: max_width_venue }, { wch: max_width_address }, { wch: max_width_court_field_number }];

	return worksheet;
}
