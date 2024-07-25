import { PreventUnload } from '@/app/globalComponents/PreventUnload';
import { Signal, useSignal } from '@preact/signals-react';
import { RowData } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useState } from 'react';
import { v4 } from 'uuid';
import { Defaults, Games, Opponents, Teams, Venues } from '../types';
import { DefaultSection } from './DefaultSection';
import { GamesTable } from './GamesTable';
import { OpponentsTable } from './OpponentsTable';
import { FixturePages } from './Step1';
import { TeamsTable } from './TeamsTable';
import { VenuesTable } from './VenuesTable';

declare module '@tanstack/react-table' {
	interface TableMeta<TData extends RowData> {
		updateData: (rowIndex: number, columnId: string, value: unknown) => void;
	}
}

export function Step3({
	setDisableNext,
	setAlert,
	fixtures,
	venues,
	teachers,
	defaults,
	setDefaults,
	teams,
	setTeams,
	opponents,
	setOpponents,
	filteredVenues,
	setFilteredVenues,
	games,
	setGames,
}: {
	setDisableNext: Dispatch<SetStateAction<boolean>>;
	setAlert: (alert: { type: 'success' | 'error'; message: string } | null) => void;
	fixtures: Signal<FixturePages>;
	venues: Signal<Venues>;
	teachers: { id: string; name?: string | null }[];
	defaults: Defaults;
	setDefaults: Dispatch<SetStateAction<Defaults>>;
	teams: Teams;
	setTeams: Dispatch<SetStateAction<Teams>>;
	opponents: Opponents;
	setOpponents: Dispatch<SetStateAction<Opponents>>;
	filteredVenues: Venues;
	setFilteredVenues: Dispatch<SetStateAction<Venues>>;
	games: Games;
	setGames: Dispatch<SetStateAction<Games>>;
}) {
	const [currentSchoolCsenCode, setSchoolCsenCodeInput] = useState('');
	const schoolCsenCode = useSignal<string | undefined>(undefined);
	const filteredFixtures = useSignal<FixturePages>([]);

	return (
		<>
			<p className="text-xl font-bold text-error text-center max-w-2xl">DO NOT EXIT THIS PAGE, PROGRESS WILL BE LOST</p>
			<div className="flex gap-2 w-full max-w-xl">
				<input
					type="text"
					placeholder="Enter your school CSEN code"
					className="input input-bordered w-full"
					onChange={(event) => setSchoolCsenCodeInput(event.target.value.trim().toLowerCase())}
				/>
				<button
					className="btn btn-accent"
					disabled={!currentSchoolCsenCode || schoolCsenCode.value === currentSchoolCsenCode}
					onClick={() => {
						if (!currentSchoolCsenCode) {
							setDisableNext(true);
							return setAlert({ type: 'error', message: 'Please enter your CSEN school code' });
						}
						if (currentSchoolCsenCode === schoolCsenCode.value) return;
						filteredFixtures.value = fixtures.value.map((page) => {
							return {
								...page,
								games: page.games.map((games) => {
									return games
										? games.map((game) => {
												return {
													...game,
													games: game.games.filter((game) => {
														if (
															'text' in game ||
															game.team1?.includes(currentSchoolCsenCode) ||
															game.team2?.includes(currentSchoolCsenCode)
														)
															return true;
														return false;
													}),
												};
										  })
										: games;
								}),
							};
						});
						schoolCsenCode.value = currentSchoolCsenCode;

						// #region Collapse algorithm
						// Remap games into teams and opponents
						const teams: Teams = [];
						const opponents: string[] = [];
						const venueCodes: string[] = [];
						const games: Games = [];
						for (const item of filteredFixtures.value) {
							type TeamCode = {
								name: string;
								sport: {
									name: string;
									number: string;
								};
							};
							const teamCodes: TeamCode[] = [];
							const gameRemap: {
								date: string;
								team: TeamCode;
								position: 'home' | 'away';
								opponent: string;
								venue: string;
								notes?: string;
							}[] = [];
							for (let i = 0; i < item.games.length; i++) {
								const games = item.games[i];
								if (!games) continue;
								const sport = item.teams[i];
								for (const game of games) {
									for (const verses of game.games) {
										if ('text' in verses) continue;
										let myTeam: string | undefined;
										let opponent: string | undefined;
										let position: 'home' | 'away' | undefined;
										if (verses.team1.includes(currentSchoolCsenCode)) {
											myTeam = verses.team1;
											opponent = verses.team2;
											position = 'home';
										}
										if (verses.team2.includes(currentSchoolCsenCode)) {
											myTeam = verses.team2;
											opponent = verses.team1;
											position = 'away';
										}
										if (!myTeam || !opponent || !position) continue;

										if (!teamCodes.find((code) => code.name === myTeam && code.sport === sport)) {
											teamCodes.push({
												name: myTeam,
												sport,
											});
										}

										const opponentCode = opponent.match(/([a-z]+)/)?.[0];
										if (opponentCode && !opponents.includes(opponentCode)) opponents.push(opponentCode);

										if (!venueCodes.includes(verses.venue)) venueCodes.push(verses.venue);

										gameRemap.push({
											date: game.date,
											team: {
												name: myTeam,
												sport,
											},
											position,
											opponent,
											venue: verses.venue,
											notes: verses.notes,
										});
									}
								}
							}
							const upperCaseFirst = (string: string) => string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
							const formatTeamCode = (code: TeamCode) => {
								const teamNum = code.name.match(/(\d+)/)?.[0];
								const data = {
									gender: item.gender,
									sport: code.sport.name,
									division: code.sport.number,
									team: code.name,
									group: item.type,
								};

								const link = teams.find(
									({ id, friendlyName, teacher, ...team }) => JSON.stringify(team) === JSON.stringify(data),
								);

								return {
									id: link?.id ?? v4(),
									...data,
									friendlyName: `${upperCaseFirst(item.gender)} ${upperCaseFirst(code.sport.name)} Div ${
										code.sport.number
									}${teamNum ? ` (Team ${teamNum})` : ''}`,
								};
							};
							teamCodes.forEach((code) => teams.push(formatTeamCode(code)));
							gameRemap.forEach((game) => {
								const team = formatTeamCode(game.team);
								const opponent = game.opponent;
								const venue = game.venue;
								const date = game.date;
								const notes = game.notes;
								games.push({
									id: v4(),
									date,
									teamId: team.id,
									position: game.position,
									opponentCode: opponent,
									venueCode: venue,
									notes,
								});
							});
						}
						setTeams(teams);
						setOpponents(opponents.map((opponent) => ({ csenCode: opponent, friendlyName: opponent.toUpperCase() })));
						setFilteredVenues(
							venueCodes.map((venueCode) => {
								const result = venues.value.find((venue) => venue.csenCode === venueCode);
								if (!result)
									return {
										csenCode: venueCode,
										venue: venueCode,
										address: 'Not Found',
										cfNum: 'Not Found',
									};
								else
									return {
										csenCode: venueCode,
										venue: result.venue.replace(/\b[a-z]/g, (c) => c.toUpperCase()),
										address: result.address.replace(/\b[a-z]/g, (c) => c.toUpperCase()),
										cfNum: result.cfNum,
									};
							}),
						);
						setGames(games);
						// #endregion

						if (teams.length > 0) setDisableNext(false);
						else setDisableNext(true);

						// Leave this in production for debugging
						console.log(games);
					}}
				>
					Filter
				</button>
			</div>
			{schoolCsenCode.value &&
				(teams.length > 0 ? (
					<>
						<DefaultSection defaults={defaults} setDefaults={setDefaults} teachers={teachers} />
						<TeamsTable teams={teams} setTeams={setTeams} setGames={setGames} teachers={teachers} defaults={defaults} />
						<OpponentsTable opponents={opponents} setOpponents={setOpponents} />
						<VenuesTable venues={filteredVenues} setVenues={setFilteredVenues} />
						<GamesTable
							teams={teams}
							opponents={opponents}
							venues={filteredVenues}
							games={games}
							setGames={setGames}
							teachers={teachers}
							defaults={defaults}
						/>
					</>
				) : (
					<p className="text-xl font-bold text-error text-center max-w-2xl">
						Can not find any teams matching your CSEN code
					</p>
				))}
			<PreventUnload />
		</>
	);
}
