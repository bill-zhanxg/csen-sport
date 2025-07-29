import { useBeforeUnload } from '@/app/globalComponents/useBeforeUnload';
import { RowData } from '@tanstack/react-table';
import { Dispatch, SetStateAction } from 'react';
import { Defaults, Games, Teams } from '../types';
import { DefaultSection } from './DefaultSection';
import { GamesTable } from './GamesTable';
import { TeamsTable } from './TeamsTable';

declare module '@tanstack/react-table' {
	interface TableMeta<TData extends RowData> {
		updateData: (rowIndex: number, columnId: string, value: unknown) => void;
	}
}

export function Step2({
	teachers,
	defaults,
	setDefaults,
	teams,
	setTeams,
	fixtures,
	setFixtures,
}: {
	setAlert: (alert: { type: 'success' | 'error'; message: string } | null) => void;
	teachers: { id: string; name?: string | null }[];
	defaults: Defaults;
	setDefaults: Dispatch<SetStateAction<Defaults>>;
	teams: Teams;
	setTeams: Dispatch<SetStateAction<Teams>>;
	fixtures: Games;
	setFixtures: Dispatch<SetStateAction<Games>>;
}) {
	useBeforeUnload(true, 'You have unsaved changes - are you sure you wish to leave this page?');

	return (
		<>
			<DefaultSection defaults={defaults} setDefaults={setDefaults} teachers={teachers} />
			<TeamsTable teams={teams} setTeams={setTeams} setGames={setFixtures} teachers={teachers} defaults={defaults} />
			<GamesTable teams={teams} games={fixtures} setGames={setFixtures} teachers={teachers} defaults={defaults} />
		</>
	);
}
