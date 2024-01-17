'use client';

import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Link from 'next/link';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import { useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { Error, Success } from '../../components/Alert';

dayjs.extend(utc);
dayjs.extend(timezone);

export function ImportPage() {
	const [step, setStep] = useState(1);

	const [weeklySportTab, setWeeklySportTab] = useState<'url' | 'upload'>('url');
	const [weeklySportURL, setWeeklySportURL] = useState('');
	const [weeklySportURLDisabled, setWeeklySportURLDisabled] = useState(false);
	const [weeklySportFileDisabled, setWeeklySportFileDisabled] = useState(false);

	const [disableNext, setDisableNext] = useState(true);
	const [nextLoading, setNextLoading] = useState(false);

	type WeeklySportDataGender = {
		[game: string]: {
			[date: string]: {
				team1: string;
				team2: string;
				venue: string;
			}[];
		};
	};
	type WeeklySportDataType = {
		boys: WeeklySportDataGender;
		girls: WeeklySportDataGender;
	};
	const [weeklySportData, setWeeklySportData] = useState<{
		junior: WeeklySportDataType;
		intermediate: WeeklySportDataType;
	} | null>(null);

	const [alert, setAlert] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);

	useEffect(() => {
		pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
	}, []);

	async function handleWeeklySportChange(event: React.ChangeEvent<HTMLInputElement>) {
		if (!event.target.files) return;
		setNextLoading(true);
		setWeeklySportFileDisabled(true);
		let input = event.target.files[0];
		input
			.arrayBuffer()
			.then((buffer) => {
				handlePdfText(buffer).catch(() => {
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
	}
	function handleWeeklySportURLCheck() {
		if (!weeklySportURL.trim())
			return setAlert({
				type: 'error',
				message: `URL is empty`,
			});
		setNextLoading(true);
		setWeeklySportURLDisabled(true);
		handlePdfText(weeklySportURL).catch(() => {
			setNextLoading(false);
			setWeeklySportURLDisabled(false);
		});
	}

	function handlePdfText(input: string | ArrayBuffer) {
		return new Promise((resolve, reject) => {
			pdfjs
				.getDocument(typeof input === 'string' ? `https://corsproxy.io/?${encodeURIComponent(input)}` : input)
				.promise.then((pdf) => {
					for (let i = 1; i <= pdf.numPages; i++) {
						pdf
							.getPage(i)
							.then((page) => {
								page
									.getTextContent()
									.then((content) => {
										// Begin of algorithm
										const data = (content.items.filter((item) => (item as TextItem).str) as TextItem[]).map(
											({ str, transform }) => ({ str, transform }),
										);

										const fullText = data.map(({ str }) => str).join(' ');
										const type = fullText.match(/(JUNIOR|INTERMEDIATE)/i)?.[0].toLowerCase();
										const gender = fullText.match(/(BOYS|GIRLS)/i)?.[0].toLowerCase();

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
										let teams: {
											name: string;
											number: string;
										}[] = [];

										// For step 3
										let currentGameDate: Date | null = null;
										let previousXPos = 0;
										let previousYPos = 0;
										let previousCol = 0;
										let currentTeamVerse: string = '';
										// This is for the second [], first one is which team
										let currentArrayPosForCurrentDate = -1;
										let searchingForVenue = false;
										let games: {
											date: Date;
											games: (
												| {
														team1: string;
														team2: string;
														venue: string;
												  }
												| {
														text: string;
												  }
											)[];
										}[][] = [];

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
												const endXPos = 510;
												const colWidth = (endXPos - startXPos) / teams.length;
												if (currentXPos <= 80) currentCol = 0;
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
															const [day, month, year] = dateStr.split('/').map((item) => parseInt(item));

															// TODO: check dayjs.tz.guess() on browser
															currentGameDate = dayjs.tz(`${year}-${month}-${day} 12:00`, dayjs.tz.guess()).toDate();
															currentArrayPosForCurrentDate++;
														}
													} else {
														// Make sure array exists
														if (!games[previousCol - 1]) games[previousCol - 1] = [];
														if (!games[previousCol - 1][currentArrayPosForCurrentDate])
															games[previousCol - 1][currentArrayPosForCurrentDate] = {
																date: currentGameDate!,
																games: [],
															};

														if (previousText.includes(' v ') && previousText.includes('@')) {
															const [teams, venue] = previousText.split('@').map((item) => item.trim().toLowerCase());
															const [team1, team2] = teams.toLowerCase().split(' v ');

															// Insert to games
															games[previousCol - 1][currentArrayPosForCurrentDate].games.push({
																team1,
																team2,
																venue,
															});
														} else {
															// It's not a game, it's a text
															games[previousCol - 1][currentArrayPosForCurrentDate].games.push({
																// Raw text, without lowercase
																text: previousText,
															});
														}
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

										console.log(type, gender, teams, games);
									})
									.catch((err) => {
										setAlert({
											type: 'error',
											message: `Failed to read the text in PDF page ${i}: ${err.message}`,
										});
										reject(err);
									});
							})
							.catch((err) => {
								setAlert({
									type: 'error',
									message: `Failed to read PDF page ${i}: ${err.message}`,
								});
								reject(err);
							});
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
			<main className="flex flex-col items-center gap-4 p-4 overflow-x-auto w-full">
				<ul className="steps steps-vertical xs:steps-horizontal">
					<li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Upload Weekly Sport PDF</li>
					<li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Upload Venue PDF</li>
					<li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Check & Edit</li>
					<li className={`step ${step >= 4 ? 'step-primary' : ''}`}>Finish</li>
				</ul>
				<h1 className="text-4xl font-bold">Import Weekly Sport PDF to Database</h1>

				{step === 1 && (
					<>
						<p className="text-xl font-bold max-w-xl">
							Please find the latest PDF from{' '}
							<Link className="link-secondary link-hover" href="https://csen.org.au/semester-sport/" target="_blank">
								CSEN
							</Link>{' '}
							and import it here
						</p>
						<div role="tablist" className="tabs tabs-lg tabs-bordered">
							<button
								role="tab"
								className={`tab ${weeklySportTab === 'url' ? 'tab-active' : ''}`}
								onClick={() => setWeeklySportTab('url')}
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
									placeholder="Input URL of the PDF here"
									className="input input-bordered w-full"
									onChange={(event) => setWeeklySportURL(event.target.value)}
									disabled={weeklySportURLDisabled}
								/>
								<button
									className="btn btn-accent"
									onClick={handleWeeklySportURLCheck}
									disabled={weeklySportURLDisabled}
								>
									Check
								</button>
							</div>
						) : (
							<input
								type="file"
								className="file-input file-input-bordered w-full max-w-xl"
								accept=".pdf"
								onChange={handleWeeklySportChange}
								disabled={weeklySportFileDisabled}
							/>
						)}
					</>
				)}

				<div className="flex justify-between w-full max-w-xl">
					<button
						className="btn btn-primary w-32 !shrink"
						onClick={() => setStep((step) => step - 1)}
						disabled={step === 1}
					>
						Previous
					</button>
					<button
						className="btn btn-primary w-32 !shrink"
						onClick={() => setStep((step) => step + 1)}
						disabled={disableNext}
					>
						{nextLoading ? (
							<span className="loading loading-spinner loading-md"></span>
						) : step === 4 ? (
							'Finish'
						) : (
							'Next'
						)}
					</button>
				</div>
			</main>
			{alert &&
				(alert.type === 'success' ? (
					<Success message={alert.message} setAlert={setAlert} />
				) : (
					<Error message={alert.message} setAlert={setAlert} />
				))}
		</>
	);
}
