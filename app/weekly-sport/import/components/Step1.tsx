import { useRef, useState } from 'react';
import { v4 } from 'uuid';
import { read, utils } from 'xlsx';
import { toast } from 'sonner';

import { dayjs } from '@/libs/dayjs';

import type { WorkBook } from 'xlsx';
import type { Games, Teams } from '../types';
import { Instructions } from './step1/Instructions';
import { FileUploader } from './step1/FileUploader';
import { SheetSelector } from './step1/SheetSelector';
import { ColumnMapper } from './step1/ColumnMapper';

export function Step1({
	setNextLoading,
	setDisableNext,
	setTeams,
	setFixtures,
	onImportSuccess,
}: {
	setNextLoading: (nextLoading: boolean) => void;
	setDisableNext: (disableNext: boolean) => void;
	setTeams: (teams: Teams) => void;
	setFixtures: (fixtures: Games) => void;
	onImportSuccess?: () => void;
}) {
	const [weeklySportFileDisabled, setWeeklySportFileDisabled] = useState(false);
	const [availableSheets, setAvailableSheets] = useState<string[]>([]);
	const [selectedSheet, setSelectedSheet] = useState<string>('');
	const [showSheetSelector, setShowSheetSelector] = useState(false);
	const [currentWorkbook, setCurrentWorkbook] = useState<WorkBook | null>(null);

	// Column mapping UI state
	const [showColumnMapper, setShowColumnMapper] = useState(false);
	const [headerRow, setHeaderRow] = useState<string[] | null>(null);
	const [sampleRows, setSampleRows] = useState<any[][]>([]);
	const [columnsCount, setColumnsCount] = useState(0);
	const [mapping, setMapping] = useState<Record<string, number | null>>({
		date: 0,
		sport: 1,
		ageGender: 2,
		opponent: 3,
		location: 4,
		startTime: 7,
		endTime: 8,
		position: 19,
	});

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
						// If only one sheet, prepare mapping UI for that sheet
						setCurrentWorkbook(workbook);
						setSelectedSheet(sheetNames[0]);
						prepareMapping(workbook, sheetNames[0]);
					} else {
						// Multiple sheets, show selector
						setCurrentWorkbook(workbook);
						setAvailableSheets(sheetNames);
						setSelectedSheet(sheetNames.includes('FIXTURES') ? 'FIXTURES' : sheetNames[0]);
						setShowSheetSelector(true);
					}
				})
				.catch((err) => {
					toast.error(`Failed to load the selected file: ${err.message}`);
				})
				.finally(() => {
					setNextLoading(false);
					setWeeklySportFileDisabled(false);
				});
		} else {
			setNextLoading(false);
			setWeeklySportFileDisabled(false);
			toast.error('Invalid file type, please upload an Excel file');
		}
	}

	function prepareMapping(workbook: WorkBook, sheetName: string) {
		const sheet = workbook.Sheets[sheetName];
		if (!sheet) {
			toast.error(`Sheet "${sheetName}" not found in the Excel file`);
			return;
		}

		const data = utils.sheet_to_json(sheet, { header: 1 }) as any[][];
		if (!data || data.length === 0) {
			toast.error('Selected sheet appears to be empty');
			return;
		}

		const hdr = (data[0] || []).map((h) => (h === null || h === undefined ? '' : String(h)));
		const samples = data.slice(1, 20);
		const cols = Math.max(...data.map((r) => (r ? r.length : 0)));

		setHeaderRow(hdr.length ? hdr : null);
		setSampleRows(samples);
		setColumnsCount(cols);

		// Ensure mapping defaults fit within available columns
		setMapping((prev) => {
			const newMap: Record<string, number | null> = { ...prev };
			Object.keys(newMap).forEach((k) => {
				const val = newMap[k];
				if (typeof val === 'number' && val >= cols) newMap[k] = null;
			});
			return newMap;
		});

		setShowSheetSelector(false);
		setShowColumnMapper(true);
		setCurrentWorkbook(workbook);
	}

	function updateMapping(key: string, value: number | null) {
		setMapping((m) => ({ ...m, [key]: value }));
	}

	function cancelMapping() {
		setShowColumnMapper(false);
		setCurrentWorkbook(null);
		setHeaderRow(null);
		setSampleRows([]);
		setColumnsCount(0);
		if (fileSelectorRef.current) fileSelectorRef.current.value = '';
	}

	function importUsingMapping(workbook: WorkBook, sheetName: string, providedMapping?: Record<string, number | null>) {
		const map = providedMapping ?? mapping;

		const sheet = workbook.Sheets[sheetName];
		if (!sheet) {
			toast.error(`Sheet "${sheetName}" not found in the Excel file`);
			return;
		}

		const data = utils.sheet_to_json(sheet, { header: 1 }) as any[][];
		const rows = data.slice(1); // remove header

		// Validate required mappings
		if (map.date === null || map.sport === null || map.ageGender === null) {
			toast.error('Please map Date, Sport and Age+Gender columns before importing.');
			return;
		}

		console.log('Raw', rows);

		// Remap games into teams and opponents
		const teams: (Teams[number] & { key: string })[] = [];
		const games: Games = [];
		for (const item of rows) {
			const dateString = item[map.date as number] as string | null;
			if (!dateString) continue;
			const sportString = (map.sport !== null ? item[map.sport] : null) as string | null;
			if (!sportString) continue;
			const ageGenderString = (map.ageGender !== null ? item[map.ageGender] : null) as string | null;
			if (!ageGenderString) continue;
			const opponent = (map.opponent !== null ? item[map.opponent] : null) as string | null;
			const venue = (map.location !== null ? item[map.location] : null) as string | null;
			const startTime = (map.startTime !== null ? item[map.startTime] : null) as string | null;
			const position = (map.position !== null ? item[map.position] : null) as string | null;

			// We first extract team
			const [age, gender, ...teamNum] = String(ageGenderString).split(' ');
			const teamKey = `${ageGenderString}-${sportString}`;
			let teamId = teams.find((team) => team.key === teamKey)?.id;
			if (!teamId) {
				teamId = v4();
				teams.push({
					id: teamId,
					key: teamKey,
					name: `${gender} ${sportString} ${teamNum.join(' ')}`.trim(),
					age: age ? (age.toLowerCase() as 'junior' | 'intermediate') : 'junior',
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

		setTeams(teams);
		setFixtures(games);

		toast.success(`Successfully loaded ${games.length} fixtures for ${teams.length} teams`);

		setDisableNext(false);
		setShowColumnMapper(false);
		setCurrentWorkbook(null);
		if (fileSelectorRef.current) fileSelectorRef.current.value = '';
		
		// Automatically proceed to next step
		if (onImportSuccess) {
			onImportSuccess();
		}
	}

	function handleSheetSelection() {
		if (!currentWorkbook || !selectedSheet) return;

		setNextLoading(true);
		setWeeklySportFileDisabled(true);

		try {
			// Instead of processing immediately, show mapping UI so user can map columns
			prepareMapping(currentWorkbook, selectedSheet);
		} catch (err: any) {
			toast.error(`Failed to process the selected sheet: ${err.message}`);
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
			<Instructions />
			<FileUploader inputRef={fileSelectorRef} disabled={weeklySportFileDisabled} onChange={handleWeeklySportChange} />

			{showSheetSelector && (
				<SheetSelector
					availableSheets={availableSheets}
					selectedSheet={selectedSheet}
					onChange={setSelectedSheet}
					onCancel={cancelSheetSelection}
					onConfirm={handleSheetSelection}
					disabled={weeklySportFileDisabled}
				/>
			)}

				{showColumnMapper && (
					<ColumnMapper
						headerRow={headerRow}
						sampleRows={sampleRows}
						columnsCount={columnsCount}
						mapping={mapping}
						onUpdateMapping={updateMapping}
						onBack={cancelMapping}
						onImport={() => currentWorkbook && selectedSheet && importUsingMapping(currentWorkbook, selectedSheet)}
						disabled={weeklySportFileDisabled}
					/>
				)}
		</>
	);
}
