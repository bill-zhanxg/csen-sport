import { dayjs } from '@/libs/dayjs';
import { Signal } from '@preact/signals-react';
import Link from 'next/link';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import { useState } from 'react';
import { pdfjs as PDFJS } from 'react-pdf';
import { read, utils } from 'xlsx';

type Type = 'junior' | 'intermediate';
type Gender = 'boys' | 'girls';
// This is actually the sport and division
type Sport = {
	name: string;
	number: string;
}[];
type Games = (
	| {
			date: string;
			games: (
				| {
						team1: string;
						team2: string;
						venue: string;
						notes?: string;
				  }
				| {
						text: string;
				  }
			)[];
	  }[]
	| null
)[];
export type FixturePages = {
	type: Type;
	gender: Gender;
	teams: Sport;
	games: Games;
}[];

export function Step1({
	setNextLoading,
	setDisableNext,
	setAlert,
	pdfjs,
	fixturePages,
}: {
	setNextLoading: (nextLoading: boolean) => void;
	setDisableNext: (disableNext: boolean) => void;
	setAlert: (alert: { type: 'success' | 'error'; message: string } | null) => void;
	pdfjs: typeof PDFJS;
	fixturePages: Signal<FixturePages>;
}) {
	const [weeklySportTab, setWeeklySportTab] = useState<'url' | 'upload'>('upload');
	const [weeklySportURL, setWeeklySportURL] = useState('');
	const [weeklySportURLDisabled, setWeeklySportURLDisabled] = useState(false);
	const [weeklySportFileDisabled, setWeeklySportFileDisabled] = useState(false);

	async function handleWeeklySportChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;
		setNextLoading(true);
		setWeeklySportFileDisabled(true);
		if (file.type === 'application/pdf') {
			file
				.arrayBuffer()
				.then((buffer) => {
					handlePdfText(buffer)
						.catch(() => {})
						.finally(() => {
							setNextLoading(false);
							setWeeklySportFileDisabled(false);
						});
				})
				.catch((err) => {
					setNextLoading(false);
					setWeeklySportFileDisabled(false);
					setAlert({
						type: 'error',
						message: `Failed to load the selected file: ${err.message}`,
					});
				});
		} else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
			file
				.arrayBuffer()
				.then(handleExcel)
				.catch((err) => {
					setAlert({
						type: 'error',
						message: `Failed to load the selected file: ${err.message}`,
					});
				})
				.finally(() => {
					setNextLoading(false);
					setWeeklySportFileDisabled(false);
				});
		} else {
			setNextLoading(false);
			setWeeklySportFileDisabled(false);
			setAlert({
				type: 'error',
				message: 'Invalid file type, please upload a PDF or Excel file',
			});
		}
	}
	function handleWeeklySportURLCheck() {
		// TODO: Currently Disabled due to proxy not working
		if (!weeklySportURL.trim())
			return setAlert({
				type: 'error',
				message: `URL is empty`,
			});
		setNextLoading(true);
		setWeeklySportURLDisabled(true);
		handlePdfText(weeklySportURL)
			.catch(() => {})
			.finally(() => {
				setNextLoading(false);
				setWeeklySportURLDisabled(false);
			});
	}

	function handleExcel(input: ArrayBuffer) {
		const workbook = read(input, {
			cellDates: true,
		});
		const sheet = workbook.Sheets['FIXTURES'];
		/**
		 * Index:
		 * 2 - Date
		 * 3 - Age
		 * 4 - Sport
		 * 5 - Div
		 * 6 - Pool (A | B)
		 * 7 - Gender
		 * 8 - Home Team
		 * 9 - Away Team
		 * 10 - Venue
		 * 12 - Notes
		 */
		const json = (utils.sheet_to_json(sheet, { header: 1 }) as any[][])
			.toSpliced(0, 3)
			.sort(
				(a, b) =>
					a[3]?.localeCompare(b[3]) ||
					a[7]?.localeCompare(b[7]) ||
					a[4]?.localeCompare(b[4]) ||
					a[5] - b[5] ||
					a[2] - b[2],
			);

		// Leave this in production for debugging
		console.log(json);

		const pages: FixturePages = [];

		let pageIndex = -1;
		let currentPage: {
			type: Type | undefined;
			gender: Gender | undefined;
		} = {
			type: undefined,
			gender: undefined,
		};

		let sportIndex = -1;
		let currentSport: {
			name: string | undefined;
			number: string | undefined;
		} = {
			name: undefined,
			number: undefined,
		};

		let gameDateIndex = -1;
		let currentGameDate: string | undefined;

		for (const item of json) {
			const dateString = item[2] as string | null;
			if (!dateString) continue;
			const ageString = item[3] as string | null;
			const sportString = item[4] as string | null;
			if (!sportString) continue;
			const sportDivString = item[5] as number | null;
			const poolString = item[6] as string | null;
			const genderString = item[7] as string | null;
			const homeTeam = item[8] as string | null;
			const awayTeam = item[9] as string | null;
			const venue = item[10] as string | null;
			const notes = item[12] as string | null;

			const type = ageString === 'INTER' ? 'intermediate' : 'junior';
			const gender = genderString?.toLowerCase().trim() as Gender;
			const sport = sportString.trim() ;
			const sportDiv = (sportDivString as number)?.toString().trim();
			const date = dayjs(new Date(dateString)).format('YYYY-MM-DD');

			if (currentPage.type !== type || currentPage.gender !== gender) {
				pageIndex++;
				pages[pageIndex] = {
					type,
					gender,
					teams: [],
					games: [],
				};
				currentPage = {
					type,
					gender,
				};

				sportIndex = -1;
				currentSport = {
					name: undefined,
					number: undefined,
				};
			}

			if (currentSport.name !== sport || currentSport.number !== sportDiv) {
				sportIndex++;
				pages[pageIndex].teams[sportIndex] = {
					name: sport,
					number: sportDiv,
				};
				pages[pageIndex].games[sportIndex] = [];
				currentSport = {
					name: sport,
					number: sportDiv,
				};

				gameDateIndex = -1;
				currentGameDate = undefined;
			}

			if (currentGameDate !== date) {
				gameDateIndex++;
				pages[pageIndex].games[sportIndex]![gameDateIndex] = {
					date,
					games: [],
				};
				currentGameDate = date;
			}

			pages[pageIndex].games[sportIndex]![gameDateIndex].games.push({
				team1: (homeTeam ?? '')?.toLowerCase().trim(),
				team2: (awayTeam ?? '')?.toLowerCase().trim(),
				venue: (venue ?? 'TBU')?.trim(),
				notes: notes ?? undefined,
			});
		}

		// Leave this in production for debugging
		console.log(pages);

		fixturePages.value = pages;
		setDisableNext(false);
	}

	function handlePdfText(input: string | ArrayBuffer) {
		return new Promise((resolve, reject) => {
			pdfjs
				.getDocument(typeof input === 'string' ? `https://corsproxy.io/?${encodeURIComponent(input)}` : input)
				.promise.then(async (pdf) => {
					const pages: FixturePages = [];

					for (let i = 1; i <= pdf.numPages; i++) {
						await pdf
							.getPage(i)
							.then(async (page) => {
								await page
									.getTextContent()
									.then((content) => {
										// Begin of algorithm
										const data = (content.items.filter((item) => (item as TextItem).str) as TextItem[]).map(
											({ str, transform }) => ({ str, transform }),
										);

										const fullText = data.map(({ str }) => str).join(' ');
										const type = fullText.match(/(JUNIOR|INTERMEDIATE)/i)?.[0].toLowerCase() as Type | undefined;
										const gender = fullText.match(/(BOYS|GIRLS)/i)?.[0].toLowerCase() as Gender | undefined;

										/**
										 * 0 - Finding 'date'
										 * 1 - Finding 'boys' or 'girls
										 * 2 - Data extraction for teams
										 * 3 - Data extraction for games, including date, teams and venue
										 */
										let steps = 0;
										let previousText = '';

										// For step 2
										let teamYPos = 0;
										let currentTeamName = '';
										let teams: Sport = [];

										// For step 3
										let currentGameDate: string | null = null;
										let previousYPos = 0;
										let previousCol = 0;
										// This is for the second [], first one is which team
										let currentArrayPosForCurrentDate = -1;
										let games: Games = [];

										for (const { str, transform } of data) {
											let text = str.trim();

											if (steps === 0 || steps === 1) {
												if (!text) {
													previousText = '';
													continue;
												}
												// Etc. 11/12/23DATE
												previousText = (previousText + text).toLowerCase();

												if (steps === 0) {
													if (previousText.endsWith('date')) {
														steps++;
														previousText = '';
													}
												}
												if (steps === 1) {
													if (previousText.endsWith('boys') || previousText.endsWith('girls')) {
														steps++;
														previousText = '';
													}
												}
												continue;
											}

											if (steps === 2) {
												let addPreviousText = true;
												let skip = true;

												if (teamYPos === 0) teamYPos = transform[5];
												if (!currentTeamName) {
													// Break point for extracting all the previous data
													if (!text.match(/^[A-Za-z ]+$/) && previousText.trim()) {
														// Previous text is the team name
														currentTeamName = previousText.trim();
														previousText = '';
														addPreviousText = false;
													}
												} else {
													// We don't want "–" to be added to the previous text
													if (!text.match(/^[0-9A-Za-z ]+$/)) addPreviousText = false;
													// Break point when there is no text
													if (
														previousText.trim() &&
														(!text ||
															!(previousText + text)
																.toLowerCase()
																.trim()
																.match(/^[0-9][a-z]$/))
													) {
														// Previous text is the team number
														const teamNumber = previousText.trim();
														teams.push({
															name: currentTeamName,
															number: teamNumber,
														});
														currentTeamName = '';
														previousText = '';

														// If y position changed, it's not team anymore
														if (teamYPos !== transform[5]) {
															steps++;
															addPreviousText = false;
															skip = false;
														}
													}
												}

												if (addPreviousText)
													// NETBALL
													previousText = (previousText + text).toLowerCase();
												if (skip) continue;
											}

											if (steps === 3) {
												if (!text) continue;

												const currentXPos = transform[4];
												const currentYPos = transform[5];

												let currentCol = 0;
												const startXPos = 90;
												const endXPos = 560;
												const colWidth = (endXPos - startXPos) / teams.length;
												if (currentXPos <= startXPos) currentCol = 0;
												else
													for (let i = 0; i < teams.length; i++) {
														const lessThan = startXPos + colWidth * (i + 1);
														if (i === teams.length - 1 || currentXPos <= lessThan) {
															currentCol = i + 1;
															break;
														}
													}

												if (previousCol !== currentCol || (currentCol !== 0 && previousYPos !== currentYPos)) {
													// The next column is reached
													if (previousCol === 0) {
														// It was date column
														const dateStr = previousText.toLowerCase().match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/)?.[0];
														if (dateStr) {
															const [day, month, year] = dateStr.split('/');
															currentGameDate = `${year}-${month}-${day}`;
															currentArrayPosForCurrentDate++;
														}
													} else {
														addGame();
													}
													previousCol = currentCol;
													previousText = text;
													previousYPos = currentYPos;
													continue;
												}

												previousYPos = currentYPos;
												if (currentCol !== 0)
													previousText = (previousText + ' ' + text).toLowerCase().replace(/\s\s+/g, ' ');
												else previousText = (previousText + text).toLowerCase();
											}
										}

										// Add the last game
										addGame();

										function addGame() {
											// Make sure array exists
											if (!games[previousCol - 1]) games[previousCol - 1] = [];
											if (!games[previousCol - 1]![currentArrayPosForCurrentDate])
												games[previousCol - 1]![currentArrayPosForCurrentDate] = {
													date: currentGameDate!,
													games: [],
												};

											if (previousText.includes(' v ') && previousText.includes('@')) {
												const [teams, venue] = previousText.split('@').map((item) => item.trim().toLowerCase());
												const [team1, team2] = teams.toLowerCase().split(' v ');

												// Insert to games
												games[previousCol - 1]![currentArrayPosForCurrentDate].games.push({
													team1,
													team2,
													venue,
												});
											} else {
												// It's not a game, it's a text
												games[previousCol - 1]![currentArrayPosForCurrentDate].games.push({
													// Raw text, without lowercase
													text: previousText,
												});
											}
										}
										// End of algorithm

										if (!type || !gender || teams.length === 0 || games.length === 0) {
											setAlert({
												type: 'error',
												message: `Failed to extract text from page ${i}`,
											});
										} else {
											pages.push({
												type,
												gender,
												teams,
												games,
											});
										}
									})
									.catch((err) => {
										setAlert({
											type: 'error',
											message: `Failed to read the text in PDF page ${i}: ${err.message}`,
										});
									});
							})
							.catch((err) => {
								setAlert({
									type: 'error',
									message: `Failed to read PDF page ${i}: ${err.message}`,
								});
							});
					}

					// Process the data
					if (pages.length === 0) {
						setAlert({
							type: 'error',
							message: `Failed to extract type, gender, teams, and games from the PDF`,
						});
						return reject(new Error('PDF is empty'));
					} else {
						fixturePages.value = pages;
						setAlert({
							type: 'success',
							message: 'Successfully extracted required information from the PDF, you can now continue',
						});
						setDisableNext(false);
						resolve(null);
					}
				})
				.catch((err) => {
					setAlert({
						type: 'error',
						message: `Failed to load the selected file: ${err.message}`,
					});
					reject(err);
				});
		});
	}

	return (
		<>
			<p className="text-xl font-bold text-error text-center max-w-2xl">
				Before you begin, make sure all teachers are registered and being given the{' '}
				<span className="text-info">teacher</span> role for linking with each game in{' '}
				<Link href="/users" className="link link-primary">
					the User page
				</Link>
			</p>
			<p className="text-xl font-bold text-error text-center max-w-2xl">
				Also make sure you have reset everything in{' '}
				<Link href="/bulk" className="link link-primary">
					the Bulk Action page
				</Link>{' '}
				to prevent any duplicate data
			</p>
			<p className="text-xl font-bold text-center max-w-2xl">
				Please find the latest fixtures PDF/Excel from{' '}
				<Link className="link-primary link" href="https://csen.org.au/semester-sport/" target="_blank">
					CSEN
				</Link>{' '}
				then import it here
			</p>
			<div role="tablist" className="tabs tabs-lg tabs-bordered">
				<button
					role="tab"
					className={`tab tab-disabled ${weeklySportTab === 'url' ? 'tab-active' : ''}`}
					onClick={() => {
						// setWeeklySportTab('url')
					}}
					disabled={weeklySportFileDisabled}
				>
					URL
				</button>
				<button
					role="tab"
					className={`tab ${weeklySportTab === 'url' ? '' : 'tab-active'}`}
					onClick={() => setWeeklySportTab('upload')}
					disabled={weeklySportURLDisabled}
				>
					Upload
				</button>
			</div>
			{weeklySportTab === 'url' ? (
				<div className="flex gap-2 w-full max-w-xl">
					<input
						type="text"
						value={weeklySportURL}
						placeholder="Input URL of the PDF/Excel here"
						className="input input-bordered w-full"
						onChange={(event) => setWeeklySportURL(event.target.value)}
						disabled={weeklySportURLDisabled}
					/>
					<button className="btn btn-accent" onClick={handleWeeklySportURLCheck} disabled={weeklySportURLDisabled}>
						Check
					</button>
				</div>
			) : (
				<input
					type="file"
					className="file-input file-input-bordered w-full max-w-xl"
					accept=".pdf,.xlsx"
					onChange={handleWeeklySportChange}
					disabled={weeklySportFileDisabled}
				/>
			)}
		</>
	);
}
