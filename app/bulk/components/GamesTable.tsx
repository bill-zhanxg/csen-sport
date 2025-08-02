'use client';
/* eslint-disable react-hooks/rules-of-hooks */

import { AlertType, ErrorAlert, SuccessAlert } from '@/app/components/Alert';
import { TeachersMultiSelect } from '@/app/globalComponents/TeachersMultiSelect';
import { useBeforeUnload } from '@/app/globalComponents/useBeforeUnload';
import { dayjs } from '@/libs/dayjs';
import { formatDate, formatIsJunior, formatTime } from '@/libs/formatValue';
import { SerializedGameWithId } from '@/libs/serializeData';
import { RawTeacher, RawTeam } from '@/libs/tableData';
import {
	CellContext,
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { ChangeEvent, ChangeEventHandler, FocusEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { FaPlus, FaRegTrashCan } from 'react-icons/fa6';
import { v4 } from 'uuid';
import { GameChanges, updateGamesBulk } from '../actions';

export function GamesTable({
	teams,
	gamesRaw,
	teachers,
}: {
	gamesRaw: SerializedGameWithId[];
	teams: RawTeam[];
	teachers: RawTeacher[];
}) {
	const [games, setGames] = useState<SerializedGameWithId[]>(gamesRaw);
	const changes = useRef<GameChanges[number][]>([]);

	useEffect(() => {
		setGames(gamesRaw);
	}, [gamesRaw]);

	const columns = useMemo<ColumnDef<SerializedGameWithId>[]>(() => {
		function editable<T>(
			{ getValue, row: { original }, column: { id } }: CellContext<SerializedGameWithId, unknown>,
			type: 'text' | 'date' | 'time' | 'checkbox' = 'text',
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
					let newValue = event.target.value as T;
					if (type === 'checkbox') newValue = (event.currentTarget as any).checked as any;
					setValue(newValue);
				},
				(event) => {
					if (!('value' in event.target)) return;
					const value = event.target.value as T;
					if (previousValue !== value) {
						let importValue = value;
						if (type === 'date') importValue = formatDate(importValue as string) as any;
						if (type === 'time') importValue = formatTime(original.date, importValue as string) as any;
						if (type === 'checkbox') importValue = (event.currentTarget as any).checked as any;
						const index = changes.current.findIndex((change) => change.type !== 'delete' && change.id === original.id);
						if (index !== -1) {
							(changes.current[index] as any).value[id] = importValue;
						} else
							changes.current.push({
								type: 'update',
								id: original.id,
								value: {
									[id]: importValue,
								} as any,
							});
						setChanged(true);
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
				id: 'isHome',
				accessorKey: 'isHome',
				header: 'Position',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<boolean>(prop);
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
						<input
							className="input input-bordered rounded-none w-full"
							placeholder="Type venue here"
							value={value ?? ''}
							onChange={onChange}
							onBlur={onBlur}
						/>
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
				id: 'extra_teachers',
				accessorFn: (row) => row.extra_teachers,
				header: 'Extra Teachers',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string[] | undefined>(prop);
					return TeachersMultiSelect({
						teachers,
						value: value ?? [],
						onChange: (e) => {
							if (onChange) onChange(e as any);
							if (onBlur) onBlur(e as any);
						},
					});
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
				id: 'confirmed',
				accessorKey: 'confirmed',
				header: 'Confirmed',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<boolean>(prop, 'checkbox');
					return (
						<div className="flex justify-center w-full">
							<input
								type="checkbox"
								className="checkbox checkbox-primary"
								checked={value ?? false}
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
								onClick={(e) => {
									e.preventDefault();
									changes.current.push({
										type: 'delete',
										id: original.id,
									});
									setGames((games) => games.filter((game) => game.id !== original.id));
									setChanged(true);
								}}
							>
								<FaRegTrashCan />
							</button>
						</div>
					);
				},
			},
		];
	}, [teams, teachers]);

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

	const [alert, setAlert] = useState<AlertType>(null);
	const [changed, setChanged] = useState(false);
	const [loading, setLoading] = useState(false);

	useBeforeUnload(changed, 'You have unsaved changes - are you sure you wish to leave this page?');

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
								<input
									className="input input-bordered rounded-none w-full"
									placeholder="Opponent"
									value={newVenue}
									onChange={(event) => setNewVenue(event.target.value)}
								/>
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
									disabled={newDate === '' || newTeam === '' || newOpponent === ''}
									onClick={(e) => {
										e.preventDefault();
										const date = formatDate(newDate);
										const value = {
											// id will not be used by the server
											id: v4(),
											date: date,
											team: newTeam || undefined,
											isHome: newPosition ? newPosition === 'home' : undefined,
											opponent: newOpponent || undefined,
											venue: newVenue || undefined,
											teacher: newTeacher || undefined,
											extra_teachers: newExtraTeachers || undefined,
											transportation: newTransportation || undefined,
											notes: newNotes || undefined,
											confirmed: newConfirmed,
											out_of_class: formatTime(date, newOutOfClass),
											start: formatTime(date, newStart),
										};
										changes.current.push({
											type: 'create',
											id: value.id,
											value,
										});
										setGames((games) => [...games, value]);
										setChanged(true);

										setNewDate('');
										setNewTeam('');
										setNewPosition('');
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
				<div className="mt-2"></div>
				<div className="sticky left-0">
					{alert && (alert.type === 'error' ? ErrorAlert(alert) : SuccessAlert(alert))}
					<button
						className="btn btn-primary w-full mt-2"
						disabled={!changed || loading}
						onClick={async (e) => {
							e.preventDefault();
							setLoading(true);
							const res = await updateGamesBulk(changes.current);
							if (res?.type === 'success') {
								setChanged(false);
								changes.current = [];
							}
							setAlert(res);
							setLoading(false);
						}}
					>
						Update Games
					</button>
				</div>
			</div>
		</>
	);
}
