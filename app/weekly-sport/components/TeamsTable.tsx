import { Signal } from '@preact/signals-react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Teams } from './Step3';

export function TeamsTable(
	{
		schoolCsenCode,
		teams,
		setTeams,
	}: {
		schoolCsenCode: string;
		teams: Teams;
		setTeams: (teams: Teams) => void;
	}
) {
	const columns = useMemo<ColumnDef<Teams[number]>[]>(
		() => [
			{
				id: 'gender',
				header: 'Gender',
				cell: ({ row: { index } }) => {
					const gender = teams[index].gender
					return <input className="input input-bordered rounded-none w-full" defaultValue={gender} disabled />;
				},
			},
			{
				id: 'sport',
				header: 'Sport',
				cell: ({ row: { index } }) => {
					const sport = teams[index].sport
					return <input className="input input-bordered rounded-none w-full" defaultValue={sport} disabled />;
				},
			},
			{
				id: 'division',
				header: 'Division',
				cell: ({ row: { index } }) => {
					const division = teams[index].division
					return <input className="input input-bordered rounded-none w-full" defaultValue={division} disabled />;
				},
			},
			{
				id: 'team',
				header: 'Team',
				cell: ({ row: { index } }) => {
					const team = teams[index].team
					return <input className="input input-bordered rounded-none w-full" defaultValue={team} disabled />;
				},
			},
			{
				id: 'friendlyName',
				header: 'Friendly Name',
				cell: ({ row: { index } }) => {
					const friendlyName = teams[index].friendlyName
					return <input className="input input-bordered rounded-none w-full" defaultValue={friendlyName} />;
				},
			},
			{
				id: 'group',
				header: 'Group',
				cell: ({ row: { index } }) => {
					const group = teams[index].group
					return <input className="input input-bordered rounded-none w-full" defaultValue={group} />;
				},
			},
		],
		[teams],
	);

	const table = useReactTable({ columns, data: teams, getCoreRowModel: getCoreRowModel() });
	return (
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
	);
}
