/* eslint-disable react-hooks/rules-of-hooks */

import { CellContext, ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChangeEventHandler, Dispatch, FocusEventHandler, SetStateAction, useEffect, useMemo, useState } from 'react';

export type Opponents = {
	csenCode: string;
	friendlyName: string;
}[];

const defaultColumn: Partial<ColumnDef<Opponents[number]>> = {
	cell: ({ getValue }) => {
		return <input className="input input-bordered rounded-none w-full" value={getValue() as string} disabled />;
	},
};

export function OpponentsTable({
	opponents,
	setOpponents,
}: {
	opponents: Opponents;
	setOpponents: Dispatch<SetStateAction<Opponents>>;
}) {
	const columns = useMemo<ColumnDef<Opponents[number]>[]>(() => {
		function editable<T>({
			getValue,
			row: { index },
			column: { id },
			table,
		}: CellContext<Opponents[number], unknown>): [
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
				id: 'csenCode',
				accessorKey: 'csenCode',
				header: 'CSEN Code',
			},
			{
				id: 'friendlyName',
				accessorKey: 'friendlyName',
				header: 'Friendly Name',
				cell: (prop) => {
					const [value, onChange, onBlur] = editable<string>(prop);
					return <input className="input input-bordered rounded-none w-full" value={value} onChange={onChange} onBlur={onBlur} />;
				},
			},
		];
	}, []);

	const table = useReactTable({
		columns,
		defaultColumn,
		data: opponents,
		getCoreRowModel: getCoreRowModel(),
		meta: {
			updateData: (rowIndex, columnId, value) => {
				setOpponents((opponents) => {
					opponents[rowIndex][columnId as keyof (typeof opponents)[number]] = value as string;
					return [...opponents];
				});
			},
		},
	});

	return (
		<>
			<p className="text-xl font-bold mt-4">Opponents (Give them a friendly name)</p>
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
