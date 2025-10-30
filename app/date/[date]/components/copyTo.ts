import { formatIsJunior } from '@/libs/formatValue';

import type { SerializedGame } from '@/libs/serializeData';

export function copyToText(games: SerializedGame[]): string {
	return [
		['Date', 'Group', 'Team', 'Opponent', 'Venue', 'Teacher', 'Transportation', 'Out of Class', 'Start'].join('\t'),
		...games.map((game) => {
			return [
				game.date?.toLocaleDateString() ?? '---',
				game.team?.isJunior !== undefined ? formatIsJunior(game.team.isJunior) : '---',
				game.team?.name ?? '---',
				game.opponent ?? '---',
				game.venue ?? '---',
				game.teacher?.name ?? '---',
				game.transportation ?? '---',
				game.out_of_class?.toLocaleTimeString() ?? '---',
				game.start?.toLocaleTimeString() ?? '---',
			].join('\t');
		}),
	].join('\n');
}
