import { Signal, useSignal } from '@preact/signals-react';
import { RowData } from '@tanstack/react-table';
import { useRef } from 'react';
import { FIxturePages } from './Step1';
import { Venues } from './Step2';

declare module '@tanstack/react-table' {
	interface TableMeta<TData extends RowData> {
		updateData: (rowIndex: number, columnId: string, value: unknown) => void;
	}
}

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
	const schoolCsenCodeRef = useRef<HTMLInputElement>(null);
	const filteredFixtures = useSignal<FIxturePages>([]);

	return (
		<>
			<p className="text-xl font-bold text-error text-center max-w-2xl">DO NOT EXIT THIS PAGE, CHANGES WILL BE LOST</p>
			<div className="flex gap-2 w-full max-w-xl">
				<input
					type="text"
					placeholder="Enter your school CSEN code"
					className="input input-bordered w-full"
					ref={schoolCsenCodeRef}
				/>
				<button
					className="btn btn-accent"
					onClick={() => {
						console.log(fixtures.value);
						
						const schoolCsenCode = schoolCsenCodeRef.current?.value.trim().toLowerCase();
						if (!schoolCsenCode) return setAlert({ type: 'error', message: 'Please enter your CSEN school code' });
						const filteredFixtures = fixtures.value.map((team) => {
							return {
								team,
								games: team.games.map((games) => {
									return {
										games,
										...games.map((game) => {
											return {
												game,
												games: game.games.filter((game) => {
													if (
														'text' in game ||
														game.team1.includes(schoolCsenCode) ||
														game.team2.includes(schoolCsenCode)
													)
														return true;
													return false;
												}),
											};
										}),
									};
								}),
							};
						});
						console.log(filteredFixtures);
					}}
				>
					Filter
				</button>
			</div>
		</>
	);
}
