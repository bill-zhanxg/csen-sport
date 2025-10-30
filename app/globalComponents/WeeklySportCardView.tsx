import Link from 'next/link';
import { FaCalendarAlt } from 'react-icons/fa';

import { dayjs } from '@/libs/dayjs';

import { GameCard } from './GameCard';

import type { RawTeacher } from '@/libs/tableData';
import type { DateWithGames } from '@/libs/tableHelpers';
export function WeeklySportCardView({
	date,
	teachers,
	showRelative = false,
	isTeacher,
	lastVisit,
	timezone,
}: {
	date: DateWithGames;
	teachers: RawTeacher[];
	showRelative?: boolean;
	isTeacher: boolean;
	lastVisit: Date;
	timezone: string;
}) {
	return (
		<div className="w-full max-w-7xl">
			{/* Date Header */}
			<div className="flex items-center gap-3 mb-4">
				<div className="bg-primary text-primary-content p-3 rounded-lg">
					<FaCalendarAlt className="w-6 h-6" />
				</div>
				<div>
					<Link
						href={`/date/${date.rawDate.valueOf()}`}
						className="text-2xl font-bold link link-primary hover:link-hover"
					>
						Weekly Sport - {dayjs(date.rawDate).format('LL')}
					</Link>
					{showRelative && (
						<div className="text-sm opacity-70 mt-1">
							{dayjs.tz(date.games[0]?.start ?? date.rawDate, timezone).fromNow()}
						</div>
					)}
				</div>
			</div>

			{/* Games Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(420px,1fr))] gap-4">
				{date.games.map((game) => (
					<GameCard
						key={game.id}
						game={game}
						teachers={teachers}
						isTeacher={isTeacher}
						lastVisit={lastVisit}
						timezone={timezone}
					/>
				))}
			</div>
		</div>
	);
}
