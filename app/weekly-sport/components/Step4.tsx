import { Dispatch, SetStateAction } from 'react';
import { Games } from './GamesTable';
import { Opponents } from './OpponentsTable';
import { Venues } from './Step2';
import { Teams } from './TeamsTable';

export function Step4({
	setAlert,
	setNextLoading,
	setDisableNext,
	teams,
	opponents,
	venues,
	games,
}: {
	setAlert: Dispatch<
		SetStateAction<{
			type: 'success' | 'error';
			message: string;
		} | null>
	>;
	setNextLoading: Dispatch<SetStateAction<boolean>>;
	setDisableNext: Dispatch<SetStateAction<boolean>>;
	teams: Teams;
	opponents: Opponents;
	venues: Venues;
	games: Games;
}) {
	return <></>;
}
