'use client';

import { SerializedGame } from '@/libs/serializeData';
import { MouseEvent } from 'react';
import { renderToString } from 'react-dom/server';
import { CopyTable } from './CopyTable';
import { copyToText } from './copyTo';

export function Copy({ games }: { games: SerializedGame[] }) {
	function onClick(
		event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
		group: 'junior' | 'intermediate' | undefined,
		table = false,
	) {
		if (table) {
			const clipboardItem = new ClipboardItem({
				'text/html': new Blob([renderToString(<CopyTable games={games} />)], { type: 'text/html' }),
				'text/plain': new Blob([copyToText(games)], { type: 'text/plain' }),
			});
			navigator.clipboard.write([clipboardItem]);
		} else {
			let url = location.protocol + '//' + location.host + location.pathname;
			if (group) url += `?view=${group}`;
			navigator.clipboard.writeText(url);
		}
		event.currentTarget.classList.add('tooltip');
	}
	function onMouseLeave(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
		event.currentTarget.classList.remove('tooltip');
	}

	return (
		<div className="join join-vertical lg:join-horizontal w-full lg:w-auto">
			<button
				className="btn tooltip-bottom join-item"
				data-tip="Copied"
				onClick={(e) => onClick(e, undefined)}
				onMouseLeave={onMouseLeave}
			>
				Copy Link to All
			</button>
			<button
				className="btn tooltip-bottom join-item"
				data-tip="Copied"
				onClick={(e) => onClick(e, 'junior')}
				onMouseLeave={onMouseLeave}
			>
				Copy Link to Junior Only
			</button>
			<button
				className="btn tooltip-bottom join-item"
				data-tip="Copied"
				onClick={(e) => onClick(e, 'intermediate')}
				onMouseLeave={onMouseLeave}
			>
				Copy Link to Intermediate Only
			</button>
			<button
				className="btn tooltip-bottom join-item"
				data-tip="Copied"
				onClick={(e) => onClick(e, undefined, true)}
				onMouseLeave={onMouseLeave}
			>
				Copy as Table (Current View)
			</button>
		</div>
	);
}
