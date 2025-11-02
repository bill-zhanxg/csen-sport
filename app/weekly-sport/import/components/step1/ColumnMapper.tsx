import type { DragEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

type Mapping = Record<string, number | null>;

export function ColumnMapper({
	headerRow,
	sampleRows,
	columnsCount,
	mapping,
	onUpdateMapping,
	onBack,
	onImport,
	disabled,
}: {
	headerRow: string[] | null;
	sampleRows: any[][];
	columnsCount: number;
	mapping: Mapping;
	onUpdateMapping: (key: string, value: number | null) => void;
	onBack: () => void;
	onImport: () => void;
	disabled: boolean;
}) {
	const [draggedColumn, setDraggedColumn] = useState<number | null>(null);
	const [dragOverField, setDragOverField] = useState<string | null>(null);

	const fields: {
		key: string;
		label: string;
		description?: string;
		color: string;
		bgColor: string;
		borderColor: string;
	}[] = [
		{
			key: 'date',
			label: 'Date (required)',
			description: 'dd MMM YYYY format (e.g., 15 Nov 2025)',
			color: 'text-slate-700 dark:text-slate-300',
			bgColor: 'bg-slate-50 dark:bg-slate-800/30',
			borderColor: 'border-slate-300 dark:border-slate-600',
		},
		{
			key: 'sport',
			label: 'Sport (required)',
			description: 'Activity name',
			color: 'text-blue-700 dark:text-blue-400',
			bgColor: 'bg-blue-50 dark:bg-blue-900/20',
			borderColor: 'border-blue-300 dark:border-blue-700',
		},
		{
			key: 'ageGender',
			label: 'Age + Gender (required)',
			description: 'Team category',
			color: 'text-emerald-700 dark:text-emerald-400',
			bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
			borderColor: 'border-emerald-300 dark:border-emerald-700',
		},
		{
			key: 'opponent',
			label: 'Opponent',
			color: 'text-violet-700 dark:text-violet-400',
			bgColor: 'bg-violet-50 dark:bg-violet-900/20',
			borderColor: 'border-violet-300 dark:border-violet-700',
		},
		{
			key: 'location',
			label: 'Location',
			color: 'text-orange-700 dark:text-orange-400',
			bgColor: 'bg-orange-50 dark:bg-orange-900/20',
			borderColor: 'border-orange-300 dark:border-orange-700',
		},
		{
			key: 'startTime',
			label: 'Start Time',
			description: '12-hour format (e.g., 1:00 AM)',
			color: 'text-teal-700 dark:text-teal-400',
			bgColor: 'bg-teal-50 dark:bg-teal-900/20',
			borderColor: 'border-teal-300 dark:border-teal-700',
		},
		{
			key: 'endTime',
			label: 'End Time',
			color: 'text-pink-700 dark:text-pink-400',
			bgColor: 'bg-pink-50 dark:bg-pink-900/20',
			borderColor: 'border-pink-300 dark:border-pink-700',
		},
		{
			key: 'position',
			label: 'Position',
			description: 'Home/Away',
			color: 'text-amber-700 dark:text-amber-400',
			bgColor: 'bg-amber-50 dark:bg-amber-900/20',
			borderColor: 'border-amber-300 dark:border-amber-700',
		},
	];

	const handleColumnDragStart = (e: DragEvent<HTMLDivElement>, columnIndex: number) => {
		setDraggedColumn(columnIndex);
		e.dataTransfer.effectAllowed = 'move';
	};

	const handleColumnDragEnd = () => {
		setDraggedColumn(null);
		setDragOverField(null);
	};

	const handleFieldDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	};

	const handleFieldDragEnter = (fieldKey: string) => {
		setDragOverField(fieldKey);
	};

	const handleFieldDragLeave = () => {
		setDragOverField(null);
	};

	const handleFieldDrop = (e: DragEvent<HTMLDivElement>, fieldKey: string) => {
		e.preventDefault();
		if (draggedColumn !== null) {
			onUpdateMapping(fieldKey, draggedColumn);
		}
		setDraggedColumn(null);
		setDragOverField(null);
	};

	const handleClearMapping = (fieldKey: string) => {
		onUpdateMapping(fieldKey, null);
	};

	const getMappedColumn = (fieldKey: string): number | null => {
		return mapping[fieldKey];
	};

	const isColumnMapped = (columnIndex: number): string | null => {
		for (const [fieldKey, mappedColumn] of Object.entries(mapping)) {
			if (mappedColumn === columnIndex) {
				return fieldKey;
			}
		}
		return null;
	};

	const getFieldColors = (fieldKey: string) => {
		return fields.find((f) => f.key === fieldKey) || null;
	};

	return (
		<div className="mt-4 p-4 border border-base-content/30 rounded-lg bg-base-100 shadow-sm w-full overflow-x-auto">
			<h3 className="text-lg font-semibold mb-3">Map Columns to Import Fields</h3>
			<p className="text-sm text-base-content/70 mb-3">
				Drag column headers from the preview table below to the import fields to map them.
				<span className="font-medium">Color coding</span> helps you see which columns are mapped to which fields.
			</p>

			{/* Import Fields Mapping Area */}
			<div className="mb-6 p-4 bg-base-200 rounded-lg">
				<h4 className="font-medium mb-3">Import Fields</h4>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					{fields.map((f) => {
						const mappedColumn = getMappedColumn(f.key);
						const isRequired = f.label.includes('(required)');

						return (
							<div
								key={f.key}
								className={`p-3 border-2 rounded-lg min-h-20 flex flex-col justify-center items-center transition-colors ${
									dragOverField === f.key
										? 'border-primary bg-primary/10 border-dashed'
										: mappedColumn !== null
											? `${f.borderColor} ${f.bgColor} border-solid`
											: isRequired
												? 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-950/20 border-dashed'
												: 'border-base-content/30 bg-base-100 border-dashed'
								}`}
								onDragOver={handleFieldDragOver}
								onDragEnter={() => handleFieldDragEnter(f.key)}
								onDragLeave={handleFieldDragLeave}
								onDrop={(e) => handleFieldDrop(e, f.key)}
							>
								<div
									className={`text-sm font-medium text-center ${
										mappedColumn !== null ? f.color : isRequired ? 'text-red-700 dark:text-red-400' : ''
									}`}
								>
									{f.label}
								</div>
								{f.description && (
									<div
										className={`text-xs text-center mt-1 px-1 ${
											mappedColumn !== null
												? f.color + ' opacity-75'
												: isRequired
													? 'text-red-600 dark:text-red-500'
													: 'text-base-content/60'
										}`}
									>
										{f.description}
									</div>
								)}
								{mappedColumn !== null ? (
									<div className="flex items-center gap-2 mt-2">
										<span
											className={`text-xs px-2 py-1 rounded font-medium ${f.color} ${f.bgColor} border ${f.borderColor}`}
										>
											Column {mappedColumn}: {headerRow?.[mappedColumn] || 'Unnamed'}
										</span>
										<button
											className="btn btn-xs btn-circle btn-ghost"
											onClick={() => handleClearMapping(f.key)}
											title="Clear mapping"
										>
											×
										</button>
									</div>
								) : (
									<div className="text-xs text-base-content/50 text-center mt-1">Drop column here</div>
								)}
							</div>
						);
					})}
				</div>
			</div>

			{/* Excel Preview Table */}
			<div className="mb-4">
				<h4 className="font-medium mb-2">Excel Data Preview</h4>
				<div className="overflow-auto border border-base-content/20 rounded-lg">
					<table className="table table-zebra w-full">
						<thead className="bg-base-200">
							<tr>
								{Array.from({ length: Math.max(columnsCount, headerRow?.length ?? 0) }).map((_, i) => {
									const mappedToField = isColumnMapped(i);
									const fieldColors = mappedToField ? getFieldColors(mappedToField) : null;

									return (
										<th key={i} className="whitespace-nowrap p-2">
											<div
												draggable
												onDragStart={(e) => handleColumnDragStart(e, i)}
												onDragEnd={handleColumnDragEnd}
												className={`cursor-move p-2 rounded transition-colors ${
													draggedColumn === i
														? 'opacity-50'
														: mappedToField && fieldColors
															? `${fieldColors.bgColor} border-2 ${fieldColors.borderColor}`
															: 'hover:bg-base-300'
												}`}
												title={
													mappedToField
														? `Mapped to: ${fields.find((f) => f.key === mappedToField)?.label}`
														: 'Drag to map'
												}
											>
												<div className={`text-xs font-mono ${fieldColors?.color || ''}`}>Col {i}</div>
												<div className={`text-xs font-semibold truncate max-w-24 ${fieldColors?.color || ''}`}>
													{headerRow?.[i] || 'Unnamed'}
												</div>
												{mappedToField && fieldColors && (
													<div className={`text-xs font-medium ${fieldColors.color}`}>
														→ {fields.find((f) => f.key === mappedToField)?.label.split(' (')[0]}
													</div>
												)}
											</div>
										</th>
									);
								})}
							</tr>
						</thead>
						<tbody>
							{sampleRows.slice(0, 10).map((row, rIdx) => (
								<tr key={rIdx}>
									{Array.from({ length: Math.max(columnsCount, row.length) }).map((_, cIdx) => (
										<td key={cIdx} className="text-xs p-2 max-w-32 truncate">
											{row?.[cIdx] !== undefined ? String(row[cIdx]) : ''}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			<div className="flex gap-2 justify-end">
				<button className="btn btn-ghost" onClick={onBack} disabled={disabled}>
					Back
				</button>
				<button
					className="btn btn-primary"
					onClick={() => {
						// Validate required mappings before importing
						const requiredFields = fields.filter((f) => f.label.includes('(required)'));
						const missingRequired = requiredFields.filter((f) => mapping[f.key] === null);

						if (missingRequired.length > 0) {
							const missingNames = missingRequired.map((f) => f.label.split(' (')[0]).join(', ');
							toast.error(`Please map the required fields: ${missingNames}`);
							return;
						}

						onImport();
					}}
					disabled={disabled}
				>
					Import Using Mapping
				</button>
			</div>
		</div>
	);
}
