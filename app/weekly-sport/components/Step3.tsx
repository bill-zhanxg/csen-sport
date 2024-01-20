import { Signal, useSignal } from '@preact/signals-react';
import { RowData } from '@tanstack/react-table';
import { useState } from 'react';
import { GamesTable } from './GamesTable';
import { FIxturePages } from './Step1';
import { Venues } from './Step2';
import { TeamsTable } from './TeamsTable';

declare module '@tanstack/react-table' {
	interface TableMeta<TData extends RowData> {
		updateData: (rowIndex: number, columnId: string, value: unknown) => void;
	}
}

export type Teams = {
	gender: string;
	sport: string;
	division: string;
	team: string;
	friendlyName: string;
	group: string;
}[];

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

						// Remap games into teams
						setTeams([]);
						const teams: Teams = [];
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
										if (verses.team1.includes(currentSchoolCsenCode)) {
											if (teamCodes.find((code) => code.name === verses.team1 && code.team === team)) continue;
											teamCodes.push({
												name: verses.team1,
												team,
											});
										}
										if (verses.team2.includes(currentSchoolCsenCode)) {
											if (teamCodes.find((code) => code.name === verses.team2 && code.team === team)) continue;
											teamCodes.push({
												name: verses.team2,
												team,
											});
										}
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
					}}
				>
					Filter
				</button>
			</div>
			{schoolCsenCode.value &&
				(teams.length > 0 ? (
					<>
						<TeamsTable teams={teams} setTeams={setTeams} />
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
