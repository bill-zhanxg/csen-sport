'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';

import { showToast } from '@/app/components/Alert';
import { useBeforeUnload } from '@/app/globalComponents/useBeforeUnload';

import { updateGamesBulk } from '../actions';
import { AddGameRow } from './AddGameRow';
import { GameRow } from './GameRow';
import { TableHeader } from './TableHeader';
import { UpdateButton } from './UpdateButton';

import type { SerializedGameWithId } from '@/libs/serializeData';
import type { RawTeacher, RawTeam } from '@/libs/tableData';
import type { GameChanges } from '../actions';

export function GamesTable({
	teams,
	gamesRaw,
	teachers,
}: {
	gamesRaw: SerializedGameWithId[];
	teams: RawTeam[];
	teachers: RawTeacher[];
}) {
	const [games, setGames] = useState<SerializedGameWithId[]>(gamesRaw);
	const changes = useRef<GameChanges[number][]>([]);
	const containerRef = useRef<HTMLDivElement | null>(null);

	const [changed, setChanged] = useState(false);
	const [loading, setLoading] = useState(false);

	useBeforeUnload(changed, 'You have unsaved changes - are you sure you wish to leave this page?');

	useEffect(() => {
		setGames(gamesRaw);
	}, [gamesRaw]);

	// Sort games by date
	const sortedGames = [...games].sort((a, b) => {
		const dateA = a.date ? new Date(a.date).getTime() : 0;
		const dateB = b.date ? new Date(b.date).getTime() : 0;
		return dateA - dateB;
	});

	// Handlers
	const handleUpdate = useCallback((id: string, field: string, value: any) => {
		const index = changes.current.findIndex((change) => change.type !== 'delete' && change.id === id);
		if (index !== -1) {
			(changes.current[index] as any).value[field] = value;
		} else {
			changes.current.push({
				type: 'update',
				id,
				value: { [field]: value } as any,
			});
		}
		setChanged(true);
	}, []);

	const handleDelete = useCallback((id: string) => {
		changes.current.push({ type: 'delete', id });
		setGames((prev) => prev.filter((g) => g.id !== id));
		setChanged(true);
	}, []);

	const handleAdd = useCallback((game: any) => {
		const id = v4();
		changes.current.push({
			type: 'create',
			id,
			value: { ...game, id },
		});
		setGames((prev) => [...prev, { ...game, id }]);
		setChanged(true);
	}, []);

	const handleSubmit = async () => {
		setLoading(true);
		const res = await updateGamesBulk(changes.current);
		if (res?.type === 'success') {
			setChanged(false);
			changes.current = [];
		}
		showToast(res);
		setLoading(false);
	};

	return (
		<>
			<p className="text-xl font-bold mt-4 text-center">Games (Click update button after modify in bulk)</p>
			<div ref={containerRef} className="overflow-x-auto w-full">
				<table className="table text-lg">
					<TableHeader />
					<tbody>
						{sortedGames.map((game) => (
							<GameRow
								key={game.id}
								game={game}
								teams={teams}
								teachers={teachers}
								onUpdate={handleUpdate}
								onDelete={handleDelete}
							/>
						))}
					</tbody>
					<AddGameRow teams={teams} teachers={teachers} onAdd={handleAdd} />
				</table>
			</div>
			<UpdateButton changed={changed} loading={loading} onUpdate={handleSubmit} />
		</>
	);
}
