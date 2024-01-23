/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { SerializedGame } from '@/libs/serializeData';
import { CellContext, ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { ChangeEventHandler, FocusEventHandler, useEffect, useMemo, useState } from 'react';
import { RawTeacher, RawTeam, RawVenue } from '../../libs/tableData';
import { AlertType, ErrorAlert, SuccessAlert } from '../components/Alert';
import { updateGame } from './weeklySportTeacherActions';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

const defaultColumn: Partial<ColumnDef<SerializedGame>> = {
	cell: ({ getValue }) => {
		return <input className="input input-bordered rounded-none w-full" value={getValue() as string} disabled />;
	},
};

export function WeeklySportTeacher({
	date,
	teams,
	teachers,
	venues,
}: {
	date: {
		date: string;
		games: SerializedGame[];
	};
	teams: RawTeam[];
	teachers: RawTeacher[];
	venues: RawVenue[];
}) {
	const [alert, setAlert] = useState<AlertType>(null);

	const columns = useMemo<ColumnDef<SerializedGame>[]>(() => {
		function editable<T>(
			{ getValue, row: { original }, column: { id } }: CellContext<SerializedGame, unknown>,
			changeOnChange: boolean = false,
			isTime: boolean = false,
		): [T, boolean, ChangeEventHandler<HTMLElement> | undefined, FocusEventHandler<HTMLElement> | undefined] {
			let initialValue = getValue() as T;
			if (isTime) initialValue = initialValue ? dayjs(initialValue as any).format('HH:mm') as unknown as T : initialValue;
			const [value, setValue] = useState(initialValue);
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
					if (!changeOnChange) uploadData();
				},
			];
			function uploadData(newValue?: T) {
				setDisabled(true);

				let importValue = newValue ?? value;

				if (isTime) {
					const timezone = dayjs.tz.guess();
					let time: Date | undefined = undefined;
					const time_string = (importValue as string)?.split(':') ?? undefined;
					if (time_string)
						time = dayjs
							.tz(
								`${dayjs.tz(original.date, timezone).format('YYYY-MM-DD')} ${time_string[0]}:${time_string[1]}`,
								timezone,
							)
							.toDate();
					importValue = time as any;
				}

				updateGame(original.id, { [id]: importValue })
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
				id: 'team',
				accessorFn: (row) => row.team?.id,
				header: 'Team',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop, true);
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value ?? ''}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						>
							<option disabled value="">
								---
							</option>
							{teams.map((team) => (
								<option key={team.id} value={team.id}>
									[{team.isJunior ? 'Junior' : 'Intermediate'}] {team.name}
								</option>
							))}
						</select>
					);
				},
			},
			{
				id: 'opponent',
				accessorKey: 'opponent',
				header: 'Opponent',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop);
					return (
						<input
							className="input input-bordered rounded-none w-full"
							value={value ?? ''}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
			{
				id: 'venue',
				accessorFn: (row) => row.venue?.id,
				header: 'Venue',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop, true);
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value ?? ''}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						>
							<option disabled value="">
								---
							</option>
							{venues.map((venue) => (
								<option key={venue.id} value={venue.id}>
									{venue.name} ({venue.court_field_number})
								</option>
							))}
						</select>
					);
				},
			},
			{
				id: 'teacher',
				accessorFn: (row) => row.teacher?.id,
				header: 'Teacher',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop, true);
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value ?? ''}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						>
							<option disabled value="">
								---
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
				id: 'transportation',
				accessorKey: 'transportation',
				header: 'Transportation',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop);
					return (
						<input
							className="input input-bordered rounded-none w-full"
							value={value ?? ''}
							disabled={disabled}
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
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop);
					return (
						<input
							className="input input-bordered rounded-none w-full"
							value={value ?? ''}
							disabled={disabled}
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
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop, false, true);
					return (
						<input
							type="time"
							className="bg-base-100 ml-4"
							value={value ?? ''}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
			{
				id: 'start',
				accessorKey: 'start',
				header: 'Start',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop, false, true);
					return (
						<input
							type="time"
							className="bg-base-100 ml-4"
							value={value ?? ''}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
		];
	}, [teams, venues, teachers]);

	const table = useReactTable({
		columns,
		defaultColumn,
		data: date.games,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<>
			<div className="w-full bg-base-100 rounded-xl border-2 border-base-200 shadow-lg shadow-base-200 p-4">
				<h2 className="text-xl text-center text-primary">Weekly Sport {date.date}</h2>
				<div className="overflow-x-auto">
					<table className="table text-lg">
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
			</div>
			{alert &&
				(alert.type === 'success' ? (
					<SuccessAlert message={alert.message} setAlert={setAlert} />
				) : (
					<ErrorAlert message={alert.message} setAlert={setAlert} />
				))}
		</>
	);
}
