'use client';

import { SerializedGame } from '@/libs/serializeData';
import { useState } from 'react';
import { toast } from 'sonner';

export function Checkbox({
	game,
	updateConfirmedAction: updateConfirmed,
}: {
	game: SerializedGame;
	updateConfirmedAction: (id: string, checked: boolean) => Promise<boolean>;
}) {
	const [checked, setChecked] = useState(game.confirmed);
	const [loading, setLoading] = useState(false);

	return (
		<input
			type="checkbox"
			className={`checkbox checkbox-primary ${loading ? 'loading' : ''}`}
			checked={loading ? true : checked} // Show as checked during loading to display spinner
			disabled={loading}
			onChange={async () => {
				if (loading) return;
				setLoading(true);

				const promise = updateConfirmed(game.id, !checked);

				toast.promise(promise, {
					loading: `${!checked ? 'Confirming' : 'Unconfirming'} game...`,
					success: (res) => {
						if (res) {
							setChecked(!checked);
							setLoading(false);
							return `Game ${!checked ? 'confirmed' : 'unconfirmed'} successfully`;
						} else {
							setLoading(false);
							throw new Error('Failed to update confirmation');
						}
					},
					error: (err) => {
						setLoading(false);
						console.error('Checkbox update error:', err);
						return `Failed to update game confirmation: ${err.message || 'Unknown error'}. Please try again.`;
					},
				});
			}}
		/>
	);
}
