export function SheetSelector({
	availableSheets,
	selectedSheet,
	onChange,
	onCancel,
	onConfirm,
	disabled,
}: {
	availableSheets: string[];
	selectedSheet: string;
	onChange: (value: string) => void;
	onCancel: () => void;
	onConfirm: () => void;
	disabled: boolean;
}) {
	return (
		<div className="mt-4 p-4 border border-base-content/30 rounded-lg bg-base-100 shadow-sm max-w-xl w-full">
			<h3 className="text-lg font-semibold mb-3">Select Sheet to Import</h3>
			<p className="text-sm text-base-content/70 mb-3">
				Multiple sheets found in the Excel file. Please select which sheet contains the fixtures data:
			</p>
			<div className="form-control mb-4">
				<select
					className="select select-bordered w-full"
					value={selectedSheet}
					onChange={(e) => onChange(e.target.value)}
				>
					{availableSheets.map((sheetName) => (
						<option key={sheetName} value={sheetName}>
							{sheetName}
						</option>
					))}
				</select>
			</div>
			<div className="flex gap-2 justify-end">
				<button className="btn btn-ghost" onClick={onCancel} disabled={disabled}>
					Cancel
				</button>
				<button className="btn btn-primary" onClick={onConfirm} disabled={disabled || !selectedSheet}>
					Import Selected Sheet
				</button>
			</div>
		</div>
	);
}
