'use client';
/* eslint-disable react-hooks/rules-of-hooks */

import { AlertType, ErrorAlert, SuccessAlert } from '@/app/components/Alert';
import { PreventUnload } from '@/app/globalComponents/PreventUnload';
import { TeachersMultiSelect } from '@/app/globalComponents/TeachersMultiSelect';
import { dayjs } from '@/libs/dayjs';
import { RawTeacher } from '@/libs/tableData';
import {
	CellContext,
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next13-progressbar';
import { ChangeEventHandler, FocusEventHandler, useEffect, useMemo, useState } from 'react';
import { FaPlus, FaRegTrashCan } from 'react-icons/fa6';
import { v4 } from 'uuid';
import { Game, Team, Venue, createWeeklySport } from '../actions';

export function Tables({ teachers }: { teachers: RawTeacher[] }) {
	const router = useRouter();

	const [teams, setTeams] = useState<Team[]>([]);
	const [venues, setVenues] = useState<Venue[]>([]);
	const [games, setGames] = useState<Game[]>([]);

	const [changed, setChanged] = useState(false);
	useEffect(() => {
		if (teams.length === 0 && venues.length === 0 && games.length === 0) return;
		if (changed) return;
		setChanged(true);
	}, [teams.length, venues.length, games.length, changed]);

	// #region Venues
	const teamColumns = useMemo<ColumnDef<Team>[]>(() => {
		function editable<T>({
			getValue,
			row: { index },
			column: { id },
			table,
		}: CellContext<Team, unknown>): [
			T,
			ChangeEventHandler<HTMLElement> | undefined,
			FocusEventHandler<HTMLElement> | undefined,
		] {
			const initialValue = getValue() as T;
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
						table.options.meta?.updateData(index, id, value);
						setPreviousValue(value);
					}
				},
			];
		}

		return [
			{
				id: 'group',
				accessorKey: 'group',
				header: 'Group',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<'junior' | 'intermediate'>(prop);
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value}
							onChange={onChange}
							onBlur={onBlur}
						>
							<option value="junior">Junior</option>
							<option value="intermediate">Intermediate</option>
						</select>
					);
				},
			},
			{
				id: 'name',
				accessorKey: 'name',
				header: 'Team Name',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string>(prop);
					return (
						<input
							className="input input-bordered rounded-none w-full"
							value={value}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
			{
				id: 'teacher',
				accessorKey: 'teacher',
				header: 'Default Teacher',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string | undefined>(prop);
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value ?? ''}
							onChange={onChange}
							onBlur={onBlur}
						>
							<option value="">Select a teacher</option>
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
				accessorKey: 'extra_teachers',
				header: 'D Extra Teachers',
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
				id: 'out_of_class',
				accessorKey: 'out_of_class',
				header: 'D Out of Class',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string | undefined>(prop);
					return (
						<input type="time" className="bg-base-100 ml-4" value={value ?? ''} onChange={onChange} onBlur={onBlur} />
					);
				},
			},
			{
				id: 'start',
				accessorKey: 'start',
				header: 'D Start Time',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string | undefined>(prop);
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
								onClick={() => setTeams((teams) => teams.filter((team) => team.id !== original.id))}
							>
								<FaRegTrashCan />
							</button>
						</div>
					);
				},
			},
		];
	}, [teachers]);

	const teamTable = useReactTable({
		columns: teamColumns,
		data: teams,
		getCoreRowModel: getCoreRowModel(),
		meta: {
			updateData: (rowIndex, columnId, value) => {
				setTeams((teams) => {
					teams[rowIndex][columnId as keyof (typeof teams)[number]] = value as any;
					return [...teams];
				});
			},
		},
	});

	const [newGroup, setNewGroup] = useState<'' | 'junior' | 'intermediate'>('');
	const [newTeamName, setNewTeamName] = useState('');
	const [newDefaultTeacher, setNewDefaultTeacher] = useState('');
	const [newDefaultExtraTeachers, setNewDefaultExtraTeachers] = useState<string[]>([]);
	const [newDefaultOutOfClass, setNewDefaultOutOfClass] = useState('');
	const [newDefaultStart, setNewDefaultStart] = useState('');
	// #endregion

	// #region Venues
	const venueColumns = useMemo<ColumnDef<Venue>[]>(() => {
		function editable<T>({
			getValue,
			row: { index },
			column: { id },
			table,
		}: CellContext<Venue, unknown>): [
			T,
			ChangeEventHandler<HTMLElement> | undefined,
			FocusEventHandler<HTMLElement> | undefined,
		] {
			const initialValue = getValue() as T;
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
						table.options.meta?.updateData(index, id, value);
						setPreviousValue(value);
					}
				},
			];
		}

		return [
			{
				id: 'venue',
				accessorKey: 'venue',
				header: 'Venue',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string>(prop);
					return (
						<input
							className={`input input-bordered rounded-none w-full ${
								value === 'Not Found' ? 'bg-error text-error-content' : ''
							}`}
							value={value}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
			{
				id: 'address',
				accessorKey: 'address',
				header: 'Address',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string>(prop);
					return (
						<input
							className={`input input-bordered rounded-none w-full ${
								value === 'Not Found' ? 'bg-error text-error-content' : ''
							}`}
							value={value}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
			{
				id: 'cfNum',
				accessorKey: 'cfNum',
				header: 'Court / Field Number',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string>(prop);
					return (
						<input
							className={`input input-bordered rounded-none w-full ${
								value === 'Not Found' ? 'bg-error text-error-content' : ''
							}`}
							value={value}
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
								onClick={() => setVenues((venues) => venues.filter((venue) => venue.id !== original.id))}
							>
								<FaRegTrashCan />
							</button>
						</div>
					);
				},
			},
		];
	}, []);

	const venuesTable = useReactTable({
		columns: venueColumns,
		data: venues,
		getCoreRowModel: getCoreRowModel(),
		meta: {
			updateData: (rowIndex, columnId, value) => {
				setVenues((venues) => {
					venues[rowIndex][columnId as keyof (typeof venues)[number]] = value as string;
					return [...venues];
				});
			},
		},
	});

	const [newVenue, setNewVenue] = useState('');
	const [newAddress, setNewAddress] = useState('');
	const [newCfNum, setNewCfNum] = useState('');
	// #endregion

	// #region Games
	const gameColumns = useMemo<ColumnDef<Game>[]>(() => {
		function editable<T>({
			getValue,
			row: { original },
			column: { id },
		}: CellContext<Game, unknown>): [
			T,
			ChangeEventHandler<HTMLElement> | undefined,
			FocusEventHandler<HTMLElement> | undefined,
		] {
			const initialValue = getValue() as T;
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
						setGames((games) => {
							// Can not use index because it will be wrong when sorting
							const index = games.findIndex((game) => game.id === original.id);
							games[index][id as keyof Game] = value as any;
							return [...games];
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
					const [value, onChange, onBlur] = editable<string>(prop);
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
							<option value="">Select a team</option>
							{teams.map((team) => (
								<option key={team.id} value={team.id}>
									[{team.group}] {team.name}
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
							placeholder="Optional"
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
							value={value ?? ''}
							onChange={onChange}
							onBlur={onBlur}
						>
							<option value="">Select venue</option>
							{venues.map((venue) => (
								<option key={venue.id} value={venue.id}>
									{venue.venue} ({venue.cfNum})
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
					const defaultTeacher = teams.find((team) => team.id === prop.row.original.team)?.teacher;
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value ?? defaultTeacher ?? ''}
							onChange={onChange}
							onBlur={onBlur}
						>
							<option value="">Select a teacher</option>
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
				accessorKey: 'extra_teachers',
				header: 'Extra Teachers',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string[] | undefined>(prop);
					const defaultExtraTeacher = teams.find((team) => team.id === prop.row.original.team)?.extra_teachers;
					return TeachersMultiSelect({
						teachers,
						value: value ?? defaultExtraTeacher ?? [],
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
							placeholder="Optional"
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
					const [value, onChange, onBlur] = editable<string | undefined>(prop);
					const defaultTime = teams.find((team) => team.id === prop.row.original.team)?.out_of_class;
					return (
						<input
							type="time"
							className="bg-base-100 ml-4"
							value={value ?? defaultTime ?? ''}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
			{
				id: 'start',
				accessorKey: 'start',
				header: 'Start Time',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string | undefined>(prop);
					const defaultTime = teams.find((team) => team.id === prop.row.original.team)?.start;
					return (
						<input
							type="time"
							className="bg-base-100 ml-4"
							value={value ?? defaultTime ?? ''}
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
								onClick={() => setGames((games) => games.filter((venue) => venue.id !== original.id))}
							>
								<FaRegTrashCan />
							</button>
						</div>
					);
				},
			},
		];
	}, [teams, venues, teachers]);

	const gamesTable = useReactTable({
		columns: gameColumns,
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
	const [newGameGroup, setNewGameGroup] = useState<'' | 'junior' | 'intermediate'>('');
	// #endregion

	const [alertState, setAlertState] = useState<AlertType>(null);
	const [loading, setLoading] = useState(false);

	return (
		<>
			<p className="text-xl font-bold mt-4">Create Teams</p>
			<div className="overflow-x-auto w-full">
				<table className="table text-lg">
					<thead>
						{teamTable.getHeaderGroups().map((headerGroup) => (
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
						{teamTable.getRowModel().rows.map((row) => {
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
									value={newGroup}
									onChange={(event) => setNewGroup(event.target.value as any)}
								>
									<option disabled value="">
										Add a Team
									</option>
									<option value="junior">Junior</option>
									<option value="intermediate">Intermediate</option>
								</select>
							</td>
							<td className="p-0">
								<input
									className="input input-bordered rounded-none w-full"
									placeholder="Team Name"
									value={newTeamName}
									onChange={(event) => setNewTeamName(event.target.value)}
								/>
							</td>
							<td className="p-0">
								<select
									className="select select-bordered rounded-none w-full"
									value={newDefaultTeacher}
									onChange={(event) => setNewDefaultTeacher(event.target.value)}
								>
									<option value="">Select a Teacher</option>
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
									value: newDefaultExtraTeachers ?? [],
									onChange: (e) => {
										setNewDefaultExtraTeachers(e.target.value);
									},
								})}
							</td>
							<td className="p-0">
								<input
									type="time"
									className="bg-base-100 ml-4"
									value={newDefaultOutOfClass}
									onChange={(event) => setNewDefaultOutOfClass(event.target.value)}
								/>
							</td>
							<td className="p-0">
								<input
									type="time"
									className="bg-base-100 ml-4"
									value={newDefaultStart}
									onChange={(event) => setNewDefaultStart(event.target.value)}
								/>
							</td>
							<td className="flex justify-end p-0 pt-1">
								<button
									className="btn btn-square"
									disabled={newGroup === '' || newTeamName === ''}
									onClick={() => {
										setTeams((teams) => [
											...teams,
											{
												id: v4(),
												group: (newGroup || undefined) as any,
												name: newTeamName || undefined,
												teacher: newDefaultTeacher || undefined,
												extra_teachers: newDefaultExtraTeachers || undefined,
												out_of_class: newDefaultOutOfClass || undefined,
												start: newDefaultStart || undefined,
											},
										]);
										setNewGroup('');
										setNewTeamName('');
										setNewDefaultTeacher('');
										setNewDefaultExtraTeachers([]);
										setNewDefaultOutOfClass('');
										setNewDefaultStart('');
									}}
								>
									<FaPlus />
								</button>
							</td>
						</tr>
					</tfoot>
				</table>
			</div>

			<p className="text-xl font-bold mt-4">Create Venues</p>
			<div className="overflow-x-auto w-full">
				<table className="table text-lg">
					<thead>
						{venuesTable.getHeaderGroups().map((headerGroup) => (
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
						{venuesTable.getRowModel().rows.map((row) => {
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
									className="input input-bordered rounded-none w-full"
									placeholder="Add a Venue"
									value={newVenue}
									onChange={(event) => setNewVenue(event.target.value)}
								/>
							</td>
							<td className="p-0">
								<input
									className="input input-bordered rounded-none w-full"
									placeholder="Venue Address"
									value={newAddress}
									onChange={(event) => setNewAddress(event.target.value)}
								/>
							</td>
							<td className="p-0">
								<input
									className="input input-bordered rounded-none w-full"
									placeholder="Court / Field Number"
									value={newCfNum}
									onChange={(event) => setNewCfNum(event.target.value)}
								/>
							</td>
							<td className="flex justify-end p-0 pt-1">
								<button
									className="btn btn-square"
									disabled={newVenue === '' || newAddress === ''}
									onClick={() => {
										setVenues((venues) => [
											...venues,
											{
												id: v4(),
												venue: newVenue || undefined,
												address: newAddress || undefined,
												cfNum: newCfNum || undefined,
											},
										]);
										setNewVenue('');
										setNewAddress('');
										setNewCfNum('');
									}}
								>
									<FaPlus />
								</button>
							</td>
						</tr>
					</tfoot>
				</table>
			</div>

			<p className="text-xl font-bold mt-4">Create Games (After creating Teams and Venues)</p>
			<div className="overflow-x-auto w-full">
				<table className="table text-lg">
					<thead>
						{gamesTable.getHeaderGroups().map((headerGroup) => (
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
						{gamesTable.getRowModel().rows.map((row) => {
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
							<td className="p-0" colSpan={5}>
								<input
									type="date"
									className="input input-bordered rounded-none w-full"
									value={newDate}
									onChange={(event) => setNewDate(event.target.value)}
								/>
							</td>
							<td className="p-0" colSpan={5}>
								<select
									className="select select-bordered rounded-none w-full"
									value={newGameGroup}
									onChange={(event) => setNewGameGroup(event.target.value as any)}
								>
									<option disabled value="">
										Select a group
									</option>
									<option value="junior">Junior</option>
									<option value="intermediate">Intermediate</option>
								</select>
							</td>
							<td className="flex justify-end p-0 pt-1">
								<button
									className="btn btn-square"
									disabled={
										newDate === '' ||
										newGameGroup === '' ||
										teams.filter((team) => team.group === newGameGroup).length < 1 ||
										venues.length < 1
									}
									onClick={() => {
										setGames((games) => [
											...games,
											...teams
												.filter((team) => team.group === newGameGroup)
												.map((team) => ({
													id: v4(),
													date: newDate || undefined,
													team: team.id || undefined,
												})),
										]);
										setNewDate('');
										setNewGameGroup('');
									}}
								>
									<FaPlus />
								</button>
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
			<button
				className="btn btn-primary w-full"
				disabled={games.length < 1}
				onClick={(event) => (event.currentTarget.nextElementSibling as HTMLDialogElement).showModal()}
			>
				Finish
			</button>
			<dialog className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Confirmation</h3>
					<p className="py-4">
						You will not be able to modify the data after you import the fixture to the database. Are you sure you want
						to continue? Have you double checked?
					</p>
					{alertState && (alertState.type === 'success' ? SuccessAlert(alertState) : ErrorAlert(alertState))}
					<div className="modal-action">
						<button
							className="btn btn-primary"
							disabled={loading}
							onClick={async (e) => {
								setLoading(true);
								const res = await createWeeklySport(teams, venues, games, dayjs.tz.guess());
								setAlertState(res);
								if (res?.type === 'success') {
									e.preventDefault();
									router.push('/weekly-sport/timetable');
								} else setLoading(false);
							}}
						>
							Import to Database
						</button>
						<form method="dialog">
							<button className="btn" disabled={loading}>
								No
							</button>
						</form>
					</div>
				</div>
			</dialog>
			{changed && <PreventUnload />}
		</>
	);
}
