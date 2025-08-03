'use client';

import { SerializedGame } from '@/libs/serializeData';
import { useState } from 'react';

export function Checkbox({
	game,
	updateConfirmedAction: updateConfirmed,
}: {
	game: SerializedGame;
	updateConfirmedAction: (id: string, checked: boolean) => Promise<boolean>;
}) {
	const [checked, setChecked] = useState(game.confirmed);
	const [loading, setLoading] = useState<boolean | 'failed'>(false);

	return (
		<input
			type="checkbox"
			className={`checkbox checkbox-primary ${
				loading === 'failed'
					? " [background:url('/checkbox-error.svg')_no-repeat_center/50%_oklch(var(--er))]!"
					: loading
					? " [background:url('/checkbox-loading.gif')_no-repeat_center/70%_var(--chkbg)]!"
					: ''
			}`}
			checked={checked}
			onChange={async () => {
				if (loading === true) return;
				setLoading(true);
				const res = await updateConfirmed(game.id, !checked);
				if (res) {
					setChecked(!checked);
					setLoading(false);
				} else setLoading('failed');
			}}
		/>
	);
}
