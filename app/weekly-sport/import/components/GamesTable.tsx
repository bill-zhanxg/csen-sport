/* eslint-disable react-hooks/rules-of-hooks */

import {
	CellContext,
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { ChangeEventHandler, Dispatch, FocusEventHandler, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Games, Opponents, Teams, Venues } from '../types';

export function GamesTable({
	teams,
	opponents,
	venues,
	games,
	setGames,
	teachers,
}: {
	teams: Teams;
	opponents: Opponents;
	venues: Venues;
	games: Games;
	setGames: Dispatch<SetStateAction<Games>>;
	teachers: { id: string; name?: string | null }[];
}) {
	const columns = useMemo<ColumnDef<Games[number]>[]>(() => {
		function editable<T>({
			getValue,
			row: { index },
			column: { id },
			table,
		}: CellContext<Games[number], unknown>): [
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
				id: 'teamId',
				accessorKey: 'teamId',
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
									[{team.group}] {team.friendlyName}
								</option>
							))}
						</select>
					);
				},
			},
			{
				id: 'opponentCode',
				accessorKey: 'opponentCode',
				header: 'Opponent',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string>(prop);
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value}
							onChange={onChange}
							onBlur={onBlur}
						>
							<option disabled>Select opponent</option>
							{opponents.map((opponent) => (
								<option key={opponent.csenCode} value={opponent.csenCode}>
									{opponent.friendlyName}
								</option>
							))}
						</select>
					);
				},
			},
			{
				id: 'venueCode',
				accessorKey: 'venueCode',
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
								<option key={venue.csenCode} value={venue.csenCode}>
									{venue.venue} ({venue.cfNum}) [{venue.csenCode}]
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
					const defaultTeacher = teams.find((team) => team.id === prop.row.original.teamId)?.teacher;
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={defaultTeacher ?? value ?? ''}
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
					const defaultTime = teams.find((team) => team.id === prop.row.original.teamId)?.out_of_class;
					return (
						<input
							type="time"
							className="bg-base-100 ml-4"
							value={defaultTime ?? value ?? ''}
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
					const defaultTime = teams.find((team) => team.id === prop.row.original.teamId)?.start;
					return (
						<input
							type="time"
							className="bg-base-100 ml-4"
							value={defaultTime ?? value ?? ''}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
		];
	}, [teams, opponents, venues, teachers]);

	const table = useReactTable({
		columns,
		data: games,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		meta: {
			updateData: (rowIndex, columnId, value) => {
				setGames((games) => {
					games[rowIndex][columnId as keyof (typeof games)[number]] = value as any;
					return [...games];
				});
			},
		},
		initialState: {
			sorting: [
				{
					id: 'date',
					desc: false,
				},
			],
		},
	});

	return (
		<>
			<p className="text-xl font-bold mt-4">Games (Modify if needed)</p>
			<div className="overflow-x-auto w-[90%]">
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
											<td className="p-0" key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
}
