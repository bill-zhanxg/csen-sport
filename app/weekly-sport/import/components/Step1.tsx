import Link from 'next/link';
import { useRef, useState } from 'react';
import { v4 } from 'uuid';
import { read, utils } from 'xlsx';

import { dayjs } from '@/libs/dayjs';

import type { WorkBook } from 'xlsx';
import type { Games, Teams } from '../types';

export function Step1({
	setNextLoading,
	setDisableNext,
	setAlert,
	setTeams,
	setFixtures,
}: {
	setNextLoading: (nextLoading: boolean) => void;
	setDisableNext: (disableNext: boolean) => void;
	setAlert: (alert: { type: 'success' | 'error'; message: string } | null) => void;
	setTeams: (teams: Teams) => void;
	setFixtures: (fixtures: Games) => void;
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
				message: 'Invalid file type, please upload an Excel file',
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
		 * V2 New Index:
		 * 0 - Date (In dd MMM YYYY format)
		 * 1 - Sport (Activity)
		 * 2 - Age + Gender (Team)
		 * 3 - Opponent
		 * 4 - Location
		 * 5 - Start Time (In 12-hour format, e.g., 1:00 AM)
		 * !6 - End Time
		 * 7 - Position (Home/Away)
		 */
		const json = (utils.sheet_to_json(sheet, { header: 1 }) as any[][])
			// Remove header, assume sorted
			.toSpliced(0, 1);

		// Leave this in production for debugging
		console.log('Raw', json);

		// #region Collapse algorithm
		// Remap games into teams and opponents
		const teams: (Teams[number] & { key: string })[] = [];
		const games: Games = [];
		for (const item of json) {
			const dateString = item[0] as string | null;
			if (!dateString) continue;
			const sportString = item[1] as string | null;
			if (!sportString) continue;
			const ageGenderString = item[2] as string | null;
			if (!ageGenderString) continue;
			const opponent = item[3] as string | null;
			const venue = item[4] as string | null;
			const startTime = item[5] as string | null;
			const position = item[7] as string | null;

			// We first extract team
			const [age, gender, ...teamNum] = ageGenderString.split(' ');
			const teamKey = `${ageGenderString}-${sportString}`;
			let teamId = teams.find((team) => team.key === teamKey)?.id;
			if (!teamId) {
				teamId = v4();
				teams.push({
					id: teamId,
					key: teamKey,
					name: `${gender} ${sportString} ${teamNum.join(' ')}`.trim(),
					age: age.toLowerCase() as 'junior' | 'intermediate',
				});
			}

			// Handle the fixture
			const formattedDate = dayjs(dateString).format('YYYY-MM-DD');
			const formattedStartTime = startTime ? dayjs(startTime, 'h:mma').format('HH:mm') : undefined;
			games.push({
				id: v4(),
				date: formattedDate,
				teamId: teamId,
				position: (position ?? 'home').toLocaleLowerCase() as 'home' | 'away',
				opponent: opponent || 'Bye',
				venue,
				start: formattedStartTime,
			});
		}

		console.log('Teams:', teams);
		console.log('Games:', games);
		// #endregion

		setTeams(teams);
		setFixtures(games);

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
