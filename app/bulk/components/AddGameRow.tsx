import { memo, useState } from 'react';

import { TeachersMultiSelect } from '@/app/globalComponents/TeachersMultiSelect';
import { formatDate, formatIsJunior, formatTime } from '@/libs/formatValue';

import type { RawTeacher, RawTeam } from '@/libs/tableData';

interface AddGameRowProps {
	teams: RawTeam[];
	teachers: RawTeacher[];
	onAdd: (game: any) => void;
}

export const AddGameRow = memo(function AddGameRow({ teams, teachers, onAdd }: AddGameRowProps) {
	const [newDate, setNewDate] = useState('');
	const [newTeam, setNewTeam] = useState('');
	const [newPosition, setNewPosition] = useState<'' | 'home' | 'away'>('');
	const [newOpponent, setNewOpponent] = useState('');
	const [newVenue, setNewVenue] = useState('');
	const [newTeacher, setNewTeacher] = useState('');
	const [newExtraTeachers, setNewExtraTeachers] = useState<string[]>([]);
	const [newTransportation, setNewTransportation] = useState('');
	const [newNotes, setNewNotes] = useState('');
	const [newConfirmed, setNewConfirmed] = useState(false);
	const [newOutOfClass, setNewOutOfClass] = useState('');
	const [newStart, setNewStart] = useState('');

	const handleAdd = () => {
		if (!newDate || !newTeam || !newOpponent) return;

		const date = formatDate(newDate);
		const game = {
			date,
			team: newTeam || undefined,
			isHome: newPosition ? newPosition === 'home' : undefined,
			opponent: newOpponent || undefined,
			venue: newVenue || undefined,
			teacher: newTeacher || undefined,
			extra_teachers: newExtraTeachers || undefined,
			transportation: newTransportation || undefined,
			notes: newNotes || undefined,
			confirmed: newConfirmed,
			out_of_class: formatTime(date, newOutOfClass),
			start: formatTime(date, newStart),
		};

		onAdd(game);

		// Reset form
		setNewDate('');
		setNewTeam('');
		setNewPosition('');
		setNewOpponent('');
		setNewVenue('');
		setNewTeacher('');
		setNewExtraTeachers([]);
		setNewTransportation('');
		setNewNotes('');
		setNewConfirmed(false);
		setNewOutOfClass('');
		setNewStart('');
	};

	return (
		<tfoot className="text-[95%]">
			<tr>
				<td className="p-0">
					<input
						type="date"
						className="bg-base-100 px-4 w-full"
						value={newDate}
						onChange={(e) => setNewDate(e.target.value)}
					/>
				</td>
				<td className="p-0">
					<select className="select select-bordered rounded-none w-full" value={newTeam} onChange={(e) => setNewTeam(e.target.value)}>
						<option disabled value="">
							Add a Game
						</option>
						{teams.map((team) => (
							<option key={team.id} value={team.id}>
								[{formatIsJunior(team.isJunior)}] {team.name}
							</option>
						))}
					</select>
				</td>
				<td className="p-0">
					<select
						className="select select-bordered rounded-none w-full"
						value={newPosition}
						onChange={(e) => setNewPosition(e.target.value as '' | 'home' | 'away')}
					>
						<option value="">Position</option>
						<option value="home">Home</option>
						<option value="away">Away</option>
					</select>
				</td>
				<td className="p-0">
					<input
						className="input input-bordered rounded-none w-full"
						placeholder="Opponent"
						value={newOpponent}
						onChange={(e) => setNewOpponent(e.target.value)}
					/>
				</td>
				<td className="p-0">
					<input
						className="input input-bordered rounded-none w-full"
						placeholder="Venue"
						value={newVenue}
						onChange={(e) => setNewVenue(e.target.value)}
					/>
				</td>
				<td className="p-0">
					<select className="select select-bordered rounded-none w-full" value={newTeacher} onChange={(e) => setNewTeacher(e.target.value)}>
						<option value="">Teacher</option>
						{teachers.map((t) => (
							<option key={t.id} value={t.id}>
								{t.name}
							</option>
						))}
					</select>
				</td>
				<td className="p-0">
					<TeachersMultiSelect teachers={teachers} value={newExtraTeachers} onChange={(e) => setNewExtraTeachers(e.target.value)} />
				</td>
				<td className="p-0">
					<input
						className="input input-bordered rounded-none w-full"
						placeholder="Transportation"
						value={newTransportation}
						onChange={(e) => setNewTransportation(e.target.value)}
					/>
				</td>
				<td className="p-0">
					<input
						className="input input-bordered rounded-none w-full"
						placeholder="Notes"
						value={newNotes}
						onChange={(e) => setNewNotes(e.target.value)}
					/>
				</td>
				<td className="p-0">
					<div className="flex justify-center w-full">
						<input
							type="checkbox"
							className="checkbox checkbox-primary"
							checked={newConfirmed}
							onChange={(e) => setNewConfirmed(e.target.checked)}
						/>
					</div>
				</td>
				<td className="p-0">
					<input type="time" className="bg-base-100 ml-4" value={newOutOfClass} onChange={(e) => setNewOutOfClass(e.target.value)} />
				</td>
				<td className="p-0">
					<input type="time" className="bg-base-100 ml-4" value={newStart} onChange={(e) => setNewStart(e.target.value)} />
				</td>
				<td className="flex justify-end p-0 pt-1">
					<button className="btn btn-square" disabled={!newDate || !newTeam || !newOpponent} onClick={handleAdd}>
						<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
						</svg>
					</button>
				</td>
			</tr>
		</tfoot>
	);
});
