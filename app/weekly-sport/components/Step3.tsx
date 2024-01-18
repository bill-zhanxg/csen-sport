import { Signal } from '@preact/signals-react';
import { ColumnDef, RowData, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useRef, useState } from 'react';
import { FIxturePages } from './Step1';
import { Venues } from './Step2';

declare module '@tanstack/react-table' {
	interface TableMeta<TData extends RowData> {
		updateData: (rowIndex: number, columnId: string, value: unknown) => void;
	}
}

type Games = {
	date: Date;
	notes: string;
	opponent: string;
	start: Date;
	team: {
		name: string;
		isJunior: boolean;
	};
	teacher: {
		name: string;
	};
	transportation: string;
	venue: {
		name: string;
		address: string;
		court_field_number: string;
	};
};

export function Step3({
	setNextLoading,
	setDisableNext,
	setAlert,
	fixtures,
	venues,
}: {
	setNextLoading: (nextLoading: boolean) => void;
	setDisableNext: (disableNext: boolean) => void;
	setAlert: (alert: { type: 'success' | 'error'; message: string } | null) => void;
	fixtures: Signal<FIxturePages>;
	venues: Signal<Venues>;
}) {
	const schoolCsenCodeRef = useRef<HTMLInputElement>(null);
	const [schoolGames, setSchoolGame] = useState<Games[]>([
		{
			date: new Date(),
			notes: '',
			opponent: 'opponent',
			start: new Date(),
			team: {
				name: 'team',
				isJunior: false,
			},
			teacher: {
				name: 'teacher',
			},
			transportation: 'transportation',
			venue: {
				name: 'venue',
				address: 'address',
				court_field_number: 'court_field_number',
			},
		},
	]);
	const columns = useMemo<ColumnDef<Games>[]>(
		() => [
			{
				id: 'date',
				header: 'Date',
				cell: ({ row: { index } }) => {
					const date = schoolGames[index].date;
					return (
						<input
							type="date"
							defaultValue={`${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${(
								'0' + date.getDate()
							).slice(-2)}`}
						/>
					);
				},
			},
			{
				id: 'team',
				header: 'Team',
				cell: ({ row: { index } }) => {
					const name = schoolGames[index].team.name;
					return <input className="input input-bordered rounded-none" defaultValue={name} />;
				},
			},
			{
				id: 'opponent',
				header: 'Opponent',
				cell: ({ row: { index } }) => {
					return schoolGames[index].opponent;
				},
			},
			{
				id: 'venue',
				header: 'Venue',
				cell: ({ row: { index } }) => {
					return schoolGames[index].venue.name;
				},
			},
			{
				id: 'teacher',
				header: 'Teacher',
				cell: ({ row: { index } }) => {
					return schoolGames[index].teacher.name;
				},
			},
			{
				id: 'transportation',
				header: 'Transportation',
				cell: ({ row: { index } }) => {
					return schoolGames[index].transportation;
				},
			},
			{
				id: 'out-of-class',
				header: 'Out of Class',
				cell: ({ row: { index } }) => {
                    const time = schoolGames[index].start;
					return <input type="time" className='ml-4' />
				},
			},
			{
				id: 'start',
				header: 'Start',
				cell: ({ row: { index } }) => {
					return schoolGames[index].start.toLocaleTimeString();
				},
			},
		],
		[schoolGames],
	);

	// Give our default column cell renderer editing superpowers!
	// const defaultColumn: Partial<ColumnDef<Games>> = {
	// 	cell: ({ getValue, row: { index }, column: { id }, table }) => {
	// 		const initialValue = getValue();
	// 		// We need to keep and update the state of the cell normally
	// 		const [value, setValue] = useState(initialValue);

	// 		// When the input is blurred, we'll call our table meta's updateData function
	// 		const onBlur = () => {
	// 			table.options.meta?.updateData(index, id, value);
	// 		};

	// 		// If the initialValue is changed external, sync it up with our state
	// 		useEffect(() => {
	// 			setValue(initialValue);
	// 		}, [initialValue]);

	// 		return <input value={value as string} onChange={(e) => setValue(e.target.value)} onBlur={onBlur} />;
	// 	},
	// };

	const table = useReactTable({ columns, data: schoolGames, getCoreRowModel: getCoreRowModel() });

	return (
		<>
			<p className="text-xl font-bold text-error text-center max-w-2xl">DO NOT EXIT THIS PAGE, CHANGES WILL BE LOST</p>
			<div className="flex gap-2 w-full max-w-xl">
				<input
					type="text"
					placeholder="Enter your school CSEN code"
					className="input input-bordered w-full"
					ref={schoolCsenCodeRef}
				/>
				<button className="btn btn-accent" onClick={() => {}}>
					Filter
				</button>
			</div>
			<div className="overflow-x-auto w-[90%]">
				<table className="table text-xl">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<th key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder ? null : (
												<div className=" text-2xl">
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
		</>
	);
}
