'use client';

import { useState } from 'react';

export function ErrorTriggerButton() {
	const [shouldThrow, setShouldThrow] = useState(false);

	if (shouldThrow) {
		throw new Error('Test error triggered by user');
	}

	return (
		<button className="btn btn-error btn-sm fixed bottom-4 right-4 z-50" onClick={() => setShouldThrow(true)}>
			Trigger Error
		</button>
	);
}
