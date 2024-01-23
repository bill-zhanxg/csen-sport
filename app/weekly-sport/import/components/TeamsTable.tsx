/* eslint-disable react-hooks/rules-of-hooks */

import { CellContext, ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChangeEventHandler, Dispatch, FocusEventHandler, SetStateAction, useEffect, useMemo, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Teams } from './types';

const defaultColumn: Partial<ColumnDef<Teams[number]>> = {
	cell: ({ getValue }) => {
		return <input className="input input-bordered rounded-none w-full" value={getValue() as string} disabled />;
	},
};

export function TeamsTable({
	teams,
	setTeams,
	teachers,
}: {
	teams: Teams;
	setTeams: Dispatch<SetStateAction<Teams>>;
	teachers: { id: string; name?: string | null }[];
}) {
	const columns = useMemo<ColumnDef<Teams[number]>[]>(() => {
		function editable<T>({
			getValue,
			row: { index },
			column: { id },
			table,
		}: CellContext<Teams[number], unknown>): [
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
		];
	}, [teachers]);

	const table = useReactTable({
		columns,
		defaultColumn,
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
						<tr>
							<td />
							<td />
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
