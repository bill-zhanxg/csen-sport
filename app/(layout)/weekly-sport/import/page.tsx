'use client';

import { AppwriteException } from 'appwrite';
import { useEffect, useState } from 'react';

import { database } from '../../../../libs/appwrite';
import { DateInterfaceDocument } from '../../../../libs/appwrite/Interface/Weekly-sport';
import { Error, Success } from '../../../components/Alert';
import { SkeletonBlock } from '../../../components/SkeletonBlock';

export default function WeeklySport() {
	const [dates, setDates] = useState<DateInterfaceDocument[]>();
	const [alert, setAlert] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);

	useEffect(() => {
		database
			.getDates()
			.then(setDates)
			.catch((err: AppwriteException) => {
				setAlert({
					type: 'error',
					message: `Failed to load game list: ${err.message}`,
				});
			});
	}, []);

	return (
		<>
			<main className="flex flex-col items-center gap-4 p-4 overflow-x-auto w-full">
				{dates ? dates.length < 1 ? <div>Unfinished</div> : <p>Unfinished</p> : <SkeletonBlock />}
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
