'use client';

import { useSignal } from '@preact/signals-react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next13-progressbar';
import { useEffect, useMemo, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { AlertType, ErrorAlert, SuccessAlert } from '../../../components/Alert';
import { importData } from '../actions';
import { FIxturePages, Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';
import { Games, Opponents, Teams, Venues } from '../types';

dayjs.extend(utc);
dayjs.extend(timezone);

export type ImportState =
	| {
			type: 'success' | 'loading';
	  }
	| {
			type: 'error';
			message: string;
	  };

export function ImportPage({ teachers }: { teachers: { id: string; name?: string | null }[] }) {
	const router = useRouter();

	const [step, setStep] = useState(1);

	const [disablePrevious, setDisablePrevious] = useState(false);
	const [disableNext, setDisableNext] = useState(true);
	const [nextLoading, setNextLoading] = useState(false);

	const fixturePages = useSignal<FIxturePages>([]);
	const venues = useSignal<Venues>([]);

	useEffect(() => {
		pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
	}, []);

	const [alert, setAlert] = useState<AlertType>(null);

	function checkNextNeedDisable(newStep: number) {
		if ((newStep === 1 && fixturePages.value.length > 0) || (newStep === 2 && venues.value.length > 0)) return false;
		else return true;
	}

	const [teams, setTeams] = useState<Teams>([]);
	const [opponents, setOpponents] = useState<Opponents>([]);
	const [filteredVenues, setFilteredVenues] = useState<Venues>([]);
	const [games, setGames] = useState<Games>([]);

	const [importState, setImportState] = useState<ImportState>({ type: 'loading' });

	const startImport = useMemo(() => {
		return () => {
			setImportState({ type: 'loading' });
			importData(teams, opponents, filteredVenues, games, dayjs.tz.guess())
				.then((res) => {
					setImportState(res);
					setNextLoading(false);
				})
				.catch(() => {
					// Shouldn't happen
				});
		};
	}, [teams, opponents, filteredVenues, games]);

	useEffect(() => {
		if (step === 4) startImport();
	}, [step, startImport]);

	useEffect(() => {
		if (importState.type === 'success') setDisableNext(false);
	}, [importState]);

	return (
		<>
			<main className="flex flex-col items-center gap-4 p-4 overflow-x-auto w-full">
				<ul className="steps steps-vertical xs:steps-horizontal">
					<li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Upload Weekly Sport PDF</li>
					<li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Upload Venue PDF</li>
					<li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Check & Edit</li>
					<li className={`step ${step >= 4 ? 'step-primary' : ''}`}>Finish</li>
				</ul>
				<h1 className="text-4xl text-center font-bold">Import Weekly Sport PDF to Database</h1>

				{step === 1 && (
					<Step1
						setAlert={setAlert}
						setNextLoading={setNextLoading}
						setDisableNext={setDisableNext}
						pdfjs={pdfjs}
						fixturePages={fixturePages}
					/>
				)}
				{step === 2 && (
					<Step2
						setAlert={setAlert}
						setNextLoading={setNextLoading}
						setDisableNext={setDisableNext}
						pdfjs={pdfjs}
						venues={venues}
					/>
				)}
				{step === 3 && (
					<Step3
						setAlert={setAlert}
						setDisableNext={setDisableNext}
						fixtures={fixturePages}
						venues={venues}
						teachers={teachers}
						teams={teams}
						setTeams={setTeams}
						opponents={opponents}
						setOpponents={setOpponents}
						filteredVenues={filteredVenues}
						setFilteredVenues={setFilteredVenues}
						games={games}
						setGames={setGames}
					/>
				)}
				{step === 4 && <Step4 importState={importState} retry={startImport} />}

				<div className="flex justify-between w-full max-w-xl">
					<button
						className="btn btn-primary w-32 !shrink"
						onClick={() => {
							setStep((step) => {
								const newStep = step - 1;
								if (!checkNextNeedDisable(newStep)) setDisableNext(false);
								return newStep;
							});
						}}
						disabled={step === 1 || disablePrevious}
					>
						Previous
					</button>
					<button
						className="btn btn-primary w-32 !shrink"
						onClick={() => {
							if (step === 4) return router.push('/weekly-sport/timetable');
							setStep((step) => {
								const newStep = step + 1;
								setDisableNext(checkNextNeedDisable(newStep));
								if (newStep === 4) {
									setDisablePrevious(true);
									setNextLoading(true);
								}
								return newStep;
							});
						}}
						disabled={disableNext}
					>
						{nextLoading ? (
							<span className="loading loading-spinner loading-md"></span>
						) : step === 4 ? (
							'Finish'
						) : step === 3 ? (
							'Import to Database'
						) : (
							'Next'
						)}
					</button>
				</div>
			</main>
			{alert &&
				(alert.type === 'success' ? (
					<SuccessAlert message={alert.message} setAlert={setAlert} />
				) : (
					<ErrorAlert message={alert.message} setAlert={setAlert} />
				))}
		</>
	);
}
