'use client';
/* eslint-disable react-hooks/rules-of-hooks */

import { RawTeacher } from '@/libs/tableData';
import { CellContext, ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChangeEventHandler, FocusEventHandler, useEffect, useMemo, useState } from 'react';
import { FaPlus, FaRegTrashCan } from 'react-icons/fa6';
import { v4 } from 'uuid';

type Team = {
	id: string;
	group?: 'junior' | 'intermediate';
	name?: string;
	teacher?: string;
	out_of_class?: string;
	start?: string;
};

type Venue = {
	id: string;
	venue?: string;
	address?: string;
	cfNum?: string;
};

export function Tables({ teachers }: { teachers: RawTeacher[] }) {
	const [teams, setTeams] = useState<Team[]>([]);
	const [venues, setVenues] = useState<Venue[]>([]);

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
											<td className="p-0" key={cell.id}>
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
												group: newGroup || undefined,
												name: newTeamName || undefined,
												teacher: newDefaultTeacher || undefined,
												out_of_class: newDefaultOutOfClass || undefined,
												start: newDefaultStart || undefined,
											},
										]);
										setNewGroup('');
										setNewTeamName('');
										setNewDefaultTeacher('');
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
											<td className="p-0" key={cell.id}>
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
		</>
	);
}
