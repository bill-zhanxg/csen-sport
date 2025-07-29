import { dayjs } from '@/libs/dayjs';
import { Signal } from '@preact/signals-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { read, utils, WorkBook } from 'xlsx';

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
	fixturePages,
}: {
	setNextLoading: (nextLoading: boolean) => void;
	setDisableNext: (disableNext: boolean) => void;
	setAlert: (alert: { type: 'success' | 'error'; message: string } | null) => void;
	fixturePages: Signal<FixturePages>;
}) {
	const [weeklySportFileDisabled, setWeeklySportFileDisabled] = useState(false);
	const [availableSheets, setAvailableSheets] = useState<string[]>([]);
	const [selectedSheet, setSelectedSheet] = useState<string>('');
	const [showSheetSelector, setShowSheetSelector] = useState(false);
	const [currentWorkbook, setCurrentWorkbook] = useState<WorkBook | null>(null);

	const fileSelectorRef = useRef<HTMLInputElement | null>(null);

	async function handleWeeklySportChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) return;
		setNextLoading(true);
		setWeeklySportFileDisabled(true);
		if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
			file
				.arrayBuffer()
				.then((buffer) => {
					const workbook = read(buffer, {
						cellDates: true,
					});
					const sheetNames = Object.keys(workbook.Sheets);

					if (sheetNames.length === 1) {
						// If only one sheet, process it directly
						handleExcel(workbook, sheetNames[0]);
					} else {
						// Multiple sheets, show selector
						setCurrentWorkbook(workbook);
						setAvailableSheets(sheetNames);
						setSelectedSheet(sheetNames.includes('FIXTURES') ? 'FIXTURES' : sheetNames[0]);
						setShowSheetSelector(true);
					}
				})
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

	function handleExcel(workbook: WorkBook, sheetName: string) {
		// Script V2 - 29/07/2025

		const sheet = workbook.Sheets[sheetName];
		if (!sheet) {
			setAlert({
				type: 'error',
				message: `Sheet "${sheetName}" not found in the Excel file`,
			});
			return;
		}
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
			const sport = sportString.trim();
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
		setShowSheetSelector(false);
		setCurrentWorkbook(null);
	}

	function handleSheetSelection() {
		if (!currentWorkbook || !selectedSheet) return;

		setNextLoading(true);
		setWeeklySportFileDisabled(true);

		try {
			handleExcel(currentWorkbook, selectedSheet);
		} catch (err: any) {
			setAlert({
				type: 'error',
				message: `Failed to process the selected sheet: ${err.message}`,
			});
		} finally {
			setNextLoading(false);
			setWeeklySportFileDisabled(false);
		}
	}

	function cancelSheetSelection() {
		setShowSheetSelector(false);
		setCurrentWorkbook(null);
		setAvailableSheets([]);
		setSelectedSheet('');
		if (fileSelectorRef.current) fileSelectorRef.current.value = '';
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
				Please find the latest fixtures Excel from{' '}
				<Link className="link-primary link" href="https://csen.au/semester-sport/" target="_blank">
					CSEN
				</Link>{' '}
				then import it here
			</p>
			<input
				ref={fileSelectorRef}
				type="file"
				className="file-input file-input-bordered w-full max-w-xl"
				accept=".xlsx"
				onChange={handleWeeklySportChange}
				disabled={weeklySportFileDisabled}
			/>

			{showSheetSelector && (
				<div className="mt-4 p-4 border border-gray-300 rounded-lg bg-base-100 shadow-sm max-w-xl w-full">
					<h3 className="text-lg font-semibold mb-3">Select Sheet to Import</h3>
					<p className="text-sm text-gray-600 mb-3">
						Multiple sheets found in the Excel file. Please select which sheet contains the fixtures data:
					</p>
					<div className="form-control mb-4">
						<select
							className="select select-bordered w-full"
							value={selectedSheet}
							onChange={(e) => setSelectedSheet(e.target.value)}
						>
							{availableSheets.map((sheetName) => (
								<option key={sheetName} value={sheetName}>
									{sheetName}
								</option>
							))}
						</select>
					</div>
					<div className="flex gap-2 justify-end">
						<button className="btn btn-ghost" onClick={cancelSheetSelection} disabled={weeklySportFileDisabled}>
							Cancel
						</button>
						<button
							className="btn btn-primary"
							onClick={handleSheetSelection}
							disabled={weeklySportFileDisabled || !selectedSheet}
						>
							Import Selected Sheet
						</button>
					</div>
				</div>
			)}
		</>
	);
}
