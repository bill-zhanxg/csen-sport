import Skeleton from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';

export function SkeletonBlock() {
	return (
		<div className="flex flex-col gap-5 w-full">
			{[...Array(5)].map((_, i) => (
				<Skeleton height={100} baseColor='hsl(var(--b2))' highlightColor='hsl(var(--b1))' key={i} />
			))}
		</div>
	);
}
