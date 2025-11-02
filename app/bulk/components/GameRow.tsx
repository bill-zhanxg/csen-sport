import { memo, startTransition, useCallback, useRef, useState } from 'react';

import { TeachersMultiSelect } from '@/app/globalComponents/TeachersMultiSelect';
import { dayjs } from '@/libs/dayjs';
import { formatDate, formatIsJunior, formatTime } from '@/libs/formatValue';

import type { SerializedGameWithId } from '@/libs/serializeData';
import type { RawTeacher, RawTeam } from '@/libs/tableData';

interface GameRowProps {
	game: SerializedGameWithId;
	teams: RawTeam[];
	teachers: RawTeacher[];
	onUpdate: (id: string, field: string, value: any) => void;
	onDelete: (id: string) => void;
}

export const GameRow = memo(function GameRow({ game, teams, teachers, onUpdate, onDelete }: GameRowProps) {
	// Refs for uncontrolled inputs
	const dateRef = useRef<HTMLInputElement>(null);
	const teamRef = useRef<HTMLSelectElement>(null);
	const isHomeRef = useRef<HTMLSelectElement>(null);
	const opponentRef = useRef<HTMLInputElement>(null);
	const venueRef = useRef<HTMLInputElement>(null);
	const teacherRef = useRef<HTMLSelectElement>(null);
	const transportationRef = useRef<HTMLInputElement>(null);
	const notesRef = useRef<HTMLInputElement>(null);
	const confirmedRef = useRef<HTMLInputElement>(null);
	const outOfClassRef = useRef<HTMLInputElement>(null);
	const startRef = useRef<HTMLInputElement>(null);

	// Only keep state for the multi-select component which requires controlled state
	const [extraTeachers, setExtraTeachers] = useState(game.extra_teachers ?? []);

	// Update parent when values change (non-blocking)
	const commitUpdate = useCallback(
		(field: string, value: any) => {
			startTransition(() => {
				onUpdate(game.id, field, value);
			});
		},
		[game.id, onUpdate],
	);

	return (
		<tr>
			<td className="p-0">
				<input
					ref={dateRef}
					type="date"
					className="bg-base-100 px-4 w-full"
					defaultValue={game.date ? dayjs(game.date).format('YYYY-MM-DD') : ''}
					onBlur={(e) => commitUpdate('date', formatDate(e.target.value))}
				/>
			</td>
			<td className="p-0">
				<select
					ref={teamRef}
					className="select select-bordered rounded-none w-full"
					defaultValue={game.team}
					onBlur={(e) => commitUpdate('team', e.target.value)}
				>
					<option disabled>Select a team</option>
					{teams.map((t) => (
						<option key={t.id} value={t.id}>
							[{formatIsJunior(t.isJunior)}] {t.name}
						</option>
					))}
				</select>
			</td>
			<td className="p-0">
				<select
					ref={isHomeRef}
					className="select select-bordered rounded-none w-full"
					defaultValue={game.isHome === undefined || game.isHome === null ? '' : game.isHome ? 'home' : 'away'}
					onBlur={(e) => {
						const val = e.target.value ? e.target.value === 'home' : null;
						commitUpdate('isHome', val);
					}}
				>
					<option value="">Select a position</option>
					<option value="home">Home</option>
					<option value="away">Away</option>
				</select>
			</td>
			<td className="p-0">
				<input
					ref={opponentRef}
					className="input input-bordered rounded-none w-full"
					placeholder="Type opponent here"
					defaultValue={game.opponent ?? ''}
					onBlur={(e) => commitUpdate('opponent', e.target.value)}
				/>
			</td>
			<td className="p-0">
				<input
					ref={venueRef}
					className="input input-bordered rounded-none w-full"
					placeholder="Type venue here"
					defaultValue={game.venue ?? ''}
					onBlur={(e) => commitUpdate('venue', e.target.value)}
				/>
			</td>
			<td className="p-0">
				<select
					ref={teacherRef}
					className="select select-bordered rounded-none w-full"
					defaultValue={game.teacher ?? ''}
					onBlur={(e) => commitUpdate('teacher', e.target.value)}
				>
					<option value="" disabled>
						Select a teacher
					</option>
					{teachers.map((t) => (
						<option key={t.id} value={t.id}>
							{t.name}
						</option>
					))}
				</select>
			</td>
			<td className="p-0">
				<TeachersMultiSelect
					teachers={teachers}
					value={extraTeachers}
					onChange={(e) => {
						setExtraTeachers(e.target.value);
						commitUpdate('extra_teachers', e.target.value);
					}}
				/>
			</td>
			<td className="p-0">
				<input
					ref={transportationRef}
					className="input input-bordered rounded-none w-full"
					placeholder="Type transportation here"
					defaultValue={game.transportation ?? ''}
					onBlur={(e) => commitUpdate('transportation', e.target.value)}
				/>
			</td>
			<td className="p-0">
				<input
					ref={notesRef}
					className="input input-bordered rounded-none w-full"
					placeholder="Extra info"
					defaultValue={game.notes ?? ''}
					onBlur={(e) => commitUpdate('notes', e.target.value)}
				/>
			</td>
			<td className="p-0">
				<div className="flex justify-center w-full">
					<input
						ref={confirmedRef}
						type="checkbox"
						className="checkbox checkbox-primary"
						defaultChecked={game.confirmed ?? false}
						onChange={(e) => {
							commitUpdate('confirmed', e.target.checked);
						}}
					/>
				</div>
			</td>
			<td className="p-0">
				<input
					ref={outOfClassRef}
					type="time"
					className="bg-base-100 ml-4"
					defaultValue={game.out_of_class ? dayjs(game.out_of_class).format('HH:mm') : ''}
					onBlur={(e) => commitUpdate('out_of_class', formatTime(game.date, e.target.value))}
				/>
			</td>
			<td className="p-0">
				<input
					ref={startRef}
					type="time"
					className="bg-base-100 ml-4"
					defaultValue={game.start ? dayjs(game.start).format('HH:mm') : ''}
					onBlur={(e) => commitUpdate('start', formatTime(game.date, e.target.value))}
				/>
			</td>
			<td className="p-0 last:w-20">
				<div className="flex gap-2 justify-end w-full">
					<button className="btn btn-error" onClick={() => onDelete(game.id)}>
						<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
							<path d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
						</svg>
					</button>
				</div>
			</td>
		</tr>
	);
});
