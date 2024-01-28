'use client';
/* eslint-disable react-hooks/rules-of-hooks */

import { AlertType, ErrorAlertFixed, SuccessAlertFixed } from '@/app/components/Alert';
import { SideBySide } from '@/app/globalComponents/SideBySide';
import { SerializedTeam } from '@/libs/serializeData';
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
import { deleteTeam, newTeam, updateTeam } from '../actions';

const defaultColumn: Partial<ColumnDef<SerializedTeam>> = {
	cell: ({ getValue }) => {
		return <input className="input input-bordered rounded-none w-full" value={getValue() as string} disabled />;
	},
};

export function TeamTable({ teams }: { teams: SerializedTeam[] }) {
	const [alert, setAlert] = useState<AlertType>(null);

	const columns = useMemo<ColumnDef<SerializedTeam>[]>(() => {
		function editable<T>(
			{ getValue, row: { original }, column: { id } }: CellContext<SerializedTeam, unknown>,
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

				updateTeam(original.id, { [id]: importValue })
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
				id: 'isJunior',
				accessorKey: 'isJunior',
				header: 'Group',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<boolean>(prop, true);
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value === undefined ? '' : value ? 'junior' : 'intermediate'}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						>
							<option disabled value="">
								Select a group
							</option>
							<option value="junior">Junior</option>
							<option value="intermediate">Intermediate</option>
						</select>
					);
				},
			},
			{
				id: 'name',
				accessorKey: 'name',
				header: 'Team Name',
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
										Are you sure you want to delete the following team? This action is irreversible and all games linked
										to this team will be unlinked.
									</p>
									<SideBySide
										title="Group:"
										value={original.isJunior ? (original.isJunior ? 'Junior' : 'Intermediate') : '---'}
									/>
									<SideBySide title="Team Name:" value={original.name ?? '---'} />
									<div className="modal-action">
										<form method="dialog">
											<button
												className="btn btn-error"
												onClick={() => {
													deleteTeam(original.id)
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
					id: 'isJunior',
					desc: false,
				},
			],
		},
	});

	const [newGroup, setNewGroup] = useState<'' | 'junior' | 'intermediate'>('');
	const [newName, setNewName] = useState('');

	return (
		<>
			<div className="p-6">
				<div className="w-full bg-base-100 rounded-xl border-2 border-base-200 shadow-lg shadow-base-200 p-4">
					<h2 className="sticky left-0 text-xl text-center text-primary">Modify or add team</h2>
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
									<select
										className="select select-bordered rounded-none w-full"
										value={newGroup}
										onChange={(event) => setNewGroup(event.target.value as '' | 'junior' | 'intermediate')}
									>
										<option disabled value="">
											Add a Team
										</option>
										<option value="junior">Junior</option>
										<option value="intermediate">Intermediate</option>
									</select>
								</td>
								<td className="p-0">
									<input
										className="input input-bordered rounded-none w-full"
										placeholder="Team Name"
										value={newName}
										onChange={(event) => setNewName(event.target.value)}
									/>
								</td>
								<td className="flex justify-end p-0 pt-1">
									<button
										className="btn btn-square"
										disabled={newGroup === '' || newName === ''}
										onClick={() => {
											setNewGroup('');
											setNewName('');
											newTeam({ name: newName, isJunior: newGroup as 'junior' | 'intermediate' })
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
