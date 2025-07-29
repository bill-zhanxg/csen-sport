'use client';
import { dayjs } from '@/libs/dayjs';
import { useSignal } from '@preact/signals-react';
import { useRouter } from 'next13-progressbar';
import { useEffect, useMemo, useState } from 'react';
import { AlertType, ErrorAlertFixed, SuccessAlertFixed } from '../../../components/Alert';
import { importData } from '../actions';
import { Defaults, Games, Opponents, Teams, Venues } from '../types';
import { FixturePages, Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';

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

	const fixturePages = useSignal<FixturePages>([]);
	const venues = useSignal<Venues>([]);

	const [alert, setAlert] = useState<AlertType>(null);

	function checkNextNeedDisable(newStep: number) {
		if (newStep === 1 && fixturePages.value.length > 0) return false;
		else return true;
	}

	const [defaults, setDefaults] = useState<Defaults>({});
	const [teams, setTeams] = useState<Teams>([]);
	const [opponents, setOpponents] = useState<Opponents>([]);
	const [filteredVenues, setFilteredVenues] = useState<Venues>([]);
	const [games, setGames] = useState<Games>([]);

	const [importState, setImportState] = useState<ImportState>({ type: 'loading' });

	const startImport = useMemo(() => {
		return () => {
			setImportState({ type: 'loading' });
			importData(teams, opponents, filteredVenues, games, defaults, dayjs.tz.guess())
				.then((res) => {
					setImportState(res);
					setNextLoading(false);
				})
				.catch(() => {
					// Shouldn't happen
					setImportState({
						type: 'error',
						message: 'An unknown error occurred while importing data. Please try again.',
					});
					setNextLoading(false);
				});
		};
	}, [teams, opponents, filteredVenues, games, defaults]);

	useEffect(() => {
		if (importState.type === 'success') setDisableNext(false);
	}, [importState]);

	return (
		<>
			<main className="flex flex-col items-center gap-4 p-4 overflow-x-auto w-full">
				<ul className="steps steps-vertical xs:steps-horizontal">
					<li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Upload Weekly Sport Excel</li>
					<li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Check & Edit</li>
					<li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Finish</li>
				</ul>
				<h1 className="text-4xl text-center font-bold">Import Weekly Sport Excel to Database</h1>

				{step === 1 && (
					<Step1
						setAlert={setAlert}
						setNextLoading={setNextLoading}
						setDisableNext={setDisableNext}
						fixturePages={fixturePages}
					/>
				)}
				{step === 2 && (
					<Step2
						setAlert={setAlert}
						setDisableNext={setDisableNext}
						fixtures={fixturePages}
						venues={venues}
						teachers={teachers}
						defaults={defaults}
						setDefaults={setDefaults}
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
				{step === 3 && <Step3 importState={importState} retry={startImport} />}

				<div className="flex justify-between w-full max-w-xl">
					<button
						className="btn btn-primary w-32 shrink!"
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
						className="btn btn-primary w-32 shrink!"
						onClick={(e) => {
							e.preventDefault();
							if (step === 2) {
								// Import
								startImport();
							}
							if (step === 3) {
								return router.push('/weekly-sport/timetable');
							}
							setStep((step) => {
								const newStep = step + 1;
								setDisableNext(checkNextNeedDisable(newStep));
								if (newStep === 3) {
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
						) : step === 3 ? (
							'Finish'
						) : step === 2 ? (
							'Import to Database'
						) : (
							'Next'
						)}
					</button>
				</div>
			</main>
			{alert &&
				(alert.type === 'success' ? (
					<SuccessAlertFixed message={alert.message} setAlert={setAlert} />
				) : (
					<ErrorAlertFixed message={alert.message} setAlert={setAlert} />
				))}
		</>
	);
}
