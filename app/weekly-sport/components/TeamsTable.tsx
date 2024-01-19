import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

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

export function TeamsTable() {
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
							className="px-4 w-full"
						/>
					);
				},
			},
			{
				id: 'team',
				header: 'Team',
				cell: ({ row: { index } }) => {
					const name = schoolGames[index].team.name;
					return <input className="input input-bordered rounded-none w-full" defaultValue={name} />;
				},
			},
			{
				id: 'opponent',
				header: 'Opponent',
				cell: ({ row: { index } }) => {
					const opponent = schoolGames[index].opponent;
					return <input className="input input-bordered rounded-none w-full" defaultValue={opponent} />;
				},
			},
			{
				id: 'venue',
				header: 'Venue',
				cell: ({ row: { index } }) => {
					const venue = schoolGames[index].venue.name;
					return <input className="input input-bordered rounded-none w-full" defaultValue={venue} />;
				},
			},
			{
				id: 'teacher',
				header: 'Teacher',
				cell: ({ row: { index } }) => {
					const teacher = schoolGames[index].teacher.name;
					return <input className="input input-bordered rounded-none w-full" defaultValue={teacher} />;
				},
			},
			{
				id: 'transportation',
				header: 'Transportation',
				cell: ({ row: { index } }) => {
					const transportation = schoolGames[index].transportation;
					return <input className="input input-bordered rounded-none w-full" defaultValue={transportation} />;
				},
			},
			{
				id: 'out-of-class',
				header: 'Out of Class',
				cell: ({ row: { index } }) => {
					const time = schoolGames[index].start;
					return <input type="time" defaultValue={`${time.getHours()}:${time.getMinutes()}`} className="ml-4" />;
				},
			},
			{
				id: 'start',
				header: 'Start',
				cell: ({ row: { index } }) => {
					const time = schoolGames[index].start;
					return <input type="time" defaultValue={`${time.getHours()}:${time.getMinutes()}`} className="ml-4" />;
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
	);
}
