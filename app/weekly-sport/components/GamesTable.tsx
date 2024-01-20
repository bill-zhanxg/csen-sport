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
import { FaPlus } from 'react-icons/fa';
import { Opponents } from './OpponentsTable';
import { Venues } from './Step2';
import { Teams } from './TeamsTable';

export type Games = {
	date: Date;
	team: {
		id: string;
		gender: string;
		sport: string;
		division: string;
		code: string;
		group: 'junior' | 'intermediate';
	};
	opponentCode: string;
	venueCode: string;
	teacher?: string;
	transportation?: string;
	out_of_class?: Date;
	start?: Date;
	notes?: string;
}[];

const defaultColumn: Partial<ColumnDef<Games[number]>> = {
	cell: ({ getValue }) => {
		return <input className="input input-bordered rounded-none w-full" value={getValue() as string} disabled />;
	},
};

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
					table.options.meta?.updateData(index, id, value);
				},
			];
		}

		return [
			{
				id: 'date',
				accessorKey: 'date',
				header: 'Date',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<Date>(prop);
					return (
						<input
							type="date"
							className="bg-base-100 px-4 w-full"
							value={`${value.getFullYear()}-${('0' + (value.getMonth() + 1)).slice(-2)}-${(
								'0' + value.getDate()
							).slice(-2)}`}
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
					const [value, onChange, onBlur] = editable<string>({
						...prop,
						getValue: () => (prop.getValue() as Games[number]['team']).id as any,
					});
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
									{team.friendlyName}
								</option>
							))}
						</select>
					);
				},
			},
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
			// {
			// 	id: 'teachers',
			// 	accessorKey: 'teacher',
			// 	header: 'Default Teacher',
			// 	cell: (prop) => {
			// 		const [value, onChange] = editable<string | undefined>(prop);
			// 		return (
			// 			<select className="select select-bordered rounded-none w-full" value={value ?? ''} onChange={onChange}>
			// 				<option value={''} disabled>
			// 					Select a teacher
			// 				</option>
			// 				{teachers.map((teacher) => (
			// 					<option key={teacher.id} value={teacher.id}>
			// 						{teacher.name}
			// 					</option>
			// 				))}
			// 			</select>
			// 		);
			// 	},
			// },
		];
	}, [teams]);

	const table = useReactTable({
		columns,
		defaultColumn,
		data: games,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		meta: {
			updateData: (rowIndex, columnId, value) => {
				setGames((games) => {
					// TODO check timezones
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
						<tr>
							<td />
							<td />
							<td />
							<td />
							<td />
							<td />
							<td className="flex justify-end p-0 pt-1">
								<button className="btn btn-square" disabled>
									<FaPlus />
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</>
	);
}
