'use client';

import { useEffect, useState } from 'react';
import { TawkEvent, useTawkEvent } from 'tawk-react';

export type TawkLoadStatus = 'loading' | 'loaded' | 'failed';

/**
 * Custom hook to track the loading status of the Tawk.io widget.
 * 
 * @returns Object with current load status and helper functions
 */
export function useTawkStatus() {
	const [status, setStatus] = useState<TawkLoadStatus>('loading');

	// Listen for successful load
	useTawkEvent(TawkEvent.onLoad, () => {
		setStatus('loaded');
	});

	// Check for script load failures
	useEffect(() => {
		// Set up a timeout to detect if tawk never loads
		// This timeout gives tawk.io enough time to load, and if it doesn't load
		// within this timeframe, we assume it failed (likely due to network filtering)
		const timeoutId = setTimeout(() => {
			if (status === 'loading') {
				// Double-check if Tawk_API is available despite no onLoad event
				if (typeof window !== 'undefined' && window.Tawk_API) {
					setStatus('loaded');
				} else {
					setStatus('failed');
				}
			}
		}, 10000); // 10 second timeout

		return () => {
			clearTimeout(timeoutId);
		};
	}, [status]);

	return {
		status,
		isLoaded: status === 'loaded',
		isFailed: status === 'failed',
		isLoading: status === 'loading',
	};
}
