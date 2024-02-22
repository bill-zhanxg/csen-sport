/* eslint-disable react-hooks/rules-of-hooks */

import { TeachersMultiSelect } from '@/app/globalComponents/TeachersMultiSelect';
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
import { FaPlus } from 'react-icons/fa';
import { v4 } from 'uuid';
import { Defaults, Games, Teams } from '../types';

const defaultColumn: Partial<ColumnDef<Teams[number]>> = {
	cell: ({ getValue }) => {
		return <input className="input input-bordered rounded-none w-full" value={getValue() as string} disabled />;
	},
};

export function TeamsTable({
	teams,
	setTeams,
	setGames,
	teachers,
	defaults,
}: {
	teams: Teams;
	setTeams: Dispatch<SetStateAction<Teams>>;
	setGames: Dispatch<SetStateAction<Games>>;
	teachers: { id: string; name?: string | null }[];
	defaults: Defaults;
}) {
	const columns = useMemo<ColumnDef<Teams[number]>[]>(() => {
		function editable<T>({
			getValue,
			row: { index },
			column: { id },
		}: CellContext<Teams[number], unknown>): [
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
					const value = event.target.value as T;
					if (previousValue !== value) {
						startTransition(() => {
							setTeams((teams) => {
								teams[index][id as keyof (typeof teams)[number]] = value as any;
								return [...teams];
							});
						});
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
				id: 'group',
				accessorKey: 'group',
				header: 'Group',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<'junior' | 'intermediate'>(prop);
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value}
							disabled={disabled}
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
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop);
					return (
						<select
							className="select select-bordered rounded-none w-full"
							value={value ?? defaults.default_teacher ?? ''}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						>
							<option value="">Select a teacher</option>
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
				id: 'extra_teachers',
				accessorKey: 'extra_teachers',
				header: 'D Extra Teachers',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string[] | undefined>(prop);
					return TeachersMultiSelect({
						teachers,
						value: value ?? defaults.default_extra_teachers ?? [],
						disabled,
						onChange: (e) => {
							if (onChange) onChange(e as any);
							if (onBlur) onBlur(e as any);
						},
					});
				},
			},
			{
				id: 'out_of_class',
				accessorKey: 'out_of_class',
				header: 'D Out of Class',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop);
					return (
						<input
							type="time"
							className={`bg-base-100 ml-4${disabled ? ' bg-base-200' : ''}`}
							value={value ?? defaults.default_out_of_class ?? ''}
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
				header: 'D Start Time',
				cell: (prop) => {
					const [value, disabled, onChange, onBlur] = editable<string | undefined>(prop);
					return (
						<input
							type="time"
							className={`bg-base-100 ml-4${disabled ? ' bg-base-200' : ''}`}
							value={value ?? defaults.default_start ?? ''}
							disabled={disabled}
							onChange={onChange}
							onBlur={onBlur}
						/>
					);
				},
			},
		];
	}, [teachers, defaults, setTeams]);

	const table = useReactTable({
		columns,
		defaultColumn,
		data: teams,
		getCoreRowModel: getCoreRowModel(),
	});

	const [newGroup, setNewGroup] = useState<'' | 'junior' | 'intermediate'>('');
	const [newName, setNewName] = useState('');

	const [pendingTransition, startTransition] = useTransition();

	return (
		<>
			<p className="text-xl font-bold mt-4">Teams (Modify if needed)</p>
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
					<tfoot>
						<tr>
							<td className="p-0" colSpan={4}>
								<select
									className="select select-bordered rounded-none w-full"
									value={newGroup}
									disabled={pendingTransition}
									onChange={(event) => setNewGroup(event.target.value as '' | 'junior' | 'intermediate')}
								>
									<option disabled value="">
										Add a Team
									</option>
									<option value="junior">Junior</option>
									<option value="intermediate">Intermediate</option>
								</select>
							</td>
							<td className="p-0" colSpan={5}>
								<input
									className="input input-bordered rounded-none w-full"
									placeholder="Team Name"
									value={newName}
									disabled={pendingTransition}
									onChange={(event) => setNewName(event.target.value)}
								/>
							</td>
							<td className="flex justify-end p-0 pt-1">
								<button
									className="btn btn-square"
									disabled={newGroup === '' || newName === ''}
									onClick={() => {
										const id = v4();
										startTransition(() => {
											setTeams((teams) => {
												return [
													...teams,
													{
														id: id,
														friendlyName: newName,
														group: newGroup || 'junior',
													},
												];
											});
											// I know react state doesn't update immediately, but I need the id, so I'll just gonna hope it works (and it did)
											setGames((games) => {
												const allDates = games
													.filter(({ teamId }) => {
														const team = teams.find((team) => team.id === teamId);
														return team?.group === newGroup;
													})
													.map((game) => game.date);
												// Remove duplicates
												const dates = allDates.filter((date, index) => allDates.indexOf(date) === index);

												return [
													...games,
													...dates.map((date) => ({
														date,
														id: v4(),
														teamId: id,
														opponentCode: '',
														venueCode: '',
													})),
												];
											});
										});
										setNewGroup('');
										setNewName('');
									}}
								>
									<FaPlus />
								</button>
							</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</>
	);
}
