/* eslint-disable react-hooks/rules-of-hooks */

import { CellContext, ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChangeEventHandler, Dispatch, FocusEventHandler, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Venues } from '../actions';

const defaultColumn: Partial<ColumnDef<Venues[number]>> = {
	cell: ({ getValue }) => {
		return <input className="input input-bordered rounded-none w-full" value={getValue() as string} disabled />;
	},
};

export function VenuesTable({ venues, setVenues }: { venues: Venues; setVenues: Dispatch<SetStateAction<Venues>> }) {
	const columns = useMemo<ColumnDef<Venues[number]>[]>(() => {
		function editable<T>({
			getValue,
			row: { index },
			column: { id },
			table,
		}: CellContext<Venues[number], unknown>): [
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
		];
	}, []);

	const table = useReactTable({
		columns,
		defaultColumn,
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

	return (
		<>
			<p className="text-xl font-bold mt-4">Venues (Modify if needed)</p>
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
