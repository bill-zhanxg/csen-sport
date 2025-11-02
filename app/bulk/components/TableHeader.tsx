import { memo } from 'react';

export const TableHeader = memo(function TableHeader() {
	return (
		<thead className="sticky top-0 z-20 bg-base-100">
			<tr>
				<th className="text-lg">Date</th>
				<th className="text-lg">Team</th>
				<th className="text-lg">Position</th>
				<th className="text-lg">Opponent</th>
				<th className="text-lg">Venue</th>
				<th className="text-lg">Teacher</th>
				<th className="text-lg">Extra Teachers</th>
				<th className="text-lg">Transportation</th>
				<th className="text-lg">Notes</th>
				<th className="text-lg">Confirmed</th>
				<th className="text-lg">Out of Class</th>
				<th className="text-lg">Start Time</th>
				<th></th>
			</tr>
		</thead>
	);
});
