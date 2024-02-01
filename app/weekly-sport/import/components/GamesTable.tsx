/* eslint-disable react-hooks/rules-of-hooks */

import { SideBySide } from '@/app/globalComponents/SideBySide';
import {
	CellContext,
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { ChangeEventHandler, Dispatch, FocusEventHandler, SetStateAction, useEffect, useMemo, useState } from 'react';
import { FaRegTrashCan } from 'react-icons/fa6';
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
			row: { original },
			column: { id },
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
						setGames((games) => {
							// Can not use index because it will be wrong when sorting
							const index = games.findIndex((game) => game.id === original.id);
							games[index][id as keyof Games[number]] = value as any;
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
							<option value="">Select a team</option>
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
							<option value="">Select opponent</option>
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
							<option value="">Select a venue</option>
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
			{
				id: 'actions',
				header: () => null,
				cell: ({ row: { original } }) => {
					const team = teams.find((team) => team.id === original.teamId);
					const opponent = opponents.find((opponent) => opponent.csenCode === original.opponentCode);
					const venue = venues.find((venue) => venue.csenCode === original.venueCode);
					const teacher = teachers.find((teacher) => teacher.id === original.teacher);

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
										Are you sure you want to delete the following game? This action is irreversible and requires restart
										of the import process if accidental removal.
									</p>
									<SideBySide title="Date:" value={original.date} />
									<SideBySide title="Team Group:" value={team?.group ?? '---'} />
									<SideBySide title="Team Friendly Name:" value={team?.friendlyName ?? '---'} />
									<SideBySide title="Opponent:" value={opponent?.friendlyName ?? '---'} />
									<SideBySide title="Venue:" value={venue ? `${venue.venue} (${venue.cfNum})` : '---'} />
									<SideBySide title="Teacher:" value={teacher?.name ?? '---'} />
									<SideBySide title="Transportation:" value={original.transportation ?? '---'} />
									<SideBySide title="Notes:" value={original.notes ?? '---'} />
									<SideBySide title="Out of Class:" value={original.out_of_class ?? '---'} />
									<SideBySide title="Start Time:" value={original.start ?? '---'} />
									<div className="modal-action">
										<form method="dialog">
											<button
												className="btn btn-error"
												onClick={() => {
													setGames((games) => games.filter((game) => game.id !== original.id));
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
	}, [teams, opponents, venues, teachers, setGames]);

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
											<td className="p-0 last:w-16" key={cell.id}>
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
