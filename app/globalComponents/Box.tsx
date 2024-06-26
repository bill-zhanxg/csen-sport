import { ReactNode } from 'react';

export function Box({
	children,
	className = 'flex-col p-4',
	id,
}: {
	children: ReactNode;
	className?: string;
	id?: string;
}) {
	return (
		<div
			id={id}
			className={`w-full flex bg-base-200 rounded-xl border-2 border-base-300 shadow-lg shadow-base-300 ${className}`}
		>
			{children}
		</div>
	);
}
