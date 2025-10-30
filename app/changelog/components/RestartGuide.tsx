'use client';

import { useState } from 'react';

import { resetGuide } from '../actions';

export function RestartGuide() {
	const [loading, setLoading] = useState(false);

	return (
		<button
			className="btn btn-primary w-full max-w-4xl"
			disabled={loading}
			onClick={(e) => {
				e.preventDefault();
				setLoading(true);
				resetGuide();
			}}
		>
			{loading ? (
				<div className="flex items-center justify-center gap-2">
					<span className="loading loading-spinner loading-sm"></span>
					Restarting...
				</div>
			) : (
				'Restart Guide'
			)}
		</button>
	);
}
