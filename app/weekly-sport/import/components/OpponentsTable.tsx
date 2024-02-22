/* eslint-disable react-hooks/rules-of-hooks */

import { CellContext, ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import {
	ChangeEventHandler,
	Dispatch,
	FocusEventHandler,
	SetStateAction,
	useEffect,
	useMemo,
	useState,
	useTransition,
} from 'react';
import { Opponents } from '../types';

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
		}: CellContext<Opponents[number], unknown>): [
			T,
			boolean,
			ChangeEventHandler<HTMLElement> | undefined,
			FocusEventHandler<HTMLElement> | undefined,
		] {
			const initialValue = getValue() as T;
			const [value, setValue] = useState(initialValue);
			const [previousValue, setPreviousValue] = useState(value);
			useEffect(() => {
				setValue(initialValue);
			}, [initialValue]);
			const [pendingTransition, startTransition] = useTransition();
			return [
				value,
				pendingTransition,
				(event) => {
					if (!('value' in event.target)) return;
					const newValue = event.target.value as T;
					setValue(newValue);
				},
				(event) => {
					if (!('value' in event.target)) return;
					if (previousValue !== value) {
						startTransition(() => {
							setOpponents((opponents) => {
								opponents[index][id as keyof (typeof opponents)[number]] = value as string;
								return [...opponents];
							});
						});
						setPreviousValue(value);
					}
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
					const [value, disabled, onChange, onBlur] = editable<string>(prop);
					return (
						<input
							className="input input-bordered rounded-none w-full"
							value={value}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
		];
	}, [setOpponents]);

	const table = useReactTable({
		columns,
		defaultColumn,
		data: opponents,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<>
			<p className="text-xl font-bold mt-4">Opponents (Give them a friendly name)</p>
			<div className="overflow-x-auto w-[98%]">
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
