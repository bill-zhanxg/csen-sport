/* eslint-disable react-hooks/rules-of-hooks */

import { CellContext, ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChangeEventHandler, Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Teams } from './Step3';

const defaultColumn: Partial<ColumnDef<Teams[number]>> = {
	cell: ({ getValue }) => {
		return <input className="input input-bordered rounded-none w-full" value={getValue() as string} disabled />;
	},
};

export function TeamsTable({ teams, setTeams }: { teams: Teams; setTeams: Dispatch<SetStateAction<Teams>> }) {
	const columns = useMemo<ColumnDef<Teams[number]>[]>(() => {
		function editable<T>({
			getValue,
			row: { index },
			column: { id },
			table,
		}: CellContext<Teams[number], unknown>): [T, ChangeEventHandler<HTMLElement> | undefined] {
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
					table.options.meta?.updateData(index, id, newValue);
				},
			];
		}

		return [
			{
				id: 'gender',
				accessorKey: 'gender',
				header: 'Gender',
			},
			{
				id: 'sport',
				accessorKey: 'sport',
				header: 'Sport',
			},
			{
				id: 'division',
				accessorKey: 'division',
				header: 'Division',
			},
			{
				id: 'team',
				accessorKey: 'team',
				header: 'Team',
			},
			{
				id: 'friendlyName',
				accessorKey: 'friendlyName',
				header: 'Friendly Name',
				cell: (prop) => {
					const [value, onChange] = editable<string>(prop);
					return <input className="input input-bordered rounded-none w-full" value={value} onChange={onChange} />;
				},
			},
			{
				id: 'group',
				accessorKey: 'group',
				header: 'Group',
				cell: (prop) => {
					const [value, onChange] = editable<'junior' | 'intermediate'>(prop);
					return (
						<select className="select select-bordered rounded-none w-full" value={value} onChange={onChange}>
							<option value='junior'>Junior</option>
							<option value='intermediate'>Intermediate</option>
						</select>
					);
				},
			},
		];
	}, []);

	const table = useReactTable({
		columns,
		defaultColumn,
		data: teams,
		getCoreRowModel: getCoreRowModel(),
		meta: {
			updateData: (rowIndex, columnId, value) => {
				setTeams((teams) => {
					teams[rowIndex][columnId as keyof (typeof teams)[number]] = value as string;
					console.log(teams);
					return teams;
				});
			},
		},
	});

	return (
		<>
			<p className="text-xl font-bold mt-4">Team names (Modify if needed)</p>
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
