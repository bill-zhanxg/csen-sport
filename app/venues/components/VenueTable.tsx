'use client';
/* eslint-disable react-hooks/rules-of-hooks */

import { AlertType, ErrorAlertFixed, SuccessAlertFixed } from '@/app/components/Alert';
import { SideBySide } from '@/app/globalComponents/SideBySide';
import { SerializedVenue } from '@/libs/serializeData';
import {
	CellContext,
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { ChangeEventHandler, FocusEventHandler, useEffect, useMemo, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { deleteVenue, newVenue, updateVenue } from '../actions';

const defaultColumn: Partial<ColumnDef<SerializedVenue>> = {
	cell: ({ getValue }) => {
		return <input className="input input-bordered rounded-none w-full" value={getValue() as string} disabled />;
	},
};

export function VenueTable({ teams }: { teams: SerializedVenue[] }) {
	const [alert, setAlert] = useState<AlertType>(null);

	const columns = useMemo<ColumnDef<SerializedVenue>[]>(() => {
		function editable<T>(
			{ getValue, row: { original }, column: { id } }: CellContext<SerializedVenue, unknown>,
			changeOnChange: boolean = false,
		): [T, boolean, ChangeEventHandler<HTMLElement> | undefined, FocusEventHandler<HTMLElement> | undefined] {
			const initialValue = getValue() as T;
			const [value, setValue] = useState(initialValue);
			const [previousValue, setPreviousValue] = useState(value);
			const [disabled, setDisabled] = useState(false);
			useEffect(() => {
				setValue(initialValue);
			}, [initialValue]);
			return [
				value,
				disabled,
				(event) => {
					if (!('value' in event.target)) return;
					const newValue = event.target.value as T;
					setValue(newValue);
					if (changeOnChange) uploadData(newValue);
				},
				(event) => {
					if (!('value' in event.target)) return;
					if (!changeOnChange && previousValue !== value) {
						uploadData();
						setPreviousValue(value);
					}
				},
			];
			function uploadData(newValue?: T) {
				setDisabled(true);

				let importValue = newValue ?? value;

				updateVenue(original.id, { [id]: importValue })
					.then((res) => {
						setAlert(res);
						setDisabled(false);
					})
					.catch(() => {
						setAlert({
							type: 'error',
							message: 'A network error occurred. Please try again later.',
						});
					});
			}
		}

		return [
			{
				id: 'name',
				accessorKey: 'name',
				header: 'Venue Name',
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
			{
				id: 'address',
				accessorKey: 'address',
				header: 'Address',
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
			{
				id: 'court_field_number',
				accessorKey: 'court_field_number',
				header: 'Court Field Number',
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
			{
				id: 'actions',
				header: () => null,
				cell: ({ row: { original } }) => {
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
										Are you sure you want to delete the following venue? This action is irreversible and all games
										linked to this venue will be unlinked.
									</p>
									<SideBySide title="Venue Name:" value={original.name ?? '---'} />
									<SideBySide title="Address:" value={original.address ?? '---'} />
									<SideBySide title="Court / Field Number:" value={original.court_field_number ?? '---'} />
									<div className="modal-action">
										<form method="dialog">
											<button
												className="btn btn-error"
												onClick={(e) => {
													e.preventDefault();
													deleteVenue(original.id)
														.then(setAlert)
														.catch(() => {
															setAlert({
																type: 'error',
																message: 'A network error occurred. Please try again later.',
															});
														});
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
	}, []);

	const table = useReactTable({
		columns,
		defaultColumn,
		data: teams,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		initialState: {
			sorting: [
				{
					id: 'name',
					desc: false,
				},
			],
		},
	});

	const [newName, setNewName] = useState('');
	const [newAddress, setNewAddress] = useState('');
	const [newCfNum, setNewCfNum] = useState('');

	return (
		<>
			<div className="p-6">
				<div className="w-full bg-base-100 rounded-xl border-2 border-base-200 shadow-lg shadow-base-200 p-4">
					<h2 className="text-xl text-center text-primary">Modify or add venue</h2>
					<table className="table table-pin-rows text-lg">
						<thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<th key={header.id} colSpan={header.colSpan}>
												{header.isPlaceholder ? null : (
													<div className="text-lg">
														{flexRender(header.column.columnDef.header, header.getContext())}
													</div>
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
						<tfoot>
							<tr>
								<td className="p-0">
									<input
										className="input input-bordered rounded-none w-full"
										placeholder="Add a Venue"
										value={newName}
										onChange={(event) => setNewName(event.target.value)}
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
										placeholder="Venue Court/Field Number"
										value={newCfNum}
										onChange={(event) => setNewCfNum(event.target.value)}
									/>
								</td>
								<td className="flex justify-end p-0 pt-1">
									<button
										className="btn btn-square"
										disabled={newName === '' || newAddress === '' || newCfNum === ''}
										onClick={(e) => {
											e.preventDefault();
											setNewName('');
											setNewAddress('');
											setNewCfNum('');
											newVenue({ name: newName, address: newAddress, court_field_number: newCfNum })
												.then(setAlert)
												.catch(() => {
													setAlert({
														type: 'error',
														message: 'A network error occurred. Please try again later.',
													});
												});
										}}
									>
										<FaPlus />
									</button>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
			{alert &&
				(alert.type === 'success' ? (
					<SuccessAlertFixed message={alert.message} setAlert={setAlert} />
				) : (
					<ErrorAlertFixed message={alert.message} setAlert={setAlert} />
				))}
		</>
	);
}
