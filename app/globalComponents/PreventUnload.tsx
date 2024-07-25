'use client';

import { useEffect } from 'react';

export function PreventUnload() {
	useEffect(() => {
		const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			// Legacy method for cross browser support
			e.returnValue = true;
		};
		window.addEventListener('beforeunload', handler);
		return () => window.removeEventListener('beforeunload', handler);
	}, []);

	return null;
}
