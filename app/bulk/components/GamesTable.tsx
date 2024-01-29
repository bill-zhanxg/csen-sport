'use client';
import { dayjs } from '@/libs/dayjs';
/* eslint-disable react-hooks/rules-of-hooks */

import { AlertType, ErrorAlert, SuccessAlert } from '@/app/components/Alert';
import { formatDate, formatIsJunior, formatTime } from '@/libs/formatValue';
import { SerializedGameWithId } from '@/libs/serializeData';
import { RawTeacher, RawTeam, RawVenue } from '@/libs/tableData';
import { useSignal } from '@preact/signals-react';
import {
	CellContext,
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { ChangeEventHandler, FocusEventHandler, useEffect, useMemo, useState } from 'react';
import { FaPlus, FaRegTrashCan } from 'react-icons/fa6';
import { v4 } from 'uuid';
import { GameChanges, updateGamesBulk } from '../actions';

export function GamesTable({
	teams,
	venues,
	gamesRaw,
	teachers,
}: {
	gamesRaw: SerializedGameWithId[];
	teams: RawTeam[];
	venues: RawVenue[];
	teachers: RawTeacher[];
}) {
	const [games, setGames] = useState<SerializedGameWithId[]>(gamesRaw);
	const changes = useSignal<GameChanges[number][]>([]);

	useEffect(() => {
		setGames(gamesRaw);
	}, [gamesRaw]);

	const columns = useMemo<ColumnDef<SerializedGameWithId>[]>(() => {
		function editable<T>(
			{ getValue, row: { original }, column: { id }, table }: CellContext<SerializedGameWithId, unknown>,
			type: 'text' | 'date' | 'time' = 'text',
		): [T, ChangeEventHandler<HTMLElement> | undefined, FocusEventHandler<HTMLElement> | undefined] {
			let initialValue = getValue() as T;
			if (type === 'date')
				initialValue = initialValue ? (dayjs(initialValue as any).format('YYYY-MM-DD') as unknown as T) : initialValue;
			if (type === 'time')
				initialValue = initialValue ? (dayjs(initialValue as any).format('HH:mm') as unknown as T) : initialValue;
			const [value, setValue] = useState(initialValue);
			const [previousValue, setPreviousValue] = useState(value);
			useEffect(() => {
				setValue(initialValue);
			}, [initialValue]);
			return [
				value,
				(event) => {
					if (!('value' in event.target)) return;
					const newValue = event.target.value as T;
					setValue(newValue);
				},
				(event) => {
					if (!('value' in event.target)) return;
					if (previousValue !== value) {
						let importValue = value;
						if (type === 'date') importValue = formatDate(importValue as string) as any;
						if (type === 'time') importValue = formatTime(original.date, importValue as string) as any;
						const index = changes.value.findIndex((change) => change.type !== 'delete' && change.id === original.id);
						if (index !== -1) {
							(changes.value[index] as any).value[id] = importValue;
						} else
							changes.value.push({
								type: 'update',
								id: original.id,
								value: {
									[id]: importValue,
								},
							});
						setPreviousValue(value);
					}
				},
			];
		}

		return [
			{
				id: 'date',
				accessorKey: 'date',
				header: 'Date',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string>(prop, 'date');
					return (
						<input
							type="date"
							className="bg-base-100 px-4 w-full"
							value={value ?? ''}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
			{
				id: 'team',
				accessorKey: 'team',
				header: 'Team',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string>(prop);
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value}
							onChange={onChange}
							onBlur={onBlur}
						>
							<option disabled>Select a team</option>
							{teams.map((team) => (
								<option key={team.id} value={team.id}>
									[{formatIsJunior(team.isJunior)}] {team.name}
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
					const [value, onChange, onBlur] = editable<string>(prop);
					return (
						<input
							className="input input-bordered rounded-none w-full"
							placeholder="Type opponent here"
							value={value ?? ''}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
			{
				id: 'venue',
				accessorKey: 'venue',
				header: 'Venue',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string>(prop);
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value}
							onChange={onChange}
							onBlur={onBlur}
						>
							<option disabled>Select venue</option>
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
				accessorKey: 'teacher',
				header: 'Teacher',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string | undefined>(prop);
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value ?? ''}
							onChange={onChange}
							onBlur={onBlur}
						>
							<option value={''} disabled>
								Select a teacher
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
					const [value, onChange, onBlur] = editable<string>(prop);
					return (
						<input
							className="input input-bordered rounded-none w-full"
							placeholder="Type transportation here"
							value={value ?? ''}
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
					const [value, onChange, onBlur] = editable<string>(prop);
					return (
						<input
							className="input input-bordered rounded-none w-full"
							placeholder="Extra info"
							value={value ?? ''}
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
					const [value, onChange, onBlur] = editable<string | undefined>(prop, 'time');
					return (
						<input type="time" className="bg-base-100 ml-4" value={value ?? ''} onChange={onChange} onBlur={onBlur} />
					);
				},
			},
			{
				id: 'start',
				accessorKey: 'start',
				header: 'Start Time',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string | undefined>(prop, 'time');
					return (
						<input type="time" className="bg-base-100 ml-4" value={value ?? ''} onChange={onChange} onBlur={onBlur} />
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
								onClick={() => {
									changes.value.push({
										type: 'delete',
										id: original.id,
									});
									setGames((games) => games.filter((game) => game.id !== original.id));
								}}
							>
								<FaRegTrashCan />
							</button>
						</div>
					);
				},
			},
		];
	}, [teams, venues, teachers, changes.value]);

	const table = useReactTable({
		columns,
		data: games,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		initialState: {
			sorting: [
				{
					id: 'date',
					desc: false,
				},
			],
		},
	});

	const [newDate, setNewDate] = useState('');
	const [newTeam, setNewTeam] = useState('');
	const [newOpponent, setNewOpponent] = useState('');
	const [newVenue, setNewVenue] = useState('');
	const [newTeacher, setNewTeacher] = useState('');
	const [newTransportation, setNewTransportation] = useState('');
	const [newNotes, setNewNotes] = useState('');
	const [newOutOfClass, setNewOutOfClass] = useState('');
	const [newStart, setNewStart] = useState('');

	const [alert, setAlert] = useState<AlertType>(null);
	const [loading, setLoading] = useState(false);

	return (
		<>
			<p className="text-xl font-bold mt-4 text-center">Games (Click update button after modify in bulk)</p>
			<div className="overflow-x-auto w-full">
				<table className="table text-lg">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<th key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder ? null : (
												<div className="text-lg">{flexRender(header.column.columnDef.header, header.getContext())}</div>
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
								<input
									type="date"
									className="bg-base-100 px-4 w-full"
									value={newDate}
									onChange={(event) => setNewDate(event.target.value)}
								/>
							</td>
							<td className="p-0">
								<select
									className="select select-bordered rounded-none w-full"
									value={newTeam}
									onChange={(event) => setNewTeam(event.target.value)}
								>
									<option disabled value="">
										Add a Game
									</option>
									{teams.map((team) => (
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
									disabled={newDate === '' || newTeam === '' || newOpponent === ''}
									onClick={() => {
										const date = formatDate(newDate);
										const value = {
											// id will not be used by the server
											id: v4(),
											date: date,
											team: newTeam || undefined,
											opponent: newOpponent || undefined,
											venue: newVenue || undefined,
											teacher: newTeacher || undefined,
											transportation: newTransportation || undefined,
											notes: newNotes || undefined,
											out_of_class: formatTime(date, newOutOfClass),
											start: formatTime(date, newStart),
										};
										changes.value.push({
											type: 'create',
											id: value.id,
											value,
										});
										setGames((games) => [...games, value]);

										setNewDate('');
										setNewTeam('');
										setNewOpponent('');
										setNewVenue('');
										setNewTeacher('');
										setNewTransportation('');
										setNewNotes('');
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
				<div className="mt-2"></div>
				{alert && (alert.type === 'error' ? ErrorAlert(alert) : SuccessAlert(alert))}
				<button
					className="btn btn-primary w-full mt-2"
					disabled={loading}
					onClick={async () => {
						setLoading(true);
						const res = await updateGamesBulk(changes.value);
						setAlert(res);
						setLoading(false);
					}}
				>
					Update Games
				</button>
			</div>
		</>
	);
}
