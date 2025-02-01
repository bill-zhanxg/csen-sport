/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { dayjs } from '@/libs/dayjs';
import { formatIsJunior, formatTime } from '@/libs/formatValue';
import { SerializedGame } from '@/libs/serializeData';
import { SerializedDateWithGames } from '@/libs/tableHelpers';
import { CellContext, ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Link from 'next/link';
import { ChangeEvent, ChangeEventHandler, FocusEventHandler, useEffect, useMemo, useState } from 'react';
import { FaPlus, FaRegTrashCan } from 'react-icons/fa6';
import { RawTeacher, RawTeam, RawVenue } from '../../libs/tableData';
import { AlertType, ErrorAlertFixed, SuccessAlertFixed } from '../components/Alert';
import { SideBySide } from './SideBySide';
import { TeachersMultiSelect } from './TeachersMultiSelect';
import { deleteGame, newGame, updateGame } from './WeeklySportEditActions';

const defaultColumn: Partial<ColumnDef<SerializedGame>> = {
	cell: ({ getValue }) => {
		return <input className="input input-bordered rounded-none w-full" value={getValue() as string} disabled />;
	},
};

export function WeeklySportEdit({
	date,
	teams,
	teachers,
	venues,
	timezone,
}: {
	date: SerializedDateWithGames;
	teams: RawTeam[];
	teachers: RawTeacher[];
	venues: RawVenue[];
	timezone: string;
}) {
	const [alert, setAlert] = useState<AlertType>(null);

	const columns = useMemo<ColumnDef<SerializedGame>[]>(() => {
		function editable<T>(
			{ getValue, row: { original }, column: { id } }: CellContext<SerializedGame, unknown>,
			changeOnChange: boolean = false,
			isTime: boolean = false,
			isCheckbox: boolean = false,
		): [T, boolean, ChangeEventHandler<HTMLElement> | undefined, FocusEventHandler<HTMLElement> | undefined] {
			let initialValue = getValue() as T;
			if (isTime)
				initialValue = initialValue ? (dayjs(initialValue as any).format('HH:mm') as unknown as T) : initialValue;
			const [value, setValue] = useState(initialValue);
			const [previousValue, setPreviousValue] = useState(value);
			const [disabled, setDisabled] = useState(false);
			useEffect(() => {
				setValue(initialValue);
			}, [initialValue]);
			return [
				value,
				disabled,
				(event) => {
					if (!('value' in event.target)) return;
					let newValue = event.target.value as T;
					if (isCheckbox) newValue = (event.currentTarget as any).checked as any;
					setValue(newValue);
					if (changeOnChange) uploadData(newValue);
				},
				(event) => {
					if (!('value' in event.target)) return;
					if (!changeOnChange && previousValue !== value) {
						uploadData();
						setPreviousValue(value);
					}
				},
			];
			function uploadData(newValue?: T) {
				setDisabled(true);

				let importValue = newValue === undefined ? value : newValue;

				if (isTime) {
					const time: Date | undefined = formatTime(original.date, importValue as string);
					importValue = time as any;
				}

				updateGame(original.id, { [id]: importValue } as any)
					.then((res) => {
						setAlert(res);
						setDisabled(false);
					})
					.catch(() => {
						setAlert({
							type: 'error',
							message: 'A network error occurred. Please try again later.',
						});
					});
			}
		}

		return [
			{
				id: 'team',
				accessorFn: (row) => row.team?.id,
				header: 'Team',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop, true);
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value ?? ''}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						>
							<option value="">---</option>
							{teams.map((team) => (
								<option key={team.id} value={team.id}>
									[{team.isJunior ? 'Junior' : 'Intermediate'}] {team.name}
								</option>
							))}
						</select>
					);
				},
			},
			{
				id: 'isHome',
				accessorKey: 'isHome',
				header: 'Position',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<boolean>(prop, true);
					const convertToBoolean = (event: ChangeEvent<HTMLSelectElement>) =>
						({
							target: {
								value: event.target.value ? event.target.value === 'home' : null,
							},
						} as any);
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value === undefined || value === null ? '' : value ? 'home' : 'away'}
							disabled={disabled}
							onChange={(event) => {
								if (onChange) onChange(convertToBoolean(event));
							}}
							onBlur={(event) => {
								if (onBlur) onBlur(convertToBoolean(event));
							}}
						>
							<option value="">Select a position</option>
							<option value="home">Home</option>
							<option value="away">Away</option>
						</select>
					);
				},
			},
			{
				id: 'opponent',
				accessorKey: 'opponent',
				header: 'Opponent',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop);
					return (
						<input
							className="input input-bordered rounded-none w-full"
							value={value ?? ''}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
			{
				id: 'venue',
				accessorFn: (row) => row.venue?.id,
				header: 'Venue',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop, true);
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value ?? ''}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						>
							<option value="">---</option>
							{venues.map((venue) => (
								<option key={venue.id} value={venue.id}>
									{venue.name} ({venue.court_field_number})
								</option>
							))}
						</select>
					);
				},
			},
			{
				id: 'teacher',
				accessorFn: (row) => row.teacher?.id,
				header: 'Teacher',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop, true);
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value ?? ''}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						>
							<option value="">---</option>
							{teachers.map((teacher) => (
								<option key={teacher.id} value={teacher.id}>
									{teacher.name}
								</option>
							))}
						</select>
					);
				},
			},
			{
				id: 'extra_teachers',
				accessorFn: (row) => row.extra_teachers,
				header: 'Extra Teachers',
				cell: (prop) => {
					const [value, disabled, onChange] = editable<string[] | undefined | null>(prop, true);
					return TeachersMultiSelect({
						teachers,
						value: value ?? [],
						onChange: (e) => {
							if (onChange) onChange(e as any);
						},
						disabled,
					});
				},
			},
			{
				id: 'transportation',
				accessorKey: 'transportation',
				header: 'Transportation',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop);
					return (
						<input
							className="input input-bordered rounded-none w-full"
							value={value ?? ''}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
			{
				id: 'notes',
				accessorKey: 'notes',
				header: 'Notes',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop);
					return (
						<input
							className="input input-bordered rounded-none w-full"
							value={value ?? ''}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
			{
				id: 'confirmed',
				accessorKey: 'confirmed',
				header: 'Confirmed',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<boolean>(prop, true, false, true);
					return (
						<div className="flex justify-center w-full">
							<input
								type="checkbox"
								className="checkbox checkbox-primary"
								checked={value ?? false}
								disabled={disabled}
								onChange={onChange}
								onBlur={onBlur}
							/>
						</div>
					);
				},
			},
			{
				id: 'out_of_class',
				accessorKey: 'out_of_class',
				header: 'Out of Class',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop, false, true);
					return (
						<input
							type="time"
							className="bg-base-100 ml-4"
							value={value ?? ''}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
			{
				id: 'start',
				accessorKey: 'start',
				header: 'Start',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop, false, true);
					return (
						<input
							type="time"
							className="bg-base-100 ml-4"
							value={value ?? ''}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
			{
				id: 'actions',
				header: () => null,
				cell: ({ row: { original } }) => {
					return (
						<div className="flex gap-2 justify-end w-full">
							<button
								className="btn btn-error"
								onClick={(event) => (event.currentTarget.nextElementSibling as HTMLDialogElement).showModal()}
							>
								<FaRegTrashCan />
							</button>
							<dialog className="modal">
								<div className="modal-box">
									<h3 className="font-bold text-lg">Confirmation</h3>
									<p className="py-4">
										Are you sure you want to delete the following game? This action can not be undone.
									</p>
									<SideBySide title="Date:" value={original.date?.toLocaleDateString() ?? '---'} />
									<SideBySide
										title="Group:"
										value={original.team ? (original.team.isJunior ? 'Junior' : 'Intermediate') : '---'}
									/>
									<SideBySide title="Team Name:" value={original.team?.name ?? '---'} />
									<SideBySide title="Opponent:" value={original.opponent ?? '---'} />
									<SideBySide title="Venue:" value={original.venue?.name ?? '---'} />
									<SideBySide title="Teacher:" value={original.teacher?.name ?? '---'} />
									<SideBySide title="Transportation:" value={original.transportation ?? '---'} />
									<SideBySide title="Out of Class:" value={original.out_of_class?.toLocaleTimeString() ?? '---'} />
									<SideBySide title="Start:" value={original.start?.toLocaleTimeString() ?? '---'} />
									<SideBySide title="Notes:" value={original.notes ?? '---'} />
									<SideBySide title="Confirmed:" value={original.confirmed ? 'Yes' : 'No'} />
									<div className="modal-action">
										<form method="dialog">
											<button
												className="btn btn-error"
												onClick={(e) => {
													e.preventDefault();
													deleteGame(original.id)
														.then(setAlert)
														.catch(() => {
															setAlert({
																type: 'error',
																message: 'A network error occurred. Please try again later.',
															});
														});
												}}
											>
												Remove
											</button>
										</form>
										<form method="dialog">
											<button className="btn">Close</button>
										</form>
									</div>
								</div>
							</dialog>
						</div>
					);
				},
			},
		];
	}, [teams, venues, teachers]);

	const table = useReactTable({
		columns,
		defaultColumn,
		data: date.games,
		getCoreRowModel: getCoreRowModel(),
	});

	const usedTeams = useMemo(() => {
		return date.games.map((game) => game.team?.id);
	}, [date.games]);
	const [newTeam, setNewTeam] = useState('');
	const [newPosition, setNewPosition] = useState<'' | 'home' | 'away'>('');
	const [newOpponent, setNewOpponent] = useState('');
	const [newVenue, setNewVenue] = useState('');
	const [newTeacher, setNewTeacher] = useState('');
	const [newExtraTeachers, setNewExtraTeachers] = useState<string[]>([]);
	const [newTransportation, setNewTransportation] = useState('');
	const [newNotes, setNewNotes] = useState('');
	const [newConfirmed, setNewConfirmed] = useState(false);
	const [newOutOfClass, setNewOutOfClass] = useState('');
	const [newStart, setNewStart] = useState('');

	return (
		<>
			<div className="w-full bg-base-100 rounded-xl border-2 border-base-200 shadow-lg shadow-base-200 p-4">
				<div className="flex justify-center sticky left-0">
					<Link href={`/date/${date.rawDate.valueOf()}`} className="text-xl text-center link link-primary">
						Weekly Sport {date.date}
					</Link>
				</div>
				<div className="overflow-x-auto">
					<table className="table text-lg">
						<thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<th key={header.id} colSpan={header.colSpan}>
												{header.isPlaceholder ? null : (
													<div className="text-lg">
														{flexRender(header.column.columnDef.header, header.getContext())}
													</div>
												)}
											</th>
										);
									})}
								</tr>
							))}
						</thead>
						<tbody>
							{table.getRowModel().rows.map((row) => {
								return (
									<tr key={row.id}>
										{row.getVisibleCells().map((cell) => {
											return (
												<td className="p-0 last:w-20" key={cell.id}>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</td>
											);
										})}
									</tr>
								);
							})}
						</tbody>
						<tfoot className="text-[95%]">
							<tr>
								<td className="p-0">
									<select
										className="select select-bordered rounded-none w-full"
										value={newTeam}
										onChange={(event) => setNewTeam(event.target.value)}
									>
										<option disabled value="">
											Add a Game
										</option>
										{teams
											.filter((team) => !usedTeams.includes(team.id))
											.map((team) => (
												<option key={team.id} value={team.id}>
													[{formatIsJunior(team.isJunior)}] {team.name}
												</option>
											))}
									</select>
								</td>
								<td className="p-0">
									<select
										className="select select-bordered rounded-none w-full"
										value={newPosition}
										onChange={(event) => setNewPosition(event.target.value as '' | 'home' | 'away')}
									>
										<option value="">Position</option>
										<option value="home">Home</option>
										<option value="away">Away</option>
									</select>
								</td>
								<td className="p-0">
									<input
										className="input input-bordered rounded-none w-full"
										placeholder="Opponent"
										value={newOpponent}
										onChange={(event) => setNewOpponent(event.target.value)}
									/>
								</td>
								<td className="p-0">
									<select
										className="select select-bordered rounded-none w-full"
										value={newVenue}
										onChange={(event) => setNewVenue(event.target.value)}
									>
										<option value="">Venue</option>
										{venues.map((venue) => (
											<option key={venue.id} value={venue.id}>
												{venue.name} ({venue.court_field_number})
											</option>
										))}
									</select>
								</td>
								<td className="p-0">
									<select
										className="select select-bordered rounded-none w-full"
										value={newTeacher}
										onChange={(event) => setNewTeacher(event.target.value)}
									>
										<option value="">Teacher</option>
										{teachers.map((teacher) => (
											<option key={teacher.id} value={teacher.id}>
												{teacher.name}
											</option>
										))}
									</select>
								</td>
								<td className="p-0">
									{TeachersMultiSelect({
										teachers,
										value: newExtraTeachers ?? [],
										onChange: (e) => {
											setNewExtraTeachers(e.target.value);
										},
									})}
								</td>
								<td className="p-0">
									<input
										className="input input-bordered rounded-none w-full"
										placeholder="Transportation"
										value={newTransportation}
										onChange={(event) => setNewTransportation(event.target.value)}
									/>
								</td>
								<td className="p-0">
									<input
										className="input input-bordered rounded-none w-full"
										placeholder="Notes"
										value={newNotes}
										onChange={(event) => setNewNotes(event.target.value)}
									/>
								</td>
								<td className="p-0">
									<div className="flex justify-center w-full">
										<input
											type="checkbox"
											className="checkbox checkbox-primary"
											placeholder="Confirmed"
											checked={newConfirmed}
											onChange={(event) => setNewConfirmed(event.currentTarget.checked)}
										/>
									</div>
								</td>
								<td className="p-0">
									<input
										type="time"
										className="bg-base-100 ml-4"
										value={newOutOfClass}
										onChange={(event) => setNewOutOfClass(event.target.value)}
									/>
								</td>
								<td className="p-0">
									<input
										type="time"
										className="bg-base-100 ml-4"
										value={newStart}
										onChange={(event) => setNewStart(event.target.value)}
									/>
								</td>
								<td className="flex justify-end p-0 pt-1">
									<button
										className="btn btn-square"
										disabled={newTeam === '' || newOpponent === ''}
										onClick={(e) => {
											e.preventDefault();
											newGame({
												date: date.rawDate,
												team: newTeam,
												isHome: newPosition === 'home',
												opponent: newOpponent,
												venue: newVenue,
												teacher: newTeacher,
												extra_teachers: newExtraTeachers,
												transportation: newTransportation,
												notes: newNotes,
												confirmed: newConfirmed,
												out_of_class: formatTime(date.rawDate, newOutOfClass),
												start: formatTime(date.rawDate, newStart),
											})
												.then(setAlert)
												.catch(() => {
													setAlert({
														type: 'error',
														message: 'A network error occurred. Please try again later.',
													});
												});
											setNewTeam('');
											setNewOpponent('');
											setNewVenue('');
											setNewTeacher('');
											setNewExtraTeachers([]);
											setNewTransportation('');
											setNewNotes('');
											setNewConfirmed(false);
											setNewOutOfClass('');
											setNewStart('');
										}}
									>
										<FaPlus />
									</button>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
			{alert &&
				(alert.type === 'success' ? (
					<SuccessAlertFixed message={alert.message} setAlert={setAlert} />
				) : (
					<ErrorAlertFixed message={alert.message} setAlert={setAlert} />
				))}
		</>
	);
}
