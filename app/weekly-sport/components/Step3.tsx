import { Signal, useSignal } from '@preact/signals-react';
import { RowData } from '@tanstack/react-table';
import { useState } from 'react';
import { GamesTable } from './GamesTable';
import { Opponents, OpponentsTable } from './OpponentsTable';
import { FIxturePages } from './Step1';
import { Venues } from './Step2';
import { Teams, TeamsTable } from './TeamsTable';
import { VenuesTable } from './VenuesTable';

declare module '@tanstack/react-table' {
	interface TableMeta<TData extends RowData> {
		updateData: (rowIndex: number, columnId: string, value: unknown) => void;
	}
}

export function Step3({
	setNextLoading,
	setDisableNext,
	setAlert,
	fixtures,
	venues,
}: {
	setNextLoading: (nextLoading: boolean) => void;
	setDisableNext: (disableNext: boolean) => void;
	setAlert: (alert: { type: 'success' | 'error'; message: string } | null) => void;
	fixtures: Signal<FIxturePages>;
	venues: Signal<Venues>;
}) {
	const [currentSchoolCsenCode, setSchoolCsenCodeInput] = useState('');
	const schoolCsenCode = useSignal<string | undefined>(undefined);
	const filteredFixtures = useSignal<FIxturePages>([]);
	const [teams, setTeams] = useState<Teams>([]);
	const [opponents, setOpponents] = useState<Opponents>([]);
	const [filteredVenues, setFilteredVenues] = useState<Venues>([]);

	return (
		<>
			<p className="text-xl font-bold text-error text-center max-w-2xl">DO NOT EXIT THIS PAGE, CHANGES WILL BE LOST</p>
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
						if (!currentSchoolCsenCode)
							return setAlert({ type: 'error', message: 'Please enter your CSEN school code' });
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
															game.team1.includes(currentSchoolCsenCode) ||
															game.team2.includes(currentSchoolCsenCode)
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
						setTeams([]);
						const teams: Teams = [];
						const opponents: string[] = [];
						const venueCodes: string[] = [];
						for (const item of filteredFixtures.value) {
							const teamCodes: {
								name: string;
								team: {
									name: string;
									number: string;
								};
							}[] = [];
							for (let i = 0; i < item.games.length; i++) {
								const games = item.games[i];
								if (!games) continue;
								const team = item.teams[i];
								for (const game of games) {
									for (const verses of game.games) {
										if ('text' in verses) continue;
										let myTeam: string | undefined;
										let opponent: string | undefined;
										if (verses.team1.includes(currentSchoolCsenCode)) {
											myTeam = verses.team1;
											opponent = verses.team2;
										}
										if (verses.team2.includes(currentSchoolCsenCode)) {
											myTeam = verses.team2;
											opponent = verses.team1;
										}
										if (!myTeam || !opponent) continue;

										if (!teamCodes.find((code) => code.name === myTeam && code.team === team)) {
											teamCodes.push({
												name: myTeam,
												team,
											});
										}

										const opponentCode = opponent.match(/([a-z]+)/)?.[0];
										if (opponentCode && !opponents.includes(opponentCode)) opponents.push(opponentCode);

										if (!venueCodes.includes(verses.venue)) venueCodes.push(verses.venue);
									}
								}
							}
							const upperCaseFirst = (string: string) => string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
							teamCodes.forEach((code) => {
								const teamNum = code.name.match(/(\d+)/)?.[0];
								teams.push({
									gender: item.gender,
									sport: code.team.name,
									division: code.team.number,
									team: code.name,
									friendlyName: `${upperCaseFirst(item.gender)} ${code.team.name} Div ${code.team.number}${
										teamNum ? ` (Team ${teamNum})` : ''
									}`,
									group: item.type,
								});
							});
						}
						setTeams(teams);
						setOpponents(opponents.map((opponent) => ({ cenCode: opponent, friendlyName: opponent.toUpperCase() })));
						setFilteredVenues(
							venueCodes.map((venueCode) => {
								const result = venues.value.find((venue) => venue.csenCode === venueCode);
								if (!result)
									return {
										csenCode: venueCode,
										venue: 'Not Found',
										address: 'Not Found',
										cfNum: 'Not Found',
									};
								else return {
									csenCode: venueCode,
									venue: result.venue.replace(/\b[a-z]/g, (c) => c.toUpperCase()),
									address: result.address.replace(/\b[a-z]/g, (c) => c.toUpperCase()),
									cfNum: result.cfNum,
								};
							}),
						);
						// #endregion
					}}
				>
					Filter
				</button>
			</div>
			{schoolCsenCode.value &&
				(teams.length > 0 ? (
					<>
						<TeamsTable teams={teams} setTeams={setTeams} />
						<OpponentsTable opponents={opponents} setOpponents={setOpponents} />
						<VenuesTable venues={filteredVenues} setVenues={setFilteredVenues} />
						<GamesTable />
					</>
				) : (
					<p className="text-xl font-bold text-error text-center max-w-2xl">
						Can not find any teams matching your CSEN code
					</p>
				))}
		</>
	);
}
