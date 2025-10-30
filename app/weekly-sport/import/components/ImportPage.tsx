'use client';
import { useRouter } from 'next13-progressbar';
import { useEffect, useMemo, useState } from 'react';

import { dayjs } from '@/libs/dayjs';

import { ErrorAlertFixed, SuccessAlertFixed } from '../../../components/Alert';
import { importData } from '../actions';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';

import type { AlertType} from '../../../components/Alert';
import type { Defaults, Games, Teams } from '../types';
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

	const [alert, setAlert] = useState<AlertType>(null);

	const [defaults, setDefaults] = useState<Defaults>({});
	const [teams, setTeams] = useState<Teams>([]);
	const [fixtures, setFixtures] = useState<Games>([]);

	function checkNextNeedDisable(newStep: number) {
		if (fixtures.length > 0) return false;
		else return true;
	}

	const [importState, setImportState] = useState<ImportState>({ type: 'loading' });

	const startImport = useMemo(() => {
		return () => {
			setImportState({ type: 'loading' });
			importData(teams, fixtures, defaults, dayjs.tz.guess())
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
	}, [teams, fixtures, defaults]);

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
						setTeams={setTeams}
						setFixtures={setFixtures}
					/>
				)}
				{step === 2 && (
					<Step2
						setAlert={setAlert}
						teachers={teachers}
						defaults={defaults}
						setDefaults={setDefaults}
						teams={teams}
						setTeams={setTeams}
						fixtures={fixtures}
						setFixtures={setFixtures}
					/>
				)}
				{step === 3 && <Step3 importState={importState} retry={startImport} />}

				<div className="flex justify-between w-full max-w-xl">
					<button
						className="btn btn-primary w-40 shrink!"
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
						className="btn btn-primary w-40 shrink!"
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
