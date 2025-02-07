import { SelectedPick } from '@xata.io/client';
import { GamesRecord, getXataClient } from './../libs/xata';

const xata = getXataClient();

(async () => {
	const allGames = await xata.db.games.getAll();

	const gamesByDate = allGames.reduce((acc: Record<string, SelectedPick<GamesRecord, ['*']>[]>, game) => {
        if (!game.date) {
            return acc;
        }
		const date = game.date.toISOString();
		if (!acc[date]) {
			acc[date] = [];
		}
		acc[date].push(game);
		return acc;
	}, {});

	const deleteIds: string[] = [];

	for (const date in gamesByDate) {
		const games = gamesByDate[date];
		if (games.length > 1) {
			games.sort((a, b) => b.xata.createdAt.getTime() - a.xata.createdAt.getTime());

			for (let i = 0; i < games.length - 1; i++) {
				for (let j = i + 1; j < games.length; j++) {
					console.log('Comparing', games[i].id, games[j].id);
					if (
						games[i].opponent === games[j].opponent &&
						games[i].venue?.id === games[j].venue?.id &&
						games[i].start?.getTime() === games[j].start?.getTime() &&
						games[i].teacher?.id === games[j].teacher?.id &&
						games[i].transportation === games[j].transportation &&
						games[i].out_of_class?.getTime() === games[j].out_of_class?.getTime() &&
						JSON.stringify(games[i].extra_teachers) === JSON.stringify(games[j].extra_teachers) &&
						games[i].notes === games[j].notes &&
						games[i].isHome === games[j].isHome &&
						games[i].confirmed === games[j].confirmed &&
						// Double check date
						games[i].date?.toISOString() === games[j].date?.toISOString()
					) {
						console.log('Deleting', games[j].id);
						deleteIds.push(games[j].id);
					}
				}
			}
		}
	}

	console.log('Deleting', deleteIds.length, 'games');

	await xata.db.games.delete(deleteIds);
})();
