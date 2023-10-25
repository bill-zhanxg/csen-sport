import Skeleton from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';

export function SkeletonBlock({ rows = 5, height = 100 }: { rows?: number; height?: number }) {
	return (
		<div className="flex flex-col gap-5 w-full">
			{[...Array(rows)].map((_, i) => (
				<Skeleton
					containerClassName="w-full"
					height={height}
					baseColor="hsl(var(--b2))"
					highlightColor="hsl(var(--b1))"
					key={i}
				/>
			))}
		</div>
	);
}
