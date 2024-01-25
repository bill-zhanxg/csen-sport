/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { formatIsJunior, formatTime } from '@/libs/formatValue';
import { SerializedDateWithGames } from '@/libs/gamesToDates';
import { SerializedGame } from '@/libs/serializeData';
import { CellContext, ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Link from 'next/link';
import { ChangeEventHandler, FocusEventHandler, useEffect, useMemo, useState } from 'react';
import { FaPlus, FaRegTrashCan } from 'react-icons/fa6';
import { RawTeacher, RawTeam, RawVenue } from '../../libs/tableData';
import { AlertType, ErrorAlert, SuccessAlert } from '../components/Alert';
import { deleteGame, newGame, updateGame } from './WeeklySportEditActions';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

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
}: {
	date: SerializedDateWithGames;
	teams: RawTeam[];
	teachers: RawTeacher[];
	venues: RawVenue[];
}) {
	const [alert, setAlert] = useState<AlertType>(null);

	const columns = useMemo<ColumnDef<SerializedGame>[]>(() => {
		function editable<T>(
			{ getValue, row: { original }, column: { id } }: CellContext<SerializedGame, unknown>,
			changeOnChange: boolean = false,
			isTime: boolean = false,
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
					const newValue = event.target.value as T;
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

				let importValue = newValue ?? value;

				if (isTime) {
					const time: Date | undefined = formatTime(original.date, importValue as string);
					importValue = time as any;
				}

				updateGame(original.id, { [id]: importValue })
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
							<option disabled value="">
								---
							</option>
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
							<option disabled value="">
								---
							</option>
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
							<option disabled value="">
								---
							</option>
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
									<span className="flex flex-col sm:flex-row justify-between w-full">
										<h4 className="text-lg font-bold">Date</h4>
										<p className="text-lg">{original.date?.toLocaleDateString() ?? '---'}</p>
									</span>
									<span className="flex flex-col sm:flex-row justify-between w-full">
										<h4 className="text-lg font-bold">Group</h4>
										<p className="text-lg">
											{original.team ? (original.team.isJunior ? 'Junior' : 'Intermediate') : '---'}
										</p>
									</span>
									<span className="flex flex-col sm:flex-row justify-between w-full">
										<h4 className="text-lg font-bold">Team Name:</h4>
										<p className="text-lg">{original.team?.name ?? '---'}</p>
									</span>
									<span className="flex flex-col sm:flex-row justify-between w-full">
										<h4 className="text-lg font-bold">Opponent:</h4>
										<p className="text-lg">{original.opponent ?? '---'}</p>
									</span>
									<span className="flex flex-col sm:flex-row justify-between w-full">
										<h4 className="text-lg font-bold">Venue:</h4>
										<p className="text-lg">{original.venue?.name ?? '---'}</p>
									</span>
									<span className="flex flex-col sm:flex-row justify-between w-full">
										<h4 className="text-lg font-bold">Teacher:</h4>
										<p className="text-lg">{original.teacher?.name ?? '---'}</p>
									</span>
									<span className="flex flex-col sm:flex-row justify-between w-full">
										<h4 className="text-lg font-bold">Transportation:</h4>
										<p className="text-lg">{original.transportation ?? '---'}</p>
									</span>
									<span className="flex flex-col sm:flex-row justify-between w-full">
										<h4 className="text-lg font-bold">Out of Class:</h4>
										<p className="text-lg">{original.out_of_class?.toLocaleTimeString() ?? '---'}</p>
									</span>
									<span className="flex flex-col sm:flex-row justify-between w-full">
										<h4 className="text-lg font-bold">Start:</h4>
										<p className="text-lg">{original.start?.toLocaleTimeString() ?? '---'}</p>
									</span>
									<span className="flex flex-col sm:flex-row justify-between w-full">
										<h4 className="text-lg font-bold">Notes:</h4>
										<p className="text-lg">{original.notes ?? '---'}</p>
									</span>
									<div className="modal-action">
										<form method="dialog">
											<button
												className="btn btn-error"
												onClick={() => {
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
	const [newOpponent, setNewOpponent] = useState('');
	const [newVenue, setNewVenue] = useState('');
	const [newTeacher, setNewTeacher] = useState('');
	const [newTransportation, setNewTransportation] = useState('');
	const [newNotes, setNewNotes] = useState('');
	const [newOutOfClass, setNewOutOfClass] = useState('');
	const [newStart, setNewStart] = useState('');

	return (
		<>
			<div className="w-full bg-base-100 rounded-xl border-2 border-base-200 shadow-lg shadow-base-200 p-4">
				<Link
					href={`/date/${date.rawDate.valueOf()}`}
					className="block sticky left-0 text-xl text-center link link-primary"
				>
					Weekly Sport {date.date}
				</Link>
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
										<option disabled value="">
											Venue
										</option>
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
										<option disabled value="">
											Teacher
										</option>
										{teachers.map((teacher) => (
											<option key={teacher.id} value={teacher.id}>
												{teacher.name}
											</option>
										))}
									</select>
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
										onClick={() => {
											setNewTeam('');
											setNewOpponent('');
											setNewVenue('');
											setNewTeacher('');
											setNewTransportation('');
											setNewNotes('');
											setNewOutOfClass('');
											setNewStart('');
											newGame({
												date: date.rawDate,
												team: newTeam,
												opponent: newOpponent,
												venue: newVenue,
												teacher: newTeacher,
												transportation: newTransportation,
												notes: newNotes,
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
					<SuccessAlert message={alert.message} setAlert={setAlert} />
				) : (
					<ErrorAlert message={alert.message} setAlert={setAlert} />
				))}
		</>
	);
}
